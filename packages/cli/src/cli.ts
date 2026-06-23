#!/usr/bin/env node

import { Command, Option } from "commander";

import { registerAgentCommand } from "./commands/agent";
import { registerCheckCommand } from "./commands/check";
import { registerInitCommand } from "./commands/init";
import { registerPreviewCommand } from "./commands/preview";
import { DEFAULT_API_BASE_URL } from "./lib/api";
import { handleCliError } from "./lib/errors";
import { version } from "../package.json";

const program = new Command();

program.name("docs").version(version).description("docs.page CLI");
program.addOption(
  new Option("--api-url <url>", "Base docs.page API URL").default(
    process.env.DOCS_PAGE_API_BASE?.trim() || DEFAULT_API_BASE_URL,
  ),
);

registerInitCommand(program);
registerCheckCommand(program);
registerPreviewCommand(program);
registerAgentCommand(program);

program.parseAsync(process.argv).catch(handleCliError);
