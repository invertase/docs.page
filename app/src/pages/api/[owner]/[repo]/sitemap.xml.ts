import type { NextApiHandler } from "next";

import {
  getAbsoluteRequestUrl,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { SITEMAP_CACHE_CONTROL } from "@/proxy";

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
  const [{ listGitHubDocFiles }, { buildDocsRepoSitemapXml }] = await Promise.all([
    import("@/server/github/tree"),
    import("@/server/docs/sitemap-xml"),
  ]);
  const docList = await listGitHubDocFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });

  if (!docList || docList.files.length === 0) {
    return res.status(404).send("Not found");
  }

  const xml = await buildDocsRepoSitemapXml({
    requestUrl: getAbsoluteRequestUrl(req),
    owner: route.owner,
    repoSegment: repo,
    headers: requestHeaders,
    files: docList.files,
  });

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", SITEMAP_CACHE_CONTROL);

  if (docList.truncated) {
    res.setHeader("x-docs-page-tree-truncated", "1");
  }

  return res.status(200).send(xml);
};

export default handler;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
