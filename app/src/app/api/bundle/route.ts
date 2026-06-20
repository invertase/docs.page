import { z } from "zod";
import type {
  DocsBundleApiErrorResponse,
  DocsBundleApiResponse,
} from "@/lib/docs-bundle-api";
import { getPostHogClient } from "@/lib/posthog";
import { getBundleJsonCacheHeaders } from "@/proxy";
import { isAgentEnabledForRepository } from "@/server/agent/repository";
import { BundlerError, getDocBundle } from "@/server/docs/bundle";
import { logBundlerError } from "@/server/docs/bundler/error";

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
    return Response.json(
      {
        code: "BAD_REQUEST",
        error: "Invalid bundle request.",
      } satisfies DocsBundleApiErrorResponse,
      { status: 400 },
    );
  }

  try {
    const [bundle, hasAgent] = await Promise.all([
      getDocBundle(input.data),
      isAgentEnabledForRepository({
        owner: input.data.owner,
        repository: input.data.repository,
        ref: input.data.ref,
      }),
    ]);

    getPostHogClient().capture({
      distinctId: `${input.data.owner}/${input.data.repository}`,
      event: "docs bundle loaded",
      properties: {
        owner: input.data.owner,
        repository: input.data.repository,
        ref: input.data.ref ?? null,
        path: input.data.path,
        has_agent: hasAgent,
        $process_person_profile: false,
      },
    });

    const response = Response.json(
      {
        code: "OK",
        bundle: toJsonSafe(bundle),
        hasAgent,
      } satisfies DocsBundleApiResponse,
      { status: 200 },
    );
    const cacheHeaders = getBundleJsonCacheHeaders(input.data.ref);
    response.headers.set("Cache-Control", cacheHeaders.cacheControl);
    response.headers.set("Surrogate-Control", cacheHeaders.surrogateControl);
    return response;
  } catch (error) {
    if (error instanceof BundlerError) {
      logBundlerError(error);
      getPostHogClient().capture({
        distinctId: `${input.data.owner}/${input.data.repository}`,
        event: "docs bundle failed",
        properties: {
          owner: input.data.owner,
          repository: input.data.repository,
          ref: input.data.ref ?? null,
          path: input.data.path,
          error_code: error.code,
          error_name: error.name,
          error_message: error.message,
          $process_person_profile: false,
        },
      });
      return Response.json(
        {
          code: error.code,
          error: {
            message: error.message,
            ...(error.source ? { source: error.source } : {}),
          },
        } satisfies DocsBundleApiErrorResponse,
        { status: error.code },
      );
    }

    console.error(error);

    return Response.json(
      {
        code: "INTERNAL_SERVER_ERROR",
        error: "Failed to load the docs bundle.",
      } satisfies DocsBundleApiErrorResponse,
      { status: 500 },
    );
  }
}

function toJsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
