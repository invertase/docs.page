import type {
  BundleErrorResponse,
  BundleResponse,
  BundlerOutput,
  SidebarGroup,
} from "../../api/src/types";

// import { COMPONENTS } from "./components/Content";
// import { getBuildHash } from "./utils";

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

const PRODUCTION = process.env.NODE_ENV === "production";

// const API_URL =
//   process.env.API_URL ||
//   (PRODUCTION ? "https://api.docs.page" : "http://localhost:8080");
const API_URL = "https://staging-api.docs.page";

export async function getBundle(args: GetBundleArgs): Promise<BundlerOutput> {
  const params = new URLSearchParams({
    owner: args.owner,
    repository: args.repository,
    // buildHash: getBuildHash(), // TODO(migrate)
  });

  if (args.path) params.append("path", args.path);
  if (args.ref) params.append("ref", args.ref);

  for (const component of Object.keys([])) { // TODO(migrate)
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
  args: GetPreviewBundleArgs,
): Promise<BundlerOutput> {
  const response = await fetch(`${API_URL}/preview`, {
    method: "POST",
    headers: new Headers({
      "docs-page-preview": "true", // Disables caching on preview requests
    }),
    body: JSON.stringify({
      // buildHash: getBuildHash(), // TODO(migrate)
      markdown: args.markdown,
      config: args.config,
      components: Object.keys([]), // TODO(migrate)
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
