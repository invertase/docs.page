import yaml from "js-yaml";
import { type Config, ConfigSchema } from "./schema";
import { V1ConfigSchema } from "./v1.schema";

export type { Config } from "./schema";

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

/**
 * Fetch and parse a repository's site config independently of the doc bundle.
 *
 * The bundler throws a 404 for a deleted `.mdx` file *before* it parses the
 * config, so the not-found branch of the page loader has no config to inspect.
 * This reads the `docs.json` / `docs.yaml` blob directly (the same GraphQL call
 * the bundler uses) so config-driven behaviour like `redirects` can still fire
 * for pages whose source has been removed. Returns `null` when no config exists
 * or parsing fails.
 */
export async function fetchConfigForRoute(args: {
  owner: string;
  repository: string;
  ref?: string | null;
  path?: string;
}): Promise<Config | null> {
  const { getGitHubContents } = await import("@/server/github/contents");
  const contents = await getGitHubContents({
    owner: args.owner,
    repository: args.repository,
    ref: args.ref ?? undefined,
    path: args.path || "index",
  });

  if (!contents?.config.configJson && !contents?.config.configYaml) {
    return null;
  }

  try {
    return parseConfig({
      json: contents.config.configJson,
      yaml: contents.config.configYaml,
    });
  } catch {
    return null;
  }
}
