import { resolveDocsRoute } from "@/lib/docs-routing";
import { createMcpDescriptor, handleMcpDelete, handleMcpPost } from "@/server/mcp/server";
import { listGitHubDocFiles } from "@/server/github/tree";

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

async function ensureSourceExists(route: Awaited<ReturnType<typeof resolveRoute>>) {
  if (!route) {
    return false;
  }

  const source = await listGitHubDocFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });

  return Boolean(source);
}

export async function GET(req: Request, context: RouteContext) {
  const route = await resolveRoute(req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  if (!(await ensureSourceExists(route))) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  return Response.json(await createMcpDescriptor(route), { status: 200 });
}

export async function POST(req: Request, context: RouteContext) {
  const route = await resolveRoute(req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  if (!(await ensureSourceExists(route))) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }

  return handleMcpPost(req, route);
}

export async function DELETE(_req: Request, context: RouteContext) {
  const route = await resolveRoute(_req, context);

  if (!route) {
    return Response.json({ error: "Missing owner or repo." }, { status: 400 });
  }

  return handleMcpDelete();
}
