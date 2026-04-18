import type { NextApiHandler } from "next";
import frontmatter from "gray-matter";

import {
  getAbsoluteRequestUrl,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { LLMS_FULL_TXT_CACHE_HEADERS, setDocsCacheHeaders } from "@/proxy";
import { defaultConfig, parseConfig } from "@/server/config";
import { getGitHubContents, getGitHubFileSourcesBatch } from "@/server/github/contents";
import { listGitHubDocFiles } from "@/server/github/tree";
import type { GitHubDocFile } from "@/server/github/tree";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).send("Method not allowed");
  }

  const owner = getSingleParam(req.query.owner);
  const repo = getSingleParam(req.query.repo);

  if (!owner || !repo) {
    return res.status(400).send("Missing owner or repo");
  }

  const requestHeaders = incomingHttpHeadersToWebHeaders(req.headers);
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
    return res.status(404).send("Not found");
  }

  const { owner: ghOwner, repository: ghRepo, ref: ghRef } = docList.source;
  const resolvedRef = ghRef ?? docList.resolvedRef;

  const paths = docList.files.map((f) => f.sourcePath);
  const sortedFiles = [...docList.files].sort((a, b) =>
    compareStructuredDocPath(a.path, b.path),
  );

  const requestUrl = getAbsoluteRequestUrl(req);
  const origin = new URL(requestUrl).origin;

  const [indexContents, blobs] = await Promise.all([
    getGitHubContents({
      owner: ghOwner,
      repository: ghRepo,
      ref: docList.source.ref,
      path: "index",
    }),
    getGitHubFileSourcesBatch({
      owner: ghOwner,
      repository: ghRepo,
      ref: resolvedRef,
      paths,
    }),
  ]);

  let config = defaultConfig;
  if (indexContents?.config.configJson || indexContents?.config.configYaml) {
    try {
      config = parseConfig({
        json: indexContents.config.configJson,
        yaml: indexContents.config.configYaml,
      });
    } catch {
      config = defaultConfig;
    }
  }

  const siteTitle = config.name?.trim() || `${ghOwner}/${ghRepo}`;
  const siteDescription =
    config.description?.trim()
    || `Documentation for ${ghOwner}/${ghRepo}${route.ref ? ` at ref ${route.ref}` : ""}.`;

  const lines: string[] = [`# ${siteTitle}`, "", siteDescription, "", "## Docs", ""];

  for (const file of sortedFiles) {
    const raw = blobs.get(file.sourcePath);
    if (raw == null) {
      continue;
    }

    const parsed = frontmatter(raw);
    const title = titleFromMatterAndBody(parsed.data, parsed.content, file.path);
    const docRoute = resolveDocsRoute({
      owner,
      repoSegment: repo,
      path: docFileToPathSegments(file),
      headers: requestHeaders,
    });
    const pathname = docRoute.publicPathname || "/";
    const href = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    const label = sanitizeMdLinkLabel(title);

    lines.push(`### ${label}`);
    lines.push("");
    lines.push(`Source: ${href}`);
    lines.push("");
    lines.push("```mdx");
    lines.push(parsed.content.trimEnd());
    lines.push("```");
    lines.push("");
  }

  const body = lines.join("\n");

  res.setHeader("Content-Type", "text/markdown; charset=utf-8");
  setDocsCacheHeaders(res, LLMS_FULL_TXT_CACHE_HEADERS);

  if (docList.truncated) {
    res.setHeader("x-docs-page-tree-truncated", "1");
  }

  return res.status(200).send(body);
};

export default handler;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Path segments for sorting (`index` → root).
 * Depth = segment count (0 = `/`).
 */
function docPathToSegments(path: string): string[] {
  if (!path || path === "index") {
    return [];
  }

  return path.split("/").filter(Boolean);
}

/**
 * Order by depth first (shallower pages before deeper ones), then alphabetically by each segment.
 * Without depth-first, pure segment compare puts `foo/bar` before `typescript` (first segment `foo` sorts before `typescript`).
 */
function compareStructuredDocPath(aPath: string, bPath: string): number {
  const segsA = docPathToSegments(aPath);
  const segsB = docPathToSegments(bPath);

  if (segsA.length !== segsB.length) {
    return segsA.length - segsB.length;
  }

  for (let i = 0; i < segsA.length; i++) {
    const cmp = segsA[i].localeCompare(segsB[i], undefined, {
      numeric: true,
      sensitivity: "base",
    });
    if (cmp !== 0) {
      return cmp;
    }
  }

  return 0;
}

function docFileToPathSegments(file: GitHubDocFile): string[] | undefined {
  if (!file.path || file.path === "index") {
    return undefined;
  }

  return file.path.split("/").filter(Boolean);
}

function titleFromMatterAndBody(data: Record<string, unknown>, body: string, fallback: string): string {
  if (typeof data.title === "string" && data.title.trim()) {
    return data.title.trim();
  }

  const heading = body.match(/^#\s+(.+)$/m);

  return heading ? heading[1].trim() : fallback;
}

function sanitizeMdLinkLabel(text: string) {
  return text.replace(/[[\]]/g, "");
}
