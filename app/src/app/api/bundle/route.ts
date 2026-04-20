import { z } from "zod";
import type { DocsBundleApiResponse } from "@/lib/docs-bundle-api";
import { getBundleJsonCacheHeaders } from "@/proxy";
import { checkRepositoryAgentConfig } from "@/server/agent/repository";
import { BundlerError, getDocBundle } from "@/server/docs/bundle";

const QuerySchema = z.object({
  owner: z.string().trim().min(1),
  repository: z.string().trim().min(1),
  ref: z.string().trim().min(1).optional(),
  path: z.string().trim().min(1).default("index"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const input = QuerySchema.safeParse({
    owner: url.searchParams.get("owner") ?? undefined,
    repository: url.searchParams.get("repository") ?? undefined,
    ref: url.searchParams.get("ref") ?? undefined,
    path: url.searchParams.get("path") ?? undefined,
  });

  if (!input.success) {
    return Response.json<DocsBundleApiResponse>(
      {
        code: "BAD_REQUEST",
        error: "Invalid bundle request.",
      },
      { status: 400 },
    );
  }

  try {
    const [bundle, agent] = await Promise.all([
      getDocBundle(input.data),
      checkRepositoryAgentConfig({
        owner: input.data.owner,
        repository: input.data.repository,
      }),
    ]);

    const hasAgent = Boolean(bundle.config.agent && bundle.config.agent === agent?.id);
    const response = Response.json<DocsBundleApiResponse>(
      {
        code: "OK",
        bundle: toJsonSafe(bundle),
        hasAgent,
      },
      { status: 200 },
    );
    const cacheHeaders = getBundleJsonCacheHeaders(input.data.ref);
    response.headers.set("Cache-Control", cacheHeaders.cacheControl);
    response.headers.set("Surrogate-Control", cacheHeaders.surrogateControl);
    return response;
  } catch (error) {
    if (error instanceof BundlerError) {
      console.error(error);
      return Response.json<DocsBundleApiResponse>(
        {
          code: error.code,
          error: {
            message: error.message,
            ...(error.source ? { source: error.source } : {}),
          },
        },
        { status: error.code },
      );
    }

    console.error(error);

    return Response.json<DocsBundleApiResponse>(
      {
        code: "INTERNAL_SERVER_ERROR",
        error: "Failed to load the docs bundle.",
      },
      { status: 500 },
    );
  }
}

function toJsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
