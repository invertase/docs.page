import { getCustomDomain } from "@/lib/custom-domain";
import { resolvePublicSitemapUrl } from "@/lib/docs-canonical";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { ROBOTS_TXT_CACHE_HEADERS, setDocsCacheHeaders } from "@/proxy";
import { BundlerError } from "@/server/docs/bundle";
import { buildDocsRepoRobotsTxt } from "@/server/docs/robots-txt";
import { loadDocsConfigForResolvedSha } from "@/server/docs/source-dataset";
import {
  type GitHubDocFileList,
  listGitHubDocFiles,
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

  const [customDomain, config] = await Promise.all([
    getCustomDomain(route.owner, route.repository),
    loadDocsConfigForResolvedSha({
      owner: docList.source.owner,
      repository: docList.source.repository,
      resolvedSha: docList.resolvedSha,
    }),
  ]);

  const body = buildDocsRepoRobotsTxt({
    sitemapUrl: resolvePublicSitemapUrl(route, customDomain, req.headers),
    noindex: config.seo?.noindex === true,
  });

  const response = new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
  setDocsCacheHeaders(response.headers, ROBOTS_TXT_CACHE_HEADERS);

  return response;
}
