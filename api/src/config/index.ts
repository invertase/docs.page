import yaml from "js-yaml";
import { type Config, ConfigSchema } from "./schema";
import { V1ConfigSchema } from "./v1.schema";

export type { Config } from "./schema";

// Given a user config, merges the config with the default config.
export function parseConfig(configs: { json?: string; yaml?: string }): Config {
	let parsedConfig: object = {};

	if (configs.json) {
		parsedConfig = JSON.parse(configs.json);
	} else if (configs.yaml) {
		parsedConfig = yaml.load(configs.yaml) as object;
	}

	const isV1Schema =
		("logo" in parsedConfig && typeof parsedConfig.logo === "string") ||
		("theme" in parsedConfig && typeof parsedConfig.theme === "string");

	if (isV1Schema) {
		return V1ConfigSchema.parse(parsedConfig);
	}

	return ConfigSchema.parse(parsedConfig);
}

export const defaultConfig = ConfigSchema.parse({});
