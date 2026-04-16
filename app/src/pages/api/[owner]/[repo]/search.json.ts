import type { NextApiHandler } from "next";

import { incomingHttpHeadersToWebHeaders } from "@/lib/incoming-http-headers";
import { resolveDocsRoute } from "@/lib/docs-routing";
import { setDocsCacheHeaders, SEARCH_CACHE_HEADERS } from "@/proxy";

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
  const [
    { listGitHubDocFiles },
    {
      buildDocsFlexSearchIndex,
      emptyDocsFlexSearchPayload,
    },
  ] =
    await Promise.all([
      import("@/server/github/tree"),
      import("@/server/docs/search-index"),
    ]);
  const docList = await listGitHubDocFiles({
    owner: route.owner,
    repository: route.repository,
    ref: route.ref ?? undefined,
  });

  if (!docList) {
    return res.status(404).send("Not found");
  }

  const payload =
    docList.files.length === 0
      ? emptyDocsFlexSearchPayload(docList)
      : await buildDocsFlexSearchIndex(
          route.owner,
          route.repository,
          docList.resolvedSha,
        );

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  setDocsCacheHeaders(res, SEARCH_CACHE_HEADERS);

  if (docList.truncated) {
    res.setHeader("x-docs-page-tree-truncated", "1");
  }

  return res.status(200).json(payload);
};

export default handler;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
