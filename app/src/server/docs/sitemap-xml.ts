import { Readable } from "node:stream";
import { buildPublicPathname } from "@/lib/docs-paths";
import { resolvePublicDocsPublishingContext } from "@/lib/docs-canonical";
import { resolveDocsRoute } from "@/lib/docs-routing";
import type { GitHubDocFile } from "@/server/github/tree";
import { SitemapStream, streamToPromise } from "sitemap";

function docFileToPathSegments(file: GitHubDocFile): string[] | undefined {
  if (!file.path || file.path === "index") {
    return undefined;
  }

  return file.path.split("/").filter(Boolean);
}

export async function buildDocsRepoSitemapXml(args: {
  owner: string;
  repoSegment: string;
  headers: Headers;
  files: GitHubDocFile[];
}): Promise<string> {
  const { owner, repoSegment, headers, files } = args;
  const { origin: hostname, pathRoute } =
    await resolvePublicDocsPublishingContext({
      owner,
      repoSegment,
      headers,
    });

  const items = files.map((file) => {
    const route = resolveDocsRoute({
      owner,
      repoSegment,
      path: docFileToPathSegments(file),
      headers,
    });

    const pathname =
      buildPublicPathname({
        requestMode: pathRoute.requestMode,
        owner: pathRoute.owner,
        repository: pathRoute.repository,
        ref: pathRoute.ref,
        docPath: route.docPath,
      }) || "/";
    const priority = file.path === "index" ? 1 : 0.8;

    return {
      url: pathname,
      changefreq: "weekly" as const,
      priority,
    };
  });

  const stream = new SitemapStream({ hostname });
  const xmlBuffer = await streamToPromise(Readable.from(items).pipe(stream));

  return xmlBuffer.toString();
}
