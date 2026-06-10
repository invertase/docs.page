import { spawn } from "node:child_process";

import { CliError } from "./errors";

type CommandError = Error & {
  code?: string;
  stdout?: string;
  stderr?: string;
  exitCode?: number | null;
};

export async function resolveGitHubToken(ghAuth?: string) {
  const providedToken = ghAuth?.trim();

  if (providedToken) {
    return providedToken;
  }

  try {
    await runCommand("gh", ["--version"]);
  } catch (error) {
    const commandError = error as CommandError;

    if (commandError.code === "ENOENT") {
      throw new CliError(
        "GitHub CLI (`gh`) is required when `--gh-auth` is not provided.",
      );
    }

    throw new CliError(
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
    throw new CliError(
      "Unable to read a GitHub auth token from `gh`. Run `gh auth login`, or pass `--gh-auth`.",
    );
  }
}

function runCommand(command: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let settled = false;

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer) => {
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
