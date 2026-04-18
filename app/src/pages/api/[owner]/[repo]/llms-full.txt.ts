import type { NextApiHandler } from "next";

import {
  getAbsoluteRequestUrl,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { LLMS_FULL_TXT_CACHE_HEADERS, setDocsCacheHeaders } from "@/proxy";
import {
  buildDocsSourceDataset,
  loadDocsConfigForResolvedSha,
} from "@/server/docs/source-dataset";
import { listGitHubDocFiles } from "@/server/github/tree";

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

  const { owner: ghOwner, repository: ghRepo } = docList.source;

  const requestUrl = getAbsoluteRequestUrl(req);
  const origin = new URL(requestUrl).origin;

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
    config.description?.trim()
    || `Documentation for ${ghOwner}/${ghRepo}${route.ref ? ` at ref ${route.ref}` : ""}.`;

  const lines: string[] = [`# ${siteTitle}`, "", siteDescription, "", "## Docs", ""];

  for (const document of dataset.documents) {
    const docRoute = resolveDocsRoute({
      owner,
      repoSegment: repo,
      path: document.pathSegments,
      headers: requestHeaders,
    });
    const pathname = docRoute.publicPathname || "/";
    const href = `${origin}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
    const label = sanitizeMdLinkLabel(document.title);

    lines.push(`### ${label}`);
    lines.push("");
    lines.push(`Source: ${href}`);
    lines.push("");
    lines.push("```mdx");
    lines.push(document.content.trimEnd());
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

function sanitizeMdLinkLabel(text: string) {
  return text.replace(/[[\]]/g, "");
}
