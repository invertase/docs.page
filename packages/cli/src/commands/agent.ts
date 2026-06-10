import chalk from "chalk";
import type { Command } from "commander";

import { getApiBase, isRecord, parseJson } from "../lib/api";
import { getGlobalOptions } from "../lib/command";
import { CliError } from "../lib/errors";
import { resolveGitHubToken } from "../lib/github";
import {
  canPrompt,
  promptPassword,
  promptSelect,
  promptText,
} from "../lib/prompts";

const PROVIDERS = ["xai", "openai", "anthropic", "google"] as const;

type Provider = (typeof PROVIDERS)[number];

type CreateAgentOptions = {
  repo?: string;
  provider?: string;
  apikey?: string;
  ghAuth?: string;
  force?: boolean;
};

type DeleteAgentOptions = {
  repo?: string;
  ghAuth?: string;
};

const PROVIDER_OPTIONS = PROVIDERS.map((provider) => ({
  value: provider,
  label: provider,
}));

export function registerAgentCommand(program: Command) {
  const agents = program
    .command("agent")
    .description("Manage docs.page documentation agents");

  agents
    .command("create")
    .description("Create a new docs.page agent")
    .option("--repo <org/name>", "GitHub repository in the form org/name")
    .option("--provider <provider>", `Provider: ${PROVIDERS.join(", ")}`)
    .option("--apikey <key>", "Provider API key to store for the agent")
    .option(
      "--gh-auth <token>",
      "GitHub auth token to use instead of `gh auth token`",
    )
    .option("--force", "Overwrite an existing agent configuration")
    .action(async (options: CreateAgentOptions, command: Command) => {
      const repo = await resolveRepo(options.repo, "--repo");
      const provider = await resolveProvider(options.provider);
      const apikey = await resolveApiKey(options.apikey);
      const githubToken = await resolveGitHubToken(options.ghAuth);
      const globalOptions = getGlobalOptions(command);
      const token = await createAgent({
        apiBase: getApiBase(globalOptions.apiUrl),
        repo,
        provider,
        apikey,
        githubToken,
        force: Boolean(options.force),
      });

      printAgentInstructions(repo, token);
    });

  agents
    .command("delete")
    .description("Delete a docs.page agent")
    .option("--repo <org/name>", "GitHub repository in the form org/name")
    .option(
      "--gh-auth <token>",
      "GitHub auth token to use instead of `gh auth token`",
    )
    .action(async (options: DeleteAgentOptions, command: Command) => {
      const repo = await resolveRepo(options.repo, "--repo");
      const githubToken = await resolveGitHubToken(options.ghAuth);
      const globalOptions = getGlobalOptions(command);

      await deleteAgent({
        apiBase: getApiBase(globalOptions.apiUrl),
        repo,
        githubToken,
      });

      console.log(chalk.green(`Deleted agent for ${repo}.`));
    });
}

async function resolveRepo(value: string | undefined, flag: string) {
  if (value?.trim()) {
    return validateRepo(value);
  }

  if (canPrompt()) {
    return validateRepo(
      await promptText({
        message: "GitHub repository",
        flag,
        validate: (input) => {
          try {
            validateRepo(input ?? "");
            return undefined;
          } catch (error) {
            return error instanceof Error
              ? error.message
              : "Invalid repository.";
          }
        },
      }),
    );
  }

  throw new CliError(`Missing ${flag}.`);
}

async function resolveProvider(value: string | undefined) {
  if (value?.trim()) {
    return validateProvider(value);
  }

  return promptSelect({
    message: "Provider",
    flag: "--provider",
    options: PROVIDER_OPTIONS,
    initialValue: "google",
  });
}

async function resolveApiKey(value: string | undefined) {
  if (value?.trim()) {
    return validateApiKey(value);
  }

  return validateApiKey(
    await promptPassword({
      message: "Provider API key",
      flag: "--apikey",
      validate: (input) =>
        (input ?? "").trim().length > 1
          ? undefined
          : "API key must be longer than 1 character.",
    }),
  );
}

function validateRepo(repo: string) {
  const trimmedRepo = repo.trim();
  const [owner, name, ...rest] = trimmedRepo.split("/");

  if (!owner || !name || rest.length > 0 || /\s/.test(trimmedRepo)) {
    throw new CliError("`--repo` must be in the form `org/name`.");
  }

  return trimmedRepo;
}

function validateProvider(provider: string): Provider {
  const trimmedProvider = provider.trim();

  if (isProvider(trimmedProvider)) {
    return trimmedProvider;
  }

  throw new CliError(`\`--provider\` must be one of: ${PROVIDERS.join(", ")}.`);
}

function validateApiKey(apikey: string) {
  const trimmedApiKey = apikey.trim();

  if (trimmedApiKey.length <= 1) {
    throw new CliError("`--apikey` must be longer than 1 character.");
  }

  return trimmedApiKey;
}

async function createAgent({
  apiBase,
  repo,
  provider,
  apikey,
  githubToken,
  force,
}: {
  apiBase: string;
  repo: string;
  provider: Provider;
  apikey: string;
  githubToken: string;
  force: boolean;
}) {
  const response = await fetch(`${apiBase}/api/agent/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo,
      provider,
      apikey,
      githubToken,
      force,
    }),
  });

  const responseText = await response.text();
  const json = parseJson(responseText);

  if (isRecord(json) && typeof json.error === "string") {
    throw new CliError(json.error);
  }

  if (!response.ok) {
    throw new CliError(
      `Agent creation failed (${response.status} ${response.statusText}).`,
    );
  }

  if (isRecord(json)) {
    const token = getString(json, "token") ?? getString(json, "id");

    if (token) {
      return token;
    }
  }

  throw new CliError(
    "Agent creation failed: response did not include a token.",
  );
}

async function deleteAgent({
  apiBase,
  repo,
  githubToken,
}: {
  apiBase: string;
  repo: string;
  githubToken: string;
}) {
  const response = await fetch(`${apiBase}/api/agent`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      repo,
      githubToken,
    }),
  });

  const responseText = await response.text();
  const json = parseJson(responseText);

  if (isRecord(json) && typeof json.error === "string") {
    throw new CliError(json.error);
  }

  if (!response.ok) {
    throw new CliError(
      `Agent deletion failed (${response.status} ${response.statusText}).`,
    );
  }
}

function printAgentInstructions(repo: string, token: string) {
  console.log(chalk.green("Your documentation agent is ready to use."));
  console.log(
    `Add the following configuration to your docs.json file in the ${repo} repository:\n`,
  );
  console.log(
    ["```json", '"agent": {', `  "key": "${token}"`, "}", "```"].join("\n"),
  );
  console.log("\nTo learn more, view https://use.docs.page/agent.");
}

function isProvider(value: string): value is Provider {
  return PROVIDERS.includes(value as Provider);
}

function getString(value: Record<string, unknown>, key: string) {
  const result = value[key];

  return typeof result === "string" && result.trim()
    ? result.trim()
    : undefined;
}
