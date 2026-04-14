import { headers } from "next/headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { buildDocsRepoSitemapXml } from "@/server/docs/sitemap-xml";
import { listGitHubDocFiles } from "@/server/github/tree";

export const runtime = "nodejs";

type RouteProps = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export async function GET(request: Request, { params }: RouteProps) {
  const [{ owner, repo }, requestHeaders] = await Promise.all([params, headers()]);
  const route = resolveDocsRoute({
    owner,
    repoSegment: repo,
    headers: requestHeaders,
  });

  const docList = await listGitHubDocFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });

  if (!docList || docList.files.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const xml = await buildDocsRepoSitemapXml({
    requestUrl: request.url,
    owner: route.owner,
    repoSegment: repo,
    headers: requestHeaders,
    files: docList.files,
  });

  const resHeaders = new Headers({
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  });

  if (docList.truncated) {
    resHeaders.set("x-docs-page-tree-truncated", "1");
  }

  return new Response(xml, { headers: resHeaders });
}
