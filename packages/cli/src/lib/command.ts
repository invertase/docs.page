import type { Command } from "commander";

import type { GlobalCliOptions } from "./api";

export function getGlobalOptions(command: Command) {
  return command.optsWithGlobals() as GlobalCliOptions;
}

export function wasOptionProvided(command: Command, optionName: string) {
  return command.getOptionValueSource(optionName) === "cli";
}
