import { resolveDocsRoute } from "@/lib/docs-routing";
import {
  createMcpDescriptor,
  handleMcpDelete,
  handleMcpPost,
} from "@/server/mcp/server";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

async function getRouteContext(request: Request, params: RouteProps["params"]) {
  const { owner, repo } = await params;

  return resolveDocsRoute({
    owner,
    repoSegment: repo,
    headers: request.headers,
  });
}

export async function GET(request: Request, { params }: RouteProps) {
  const route = await getRouteContext(request, params);
  return Response.json(await createMcpDescriptor(route));
}

export async function POST(request: Request, { params }: RouteProps) {
  const route = await getRouteContext(request, params);
  return handleMcpPost(request, route);
}

export async function DELETE(request: Request, { params }: RouteProps) {
  await getRouteContext(request, params);
  return handleMcpDelete();
}
