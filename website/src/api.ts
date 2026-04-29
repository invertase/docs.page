import type {
  BundleErrorResponse,
  BundleResponse,
  BundlerOutput,
  SidebarGroup,
} from "../../api/src/types";
import { COMPONENTS } from "./components/Content";
import { getBuildHash } from "./env";

export type {
  BundleErrorResponse,
  BundleResponse,
  BundlerOutput,
  SidebarGroup,
};

type GetBundleArgs = {
  owner: string;
  repository: string;
  ref?: string;
  path?: string;
};

/** Bundler base URL (no trailing slash). Production deployments should set `API_URL`. */
function bundlerApiUrl(): string {
  if (process.env.API_URL) return process.env.API_URL;
  // `next dev` without the local api/ service: avoid unreachable localhost:8080.
  if (process.env.NODE_ENV === "development") {
    return "https://staging-api.docs.page";
  }
  return "http://localhost:8080";
}

const API_URL = bundlerApiUrl();

async function bundlerFetch(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not reach the docs bundler at ${API_URL}. ` +
        `If you run the API locally, set API_URL=http://localhost:8080 in website/.env.local. ` +
        `Otherwise pick a reachable bundler base URL (e.g. https://staging-api.docs.page). ` +
        `(${detail})`,
      { cause: error },
    );
  }
}

export async function getBundle(args: GetBundleArgs): Promise<BundlerOutput> {
  const params = new URLSearchParams({
    owner: args.owner,
    repository: args.repository,
    buildHash: getBuildHash(),
  });

  if (args.path) params.append("path", args.path);
  if (args.ref) params.append("ref", args.ref);

  for (const component of Object.keys(COMPONENTS)) {
    params.append("components", component);
  }

  const response = await bundlerFetch(`${API_URL}/bundle?${params.toString()}`);

  const json = await response.json();

  if (!response.ok) {
    throw new Response(JSON.stringify(json), {
      headers: {
        "Content-Type": "application/json",
      },
      status: response.status,
    });
  }

  return json.data as BundlerOutput;
}

type GetPreviewBundleArgs = {
  markdown: string;
  config: {
    json?: string;
    yaml?: string;
  };
};

export async function getPreviewBundle(
  args: GetPreviewBundleArgs,
): Promise<BundlerOutput> {
  const response = await bundlerFetch(`${API_URL}/preview`, {
    method: "POST",
    headers: new Headers({
      "docs-page-preview": "true", // Disables caching on preview requests
    }),
    body: JSON.stringify({
      buildHash: getBuildHash(),
      markdown: args.markdown,
      config: args.config,
      components: Object.keys(COMPONENTS),
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Response(JSON.stringify(json), {
      headers: {
        "Content-Type": "application/json",
      },
      status: response.status,
    });
  }

  return json.data as BundlerOutput;
}
