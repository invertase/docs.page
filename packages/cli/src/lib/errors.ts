import chalk from "chalk";

export class CliError extends Error {
  readonly exitCode: number;

  constructor(message: string, exitCode = 1) {
    super(message);
    this.name = "CliError";
    this.exitCode = exitCode;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unknown error occurred.";
}

export function handleCliError(error: unknown) {
  const exitCode = error instanceof CliError ? error.exitCode : 1;

  console.error(chalk.red(getErrorMessage(error)));
  process.exitCode = exitCode;
}

export function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}
