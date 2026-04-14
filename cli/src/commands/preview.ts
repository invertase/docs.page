import chalk from "chalk";
import type { Command } from "commander";

export function registerPreviewCommand(program: Command) {
  program
    .command("preview")
    .description("Preview your documentation site locally")
    .action(() => {
      console.log(
        chalk.yellow("The preview command is not implemented yet."),
        "For now, visit https://docs.page/preview in your browser.",
      );
    });
}
