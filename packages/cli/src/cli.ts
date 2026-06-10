#!/usr/bin/env node

import { Command, Option } from "commander";

import { registerAgentCommand } from "./commands/agent";
import { registerCheckCommand } from "./commands/check";
import { registerInitCommand } from "./commands/init";
import { DEFAULT_API_BASE_URL } from "./lib/api";
import { handleCliError } from "./lib/errors";

const program = new Command();

program.name("docs").version("2.0.0").description("docs.page CLI");
program.addOption(
  new Option("--api-url <url>", "Base docs.page API URL").default(
    process.env.DOCS_PAGE_API_BASE?.trim() || DEFAULT_API_BASE_URL,
  ),
);

registerInitCommand(program);
registerCheckCommand(program);
registerAgentCommand(program);

program.parseAsync(process.argv).catch(handleCliError);
