import { getGitHubContents } from "@/server/github/contents";
import { type Config, parseConfig } from "./index";

/**
 * Fetch and parse a repository's site config independently of the doc bundle.
 *
 * The bundler throws a 404 for a deleted `.mdx` file *before* it parses the
 * config, so the not-found branch of the page loader has no config to inspect.
 * This reads the `docs.json` / `docs.yaml` blob directly (the same GraphQL call
 * the bundler uses) so config-driven behaviour like `redirects` can still fire
 * for pages whose source has been removed. Returns `null` when no config exists
 * or parsing fails.
 *
 * This lives in its own server-only module (not `./index`) because `./index` is
 * imported by client components for `parseConfig` / `defaultConfig`, and pulling
 * the GitHub/redis server graph into that module breaks the browser build.
 */
export async function fetchConfigForRoute(args: {
  owner: string;
  repository: string;
  ref?: string | null;
  path?: string;
}): Promise<Config | null> {
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
