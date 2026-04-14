import { Readable } from "node:stream";
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
  requestUrl: string;
  owner: string;
  repoSegment: string;
  headers: Headers;
  files: GitHubDocFile[];
}): Promise<string> {
  const { requestUrl, owner, repoSegment, headers, files } = args;
  const hostname = new URL(requestUrl).origin;

  const items = files.map((file) => {
    const route = resolveDocsRoute({
      owner,
      repoSegment,
      path: docFileToPathSegments(file),
      headers,
    });

    const pathname = route.publicPathname || "/";
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
