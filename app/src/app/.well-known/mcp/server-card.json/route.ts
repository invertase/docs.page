import {
  ROOT_MCP_SERVER_CARD_CACHE_HEADERS,
  setDocsCacheHeaders,
} from "@/proxy";

// MCP server card (SEP-1649): root-domain discovery document probed by
// agent-readiness scanners at exactly /.well-known/mcp/server-card.json.
// docs.page has no single root MCP server — every hosted repository gets its
// own stateless streamable-HTTP server at /{owner}/{repo}/mcp — so this card
// points at the server for docs.page's own hosted docs (invertase/docs.page)
// and explains the per-repository pattern in the description. Tools listed
// here mirror app/src/server/mcp/server.ts; resources are declared "dynamic"
// because each repository serves its own set (the docs.json config schema
// plus any repo skills). Keep this in sync with the MCP server implementation.
const SERVER_CARD = {
  $schema:
    "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
  version: "1.0",
  protocolVersion: "2025-11-25",
  serverInfo: {
    name: "docs.page",
    title: "docs.page Documentation",
    version: "1.0.0",
  },
  description:
    "docs.page hosts a Model Context Protocol server for every documentation site it serves. Servers are per-repository: connect to https://docs.page/{owner}/{repo}/mcp, where {owner}/{repo} is the backing GitHub repository. This card describes the server for docs.page's own documentation (invertase/docs.page); every hosted repository's endpoint exposes the same tools scoped to that repository's docs.",
  documentationUrl: "https://use.docs.page",
  transport: {
    type: "streamable-http",
    endpoint: "https://docs.page/invertase/docs.page/mcp",
  },
  capabilities: {
    tools: {},
    resources: {},
  },
  authentication: {
    required: false,
  },
  tools: [
    {
      name: "read_doc_page",
      description:
        "Read the raw markdown or MDX source for a docs page in the current repository context.",
      inputSchema: {
        type: "object",
        properties: {
          path: {
            type: "string",
            minLength: 1,
          },
        },
        required: ["path"],
      },
    },
    {
      name: "list_doc_files",
      description:
        "List the available `.mdx` docs pages in the current repository context.",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
  resources: "dynamic",
  prompts: [],
};

const SERVER_CARD_JSON = `${JSON.stringify(SERVER_CARD, null, 2)}\n`;

export function GET() {
  const response = new Response(SERVER_CARD_JSON, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  setDocsCacheHeaders(response.headers, ROOT_MCP_SERVER_CARD_CACHE_HEADERS);
  return response;
}
