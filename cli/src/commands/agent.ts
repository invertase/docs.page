import { spawn } from "node:child_process";

import chalk from "chalk";
import type { Command } from "commander";

const DEFAULT_API_BASE = "https://docs.page";

type CreateAgentOptions = {
  repo: string;
  model: string;
  token: string;
  auth?: string;
};

type CommandError = Error & {
  code?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
};

export function registerAgentCommand(program: Command) {
  const agents = program
    .command("agent")
    .description("Work with docs.page agent tooling");

  agents
    .command("create")
    .description("Create a new docs.page agent")
    .requiredOption(
      "--repo <org/name>",
      "GitHub repository in the form org/name",
    )
    .requiredOption("--model <string>", "Model identifier to use for the agent")
    .requiredOption("--token <string>", "Docs.page token to send to the API")
    .option(
      "--auth <string>",
      "GitHub auth token to use instead of `gh auth token`",
    )
    .action(async (options: CreateAgentOptions) => {
      try {
        const repo = validateRepo(options.repo);
        const model = validateModel(options.model);
        const token = validateToken(options.token);
        const githubToken = await resolveGitHubToken(options.auth);
        const agentToken = await createAgent({
          apiBase: getApiBase(),
          repo,
          model,
          token,
          githubToken,
        });

        console.log(agentToken);
      } catch (error) {
        console.error(chalk.red(getErrorMessage(error)));
        process.exit(1);
      }
    });
}

function validateRepo(repo: string) {
  const trimmedRepo = repo.trim();
  const [owner, name, ...rest] = trimmedRepo.split("/");

  if (!owner || !name || rest.length > 0) {
    throw new Error("`--repo` must be in the form `org/name`.");
  }

  return trimmedRepo;
}

function validateModel(model: string) {
  const trimmedModel = model.trim();

  if (!trimmedModel) {
    throw new Error("`--model` must be a non-empty string.");
  }

  return trimmedModel;
}

function validateToken(token: string) {
  const trimmedToken = token.trim();

  if (trimmedToken.length <= 1) {
    throw new Error("`--token` must be longer than 1 character.");
  }

  return trimmedToken;
}

function getApiBase() {
  const configuredBase = process.env.DOCS_PAGE_API_BASE?.trim();

  return (configuredBase || DEFAULT_API_BASE).replace(/\/+$/, "");
}

async function resolveGitHubToken(auth?: string) {
  const providedToken = auth?.trim();

  if (providedToken) {
    return providedToken;
  }

  try {
    await runCommand("gh", ["--version"]);
  } catch (error) {
    const commandError = error as CommandError;

    if (commandError.code === "ENOENT") {
      throw new Error(
        "GitHub CLI (`gh`) is required when `--auth` is not provided.",
      );
    }

    throw new Error(
      "Unable to verify the GitHub CLI. Make sure `gh` is installed and available on your PATH.",
    );
  }

  try {
    const { stdout } = await runCommand("gh", ["auth", "token"]);
    const ghToken = stdout.trim();

    if (!ghToken) {
      throw new Error("GitHub CLI did not return an auth token.");
    }

    return ghToken;
  } catch {
    throw new Error(
      "Unable to read a GitHub auth token from `gh`. Make sure you are logged in with `gh auth login`, or pass `--auth`.",
    );
  }
}

async function createAgent({
  apiBase,
  repo,
  model,
  token,
  githubToken,
}: {
  apiBase: string;
  repo: string;
  model: string;
  token: string;
  githubToken: string;
}) {
  const response = await fetch(`${apiBase}/api/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo,
      model,
      token,
      githubToken,
    }),
  });

  const json = await response.json() as object;

  if ('error' in json) {
    throw new Error(String(json.error));
  }
  
  if ('token' in json) {
    return json.token;
  }

  throw new Error("Agent creation failed: unknown error");
}

function parseJson(value: string) {
  if (!value.trim()) {
    return null;
  }

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function runCommand(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.once("error", (error) => {
      if (settled) {
        return;
      }

      settled = true;

      const commandError = error as CommandError;
      commandError.stdout = stdout;
      commandError.stderr = stderr;
      reject(commandError);
    });

    child.once("close", (exitCode) => {
      if (settled) {
        return;
      }

      settled = true;

      if (exitCode === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const error = new Error(
        stderr.trim() || `Command failed: ${command} ${args.join(" ")}`,
      ) as CommandError;
      error.stdout = stdout;
      error.stderr = stderr;
      error.exitCode = exitCode;
      reject(error);
    });
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unknown error occurred.";
}
