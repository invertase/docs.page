import { resolveDocsRoute } from "@/lib/docs-routing";
import { SEARCH_CACHE_HEADERS } from "@/proxy";
import { BundlerError } from "@/server/docs/bundle";
import { buildDocsFlexSearchIndex, emptyDocsFlexSearchPayload } from "@/server/docs/search-index";
import {
  listGitHubDocFiles,
  type GitHubDocFileList,
} from "@/server/github/tree";

type RouteContext = {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
};

export async function GET(req: Request, context: RouteContext) {
  const { owner, repo } = await context.params;

  if (!owner || !repo) {
    return new Response("Missing owner or repo", { status: 400 });
  }

  const route = resolveDocsRoute({
    owner,
    repoSegment: repo,
    headers: req.headers,
  });
  let docList: GitHubDocFileList | undefined;

  try {
    docList = await listGitHubDocFiles({
      owner: route.owner,
      repository: route.repository,
      ref: route.ref ?? undefined,
    });
  } catch (error) {
    if (error instanceof BundlerError) {
      return new Response(error.message, { status: error.code });
    }

    throw error;
  }

  if (!docList) {
    return new Response("Not found", { status: 404 });
  }

  const payload =
    docList.files.length === 0
      ? emptyDocsFlexSearchPayload(docList)
      : await buildDocsFlexSearchIndex(docList);

  const response = Response.json(payload, { status: 200 });
  response.headers.set("Cache-Control", SEARCH_CACHE_HEADERS.cacheControl);
  response.headers.set("Surrogate-Control", SEARCH_CACHE_HEADERS.surrogateControl);

  if (docList.truncated) {
    response.headers.set("x-docs-page-tree-truncated", "1");
  }

  return response;
}
