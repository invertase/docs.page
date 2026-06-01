import { resolveDocsRoute } from "@/lib/docs-routing";
import { BundlerError } from "@/server/docs/bundle";
import { loadDocsConfigForResolvedSha } from "@/server/docs/source-dataset";
import { listGitHubDocFiles } from "@/server/github/tree";
import {
  type McpRepoContext,
  createMcpDescriptor,
  handleMcpDelete,
  handleMcpPost,
} from "@/server/mcp/server";

function privateRepoResponse(error: BundlerError) {
  return Response.json({ error: error.message }, { status: error.code });
}

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

async function resolveRoute(req: Request, context: RouteContext) {
  const { owner, repo } = await context.params;

  if (!owner || !repo) {
    return null;
  }

  return resolveDocsRoute({
    owner,
    repoSegment: repo,
    headers: req.headers,
  });
}

async function loadMcpRepoContext(
  route: Awaited<ReturnType<typeof resolveRoute>>,
): Promise<McpRepoContext | null> {
  if (!route) {
    return null;
  }

  const docList = await listGitHubDocFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });

  if (!docList) {
    return null;
  }

  const config = await loadDocsConfigForResolvedSha({
    owner: docList.source.owner,
    repository: docList.source.repository,
    resolvedSha: docList.resolvedSha,
  });

  if (config.mcp.enabled === false) {
    return null;
  }

  return { route, docList, config };
}

export async function GET(req: Request, context: RouteContext) {
  const route = await resolveRoute(req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  try {
    const context = await loadMcpRepoContext(route);

    if (!context) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return Response.json(await createMcpDescriptor(context), { status: 200 });
  } catch (error) {
    if (error instanceof BundlerError) {
      return privateRepoResponse(error);
    }

    throw error;
  }
}

export async function POST(req: Request, context: RouteContext) {
  const route = await resolveRoute(req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  try {
    const context = await loadMcpRepoContext(route);

    if (!context) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return handleMcpPost(req, context);
  } catch (error) {
    if (error instanceof BundlerError) {
      return privateRepoResponse(error);
    }

    throw error;
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const route = await resolveRoute(_req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  try {
    if (!(await loadMcpRepoContext(route))) {
      return Response.json({ error: "Not found." }, { status: 404 });
    }

    return handleMcpDelete();
  } catch (error) {
    if (error instanceof BundlerError) {
      return privateRepoResponse(error);
    }

    throw error;
  }
}
