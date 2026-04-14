import { headers } from "next/headers";

import { resolveDocsRoute } from "@/lib/docs-routing";
import {
  emptyDocsFlexSearchPayload,
  getCachedDocsFlexSearchIndex,
  isPinnedCommitRef,
} from "@/server/docs/search-index";
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

  if (!docList) {
    return new Response("Not found", { status: 404 });
  }

  const payload =
    docList.files.length === 0
      ? emptyDocsFlexSearchPayload(docList)
      : await getCachedDocsFlexSearchIndex(
          route.owner,
          route.repository,
          docList.resolvedSha,
          isPinnedCommitRef(route.ref),
        );

  const resHeaders = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  });

  if (docList.truncated) {
    resHeaders.set("x-docs-page-tree-truncated", "1");
  }

  return Response.json(payload, { headers: resHeaders });
}
