import { resolveDocsRoute } from "@/lib/docs-routing";
import { SITEMAP_CACHE_HEADERS } from "@/proxy";
import { BundlerError } from "@/server/docs/bundle";
import { buildDocsRepoSitemapXml } from "@/server/docs/sitemap-xml";
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

  if (!docList || docList.files.length === 0) {
    return new Response("Not found", { status: 404 });
  }

  const xml = await buildDocsRepoSitemapXml({
    owner: route.owner,
    repoSegment: repo,
    headers: req.headers,
    files: docList.files,
  });

  const response = new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
  response.headers.set("Cache-Control", SITEMAP_CACHE_HEADERS.cacheControl);
  response.headers.set("Surrogate-Control", SITEMAP_CACHE_HEADERS.surrogateControl);

  if (docList.truncated) {
    response.headers.set("x-docs-page-tree-truncated", "1");
  }

  return response;
}
