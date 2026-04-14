import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

import {
  getAbsoluteRequestUrl,
  incomingHttpHeadersToWebHeaders,
} from "@/lib/incoming-http-headers";
import { resolveDocsRoute } from "@/lib/docs-routing";

const handler: NextApiHandler = async (req, res) => {
  const owner = getSingleParam(req.query.owner);
  const repo = getSingleParam(req.query.repo);

  if (!owner || !repo) {
    return res.status(400).json({ error: "Missing owner or repo." });
  }

  const route = resolveDocsRoute({
    owner,
    repoSegment: repo,
    headers: incomingHttpHeadersToWebHeaders(req.headers),
  });
  const { createMcpDescriptor, handleMcpDelete, handleMcpPost } = await import(
    "@/server/mcp/server"
  );

  switch (req.method) {
    case "GET":
      return res.status(200).json(await createMcpDescriptor(route));
    case "POST":
      return sendWebResponse(res, await handleMcpPost(toWebRequest(req), route));
    case "DELETE":
      return sendWebResponse(res, handleMcpDelete());
    default:
      res.setHeader("Allow", "GET, POST, DELETE");
      return res.status(405).json({ error: "Method not allowed." });
  }
};

export default handler;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toWebRequest(req: NextApiRequest): Request {
  const body = serializeRequestBody(req);

  return new Request(getAbsoluteRequestUrl(req), {
    method: req.method,
    headers: incomingHttpHeadersToWebHeaders(req.headers),
    body,
  });
}

function serializeRequestBody(req: NextApiRequest) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "DELETE") {
    return undefined;
  }

  if (typeof req.body === "string") {
    return req.body;
  }

  if (Buffer.isBuffer(req.body)) {
    return new Uint8Array(req.body);
  }

  if (req.body == null) {
    return undefined;
  }

  return JSON.stringify(req.body);
}

async function sendWebResponse(res: NextApiResponse, response: Response) {
  res.status(response.status);

  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = Buffer.from(await response.arrayBuffer());
  res.send(body);
}
