import chalk from "chalk";
import type { Command } from "commander";

export function registerAgentsCommand(program: Command) {
  const agents = program
    .command("agents")
    .description("Work with docs.page agent tooling");

  agents
    .command("create")
    .description("Create a new docs.page agent")
    .action(() => {
      console.log(chalk.yellow("The agents create command is not implemented yet."));
    });
}
