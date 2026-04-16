import type { NextApiHandler } from "next";
import { z } from "zod";

import type { DocsBundleApiResponse } from "@/lib/docs-bundle-api";
import { getBundleJsonCacheHeaders, setDocsCacheHeaders } from "@/proxy";

const QuerySchema = z.object({
  owner: z.string().trim().min(1),
  repository: z.string().trim().min(1),
  ref: z.string().trim().min(1).optional(),
  path: z.string().trim().min(1).default("index"),
});

const handler: NextApiHandler<DocsBundleApiResponse> = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      code: "METHOD_NOT_ALLOWED",
      error: "Method not allowed.",
    });
  }

  const input = QuerySchema.safeParse({
    owner: getSingleParam(req.query.owner),
    repository: getSingleParam(req.query.repository),
    ref: getSingleParam(req.query.ref),
    path: getSingleParam(req.query.path) ?? undefined,
  });

  if (!input.success) {
    return res.status(400).json({
      code: "BAD_REQUEST",
      error: "Invalid bundle request.",
    });
  }

  try {
    const [{ getDocBundle, BundlerError }, { checkRepositoryAgentConfig }] =
      await Promise.all([
        import("@/server/docs/bundle"),
        import("@/server/agent/repository"),
      ]);

    const bundle = await getDocBundle(input.data);
    const hasAgent = bundle.config.agent
      ? await checkRepositoryAgentConfig({
          owner: input.data.owner,
          repository: input.data.repository,
          token: bundle.config.agent,
        })
      : false;

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    setDocsCacheHeaders(res, getBundleJsonCacheHeaders(input.data.ref));

    return res.status(200).json({
      code: "OK",
      bundle: toJsonSafe(bundle),
      hasAgent,
    });
  } catch (error) {
    const { BundlerError } = await import("@/server/docs/bundle");

    if (error instanceof BundlerError) {
      return res.status(error.code).json({
        code: error.code,
        error: {
          message: error.message,
          ...(error.source ? { source: error.source } : {}),
        },
      });
    }

    console.error(error);

    return res.status(500).json({
      code: "INTERNAL_SERVER_ERROR",
      error: "Failed to load the docs bundle.",
    });
  }
};

export default handler;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toJsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
