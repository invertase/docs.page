import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp";
import * as z from "zod";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import { getPostHogClient } from "@/lib/posthog";
import type { Config } from "@/server/config";
import { ConfigSchema } from "@/server/config/schema";
import { BundlerError } from "@/server/docs/bundle";
import { getRawDocSource } from "@/server/docs/raw";
import { getGitHubFileSource } from "@/server/github/contents";
import {
  type GitHubDocFileList,
  type GitHubSkillFileList,
  listGitHubSkillFiles,
} from "@/server/github/tree";

const MCP_SERVER_VERSION = "1.0.0";
const CONFIG_SCHEMA_URI = "docs-page://schema/config";
const ReadDocToolSchema = z.object({
  path: z.string().min(1),
});
const ListDocFilesToolSchema = z.object({});

export type McpRepoContext = {
  route: ResolvedDocsRoute;
  docList: GitHubDocFileList;
  config: Config;
};

type McpServerMetadata = {
  name: string;
  description: string;
};

function getMcpServerMetadata(context: McpRepoContext): McpServerMetadata {
  const { route, docList, config } = context;
  const name =
    config.name?.trim() ||
    `${docList.source.owner}/${docList.source.repository}`;
  const description =
    config.description?.trim() ||
    `Documentation for ${docList.source.owner}/${docList.source.repository}${route.ref ? ` at ref ${route.ref}` : ""}.`;

  return {
    name,
    description,
  };
}

async function getMcpSkillResources(
  route: ResolvedDocsRoute,
): Promise<GitHubSkillFileList | undefined> {
  return listGitHubSkillFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });
}

export async function createMcpDescriptor(context: McpRepoContext) {
  const [metadata, skillList] = await Promise.all([
    Promise.resolve(getMcpServerMetadata(context)),
    getMcpSkillResources(context.route),
  ]);
  const skillResources = skillList?.skills ?? [];
  const readDocSchema = ReadDocToolSchema.describe(
    "Read a docs.page markdown or MDX source file.",
  ).toJSONSchema({ io: "input", unrepresentable: "any" });
  const listDocFilesSchema = ListDocFilesToolSchema.describe(
    "List docs.page `.mdx` pages available in the current repository context.",
  ).toJSONSchema({ io: "input", unrepresentable: "any" });

  return {
    server: {
      name: metadata.name,
      description: metadata.description,
      version: MCP_SERVER_VERSION,
      transport: "http",
    },
    repoContext: {
      owner: context.route.owner,
      repository: context.route.repository,
      ref: context.route.ref,
      requestMode: context.route.requestMode,
    },
    capabilities: {
      tools: {
        read_doc_page: {
          name: "read_doc_page",
          description:
            "Read the raw markdown or MDX source for a docs page in the current repository context.",
          inputSchema: readDocSchema,
        },
        list_doc_files: {
          name: "list_doc_files",
          description:
            "List the available `.mdx` docs pages in the current repository context.",
          inputSchema: listDocFilesSchema,
        },
      },
      resources: [
        {
          uri: CONFIG_SCHEMA_URI,
          name: "docs-page-config-schema",
          description: "JSON schema for docs.page config files.",
          mimeType: "application/json",
        },
        ...skillResources.map((skill) => ({
          uri: skill.uri,
          name: skill.name,
          description: `Skill from ${skill.sourcePath}`,
          mimeType: "text/markdown",
        })),
      ],
      prompts: [],
    },
  };
}

async function createMcpServer(context: McpRepoContext) {
  const { route, docList } = context;
  const posthog = getPostHogClient();
  const captureToolCall = (tool: string) => {
    posthog?.capture({
      distinctId: `${route.owner}/${route.repository}`,
      event: "mcp:tool_call",
      properties: {
        owner: route.owner,
        repository: route.repository,
        ref: route.ref ?? null,
        tool,
        $process_person_profile: false,
      },
    });
  };
  const [metadata, skillList] = await Promise.all([
    Promise.resolve(getMcpServerMetadata(context)),
    getMcpSkillResources(route),
  ]);
  const skillResources = skillList?.skills ?? [];
  const resolvedSha = docList.resolvedSha;
  const server = new McpServer(
    {
      name: metadata.name,
      version: MCP_SERVER_VERSION,
    },
    {
      capabilities: {},
      instructions: `${metadata.description} This MCP server is scoped to ${route.owner}/${route.repository}${route.ref ? ` at ref ${route.ref}` : ""}.`,
    },
  );

  server.registerResource(
    "docs-page-config-schema",
    CONFIG_SCHEMA_URI,
    {
      description: "JSON schema for docs.page config files.",
      mimeType: "application/json",
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.toString(),
            mimeType: "application/json",
            text: JSON.stringify(
              ConfigSchema.toJSONSchema({
                io: "input",
                unrepresentable: "any",
              }),
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  for (const skill of skillResources) {
    server.registerResource(
      skill.name,
      skill.uri,
      {
        description: `Skill from ${skill.sourcePath}`,
        mimeType: "text/markdown",
      },
      async (uri) => {
        const file = await getGitHubFileSource({
          owner: skill.owner,
          repository: skill.repository,
          resolvedSha: skillList?.resolvedSha ?? resolvedSha,
          path: skill.sourcePath,
        });

        if (!file) {
          return {
            contents: [
              {
                uri: uri.toString(),
                mimeType: "text/markdown",
                text: `Unable to read skill content from ${skill.sourcePath}.`,
              },
            ],
          };
        }

        return {
          contents: [
            {
              uri: uri.toString(),
              mimeType: "text/markdown",
              text: file.content,
            },
          ],
        };
      },
    );
  }

  server.registerTool(
    "read_doc_page",
    {
      description:
        "Read the raw markdown or MDX source for a docs page in the current repository context.",
      inputSchema: {
        path: z.string().min(1),
      },
    } as unknown as never,
    (async (args: unknown) => {
      captureToolCall("read_doc_page");
      const { path } = ReadDocToolSchema.parse(args);

      try {
        const source = await getRawDocSource(
          {
            owner: route.owner,
            repository: route.repository,
            ref: route.ref ?? undefined,
            path,
          },
          { resolvedSha, skipAccessCheck: true },
        );

        return {
          content: [
            {
              type: "text",
              text: source.content,
            },
          ],
        };
      } catch (error) {
        if (error instanceof BundlerError) {
          return {
            content: [
              {
                type: "text",
                text: error.message,
              },
            ],
            isError: true,
          };
        }

        throw error;
      }
    }) as never,
  );

  server.registerTool(
    "list_doc_files",
    {
      description:
        "List the available `.mdx` docs pages in the current repository context.",
      inputSchema: {},
    } as unknown as never,
    (async (args: unknown) => {
      captureToolCall("list_doc_files");
      ListDocFilesToolSchema.parse(args ?? {});

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(docList, null, 2),
          },
        ],
      };
    }) as never,
  );

  return server;
}

function createTransport() {
  return new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
}

function jsonRpcError(status: number, code: number, message: string) {
  return Response.json(
    {
      jsonrpc: "2.0",
      error: {
        code,
        message,
      },
      id: null,
    },
    { status },
  );
}

export async function handleMcpPost(request: Request, context: McpRepoContext) {
  const body = await request.json().catch(() => undefined);
  const server = await createMcpServer(context);
  const transport = createTransport();

  try {
    await server.connect(transport);

    return await transport.handleRequest(request, {
      parsedBody: body,
    });
  } finally {
    await transport.close();
    await server.close();
  }
}

export function handleMcpDelete() {
  return jsonRpcError(405, -32000, "Method not allowed.");
}
