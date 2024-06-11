import { z } from 'zod';
import yaml from 'js-yaml';
import { type Config, ConfigSchema } from './schema';
import { V1ConfigSchema } from './v1.schema';

export type { Config } from './schema';

// Given a user config, merges the config with the default config.
export function parseConfig(configs: { json?: string; yaml?: string }): Config {
  let parsedConfig: unknown;

  if (configs.json) {
    parsedConfig = JSON.parse(configs.json);
  } else if (configs.yaml) {
    parsedConfig = yaml.load(configs.yaml);
  }

  // Get the version of the config from the parsed config.
  const { version } = z
    .object({
      version: z.union([z.literal(1), z.literal(2)]).catch(1),
    })
    .catch({ version: 1 })
    .parse(parsedConfig);

  if (version === 1) {
    return V1ConfigSchema.parse(parsedConfig);
  }

  return ConfigSchema.parse(parsedConfig);
}

export const defaultConfig = ConfigSchema.parse({});
