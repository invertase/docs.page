#!/usr/bin/env node

import { program } from "commander";
import { registerCheckCommand } from "./commands/check";
import { registerInitCommand } from "./commands/init";

program.name("docs.page").version("0.1.0").description("docs.page CLI");
registerInitCommand(program);
registerCheckCommand(program);
program.parse(process.argv);
