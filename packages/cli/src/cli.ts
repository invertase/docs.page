#!/usr/bin/env node

import path from "node:path";
import { program } from "commander";
import chalk from "chalk";
import { check } from "./check";

// Setup the program
program.name("docs.page").version("0.1.0").description("docs.page CLI");

// Add the check command
program
  .command("check")
  .description("Check the validity of the docs")
  // Path to the directory to check, defaults to current directory
  .argument(
    "[path]",
    "Path to the relative directory to check. Defaults to the current directory."
  )
  .action((input: unknown, o) => {
    const relativePath = String(input || ".");
    const absolutePath = path.resolve(relativePath);

    let error = false;

    for (const result of check(absolutePath)) {
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

program.parse(process.argv);
