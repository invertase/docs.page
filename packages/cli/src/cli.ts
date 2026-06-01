#!/usr/bin/env bun

import { Option, program } from "commander";

import { registerAgentCommand } from "./commands/agent";
import { registerInitCommand } from "./commands/init";
// import { registerPreviewCommand } from "./commands/preview";

program.name("docs.page").version("0.1.0").description("docs.page CLI");
program.addOption(
  new Option("--api-url <url>")
    .default(
      process.env.DOCS_PAGE_API_BASE?.trim() ||
        "https://docspage-production.up.railway.app",
    )
    .hideHelp(),
);

registerInitCommand(program);
// registerPreviewCommand(program);
registerAgentCommand(program);

program.parse(process.argv);
