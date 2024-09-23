import type {
  BundleErrorResponse,
  BundleResponse,
  BundlerOutput,
  SidebarGroup,
} from "../../api/src/types";
import { COMPONENTS } from "./components/Content";
import { getBuildHash } from "./env";

export type {
  BundleResponse,
  BundleErrorResponse,
  BundlerOutput,
  SidebarGroup,
};

type GetBundleArgs = {
  owner: string;
  repository: string;
  ref?: string;
  path?: string;
};

const API_URL = process.env.API_URL || "http://localhost:8080";

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

  const response = await fetch(`${API_URL}/bundle?${params.toString()}`);

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
  args: GetPreviewBundleArgs
): Promise<BundlerOutput> {
  const response = await fetch(`${API_URL}/preview`, {
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
