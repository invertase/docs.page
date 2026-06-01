import { resolvePublicDocsPublishingContext } from "@/lib/docs-canonical";
import { buildPublicPathname } from "@/lib/docs-paths";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { LLMS_TXT_CACHE_HEADERS } from "@/proxy";
import { BundlerError } from "@/server/docs/bundle";
import {
  buildDocsSourceDataset,
  loadDocsConfigForResolvedSha,
} from "@/server/docs/source-dataset";
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

  const { owner: ghOwner, repository: ghRepo } = docList.source;
  const { origin, pathRoute } = await resolvePublicDocsPublishingContext({
    owner,
    repoSegment: repo,
    headers: req.headers,
  });

  const [config, dataset] = await Promise.all([
    loadDocsConfigForResolvedSha({
      owner: ghOwner,
      repository: ghRepo,
      resolvedSha: docList.resolvedSha,
    }),
    buildDocsSourceDataset(docList),
  ]);

  const siteTitle = config.name?.trim() || `${ghOwner}/${ghRepo}`;
  const siteDescription =
    config.description?.trim() ||
    `Documentation for ${ghOwner}/${ghRepo}${route.ref ? ` at ref ${route.ref}` : ""}.`;

  const lines: string[] = [
    `# ${siteTitle}`,
    "",
    siteDescription,
    "",
    "## Docs",
    "",
  ];

  for (const document of dataset.documents) {
    const docRoute = resolveDocsRoute({
      owner,
      repoSegment: repo,
      path: document.pathSegments,
      headers: req.headers,
    });
    const pathname =
      buildPublicPathname({
        requestMode: pathRoute.requestMode,
        owner: pathRoute.owner,
        repository: pathRoute.repository,
        ref: pathRoute.ref,
        docPath: docRoute.docPath,
      }) || "/";
    const href = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    const label = sanitizeMdLinkLabel(document.title);
    lines.push(
      document.description
        ? `- [${label}](${href}): ${document.description}`
        : `- [${label}](${href})`,
    );
  }

  const response = new Response(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
  response.headers.set("Cache-Control", LLMS_TXT_CACHE_HEADERS.cacheControl);
  response.headers.set(
    "Surrogate-Control",
    LLMS_TXT_CACHE_HEADERS.surrogateControl,
  );

  if (docList.truncated) {
    response.headers.set("x-docs-page-tree-truncated", "1");
  }

  return response;
}

function sanitizeMdLinkLabel(text: string) {
  return text.replace(/[[\]]/g, "");
}
