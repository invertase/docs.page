#!/usr/bin/env bun

import { program } from "commander";

import { registerAgentCommand } from "./commands/agent";
import { registerInitCommand } from "./commands/init";
import { registerPreviewCommand } from "./commands/preview";

program.name("docs.page").version("0.1.0").description("docs.page CLI");

registerInitCommand(program);
registerPreviewCommand(program);
registerAgentCommand(program);

program.parse(process.argv);
