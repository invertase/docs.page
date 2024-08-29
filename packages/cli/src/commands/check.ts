import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import type { Command } from "commander";

import { check } from "../check";

export function registerCheckCommand(program: Command) {
  program
    .command("check")
    .description("Check the validity of the docs")
    // Path to the directory to check, defaults to current directory
    .argument(
      "[path]",
      "Path to the relative directory to check. Defaults to the current directory.",
    )
    .action(async (input: unknown, o) => {
      const relativePath = String(input || ".");
      const absolutePath = path.resolve(relativePath);

      let error = false;

      // Get the content of a file using fs (since we're running in Node.js)
      async function getFile(filePath: string) {
        return (
          fs.readFileSync(path.join(absolutePath, filePath), "utf-8") || ""
        );
      }

      for await (const result of check(
        getFilesFromDisk(absolutePath),
        getFile,
      )) {
        // If there is an error, set the error flag
        if (result.type === "error") {
          error = true;
        }

        const message = [
          `${chalk.blueBright(result.filePath)}`,
          ":",
          `${chalk.yellow(result.line)}`,
          ":",
          `${chalk.yellow(result.column)}`,
          " - ",
          result.type === "error" ? chalk.red("error") : chalk.yellow("warn"),
          ": ",
          result.message,
        ];

        console.log(message.join(""));
      }

      // If there is an error, exit with a non-zero code
      process.exit(error ? 1 : 0);
    });
}

function getFilesFromDisk(absolutePath: string): Set<string> {
  const exists = fs.existsSync(absolutePath);

  if (!exists) {
    throw new Error(`The path "${absolutePath}" does not exist.`);
  }

  const files = new Set<string>();

  const nodes = fs.readdirSync(absolutePath, {
    withFileTypes: true,
    recursive: true,
  });

  for (const file of nodes) {
    if (
      file.isFile() &&
      (["docs.json", "docs.yaml"].includes(file.name) ||
        file.name.startsWith("docs/"))
    ) {
      files.add(file.name);
    }
  }

  return files;
}
