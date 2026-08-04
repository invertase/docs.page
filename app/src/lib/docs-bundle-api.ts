import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import type { Config } from "@/server/config";
import type { BundlerOutput } from "@/server/docs/bundle";

/** JSON body shape for `code: "OK"` responses from `/api/bundle` (matches `getDocBundle`). */
export type DocsBundlePayload = BundlerOutput;

export type DocsBranding = {
  name?: string;
  logo?: {
    light?: string;
    dark?: string;
  };
};

export type DocsBundleApiSuccessResponse = {
  code: "OK";
  bundle: DocsBundlePayload;
  hasAgent: boolean;
};

export type DocsBundleApiErrorDetails = {
  name?: string;
  message: string;
  source?: string;
  branding?: DocsBranding;
  /** Parsed site config, present on 404 responses so the page can honour `redirects`. */
  config?: Config;
};

export type DocsBundleApiErrorResponse = {
  code: string | number;
  error: string | DocsBundleApiErrorDetails;
};

export type DocsBundleApiResponse =
  | DocsBundleApiSuccessResponse
  | DocsBundleApiErrorResponse;

export type ParsedDocsBundleApiError = {
  name?: string;
  message: string;
  source?: string;
  branding?: DocsBranding;
  config?: Config;
};

const BODY_PREVIEW_LIMIT = 500;

export function parseDocsBundleApiError(
  payload: DocsBundleApiErrorResponse | unknown,
): ParsedDocsBundleApiError {
  if (!payload || typeof payload !== "object") {
    return {
      name: "INVALID_BUNDLE_RESPONSE",
      message: "The docs bundle API returned an unexpected response.",
    };
  }

  const record = payload as Partial<DocsBundleApiErrorResponse>;
  const rawError = record.error;

  if (typeof rawError === "string") {
    return {
      message: rawError || "The docs bundle API returned an error.",
    };
  }

  if (!rawError || typeof rawError !== "object") {
    return {
      name: "INVALID_BUNDLE_RESPONSE",
      message:
        typeof record.code !== "undefined"
          ? `The docs bundle API returned an unexpected error payload (code: ${String(record.code)}).`
          : "The docs bundle API returned an unexpected error payload.",
    };
  }

  const error = rawError as DocsBundleApiErrorDetails;

  return {
    ...(typeof error.name === "string" && error.name
      ? { name: error.name }
      : {}),
    message:
      typeof error.message === "string" && error.message
        ? error.message
        : "The docs bundle API returned an error.",
    ...(typeof error.source === "string" && error.source
      ? { source: error.source }
      : {}),
    ...(error.branding ? { branding: error.branding } : {}),
    ...(error.config ? { config: error.config } : {}),
  };
}

export function isDocsBundleNotFoundResponse(
  payload: DocsBundleApiErrorResponse | unknown,
): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (payload as Partial<DocsBundleApiErrorResponse>).code === 404;
}

export function buildDocsBundleApiPath(
  route: Pick<ResolvedDocsRoute, "owner" | "repository" | "ref" | "docPath">,
) {
  const query = new URLSearchParams({
    owner: route.owner,
    repository: route.repository,
    path: route.docPath || "index",
  });

  if (route.ref) {
    query.set("ref", route.ref);
  }

  return `/api/bundle?${query.toString()}`;
}

export type DocsBundleApiRequestContext = {
  owner: string;
  repository: string;
  ref: string | null;
  path: string;
  bundleApiUrl: string;
};

export type DocsBundleApiLoadResult =
  | {
      kind: "success";
      payload: DocsBundleApiSuccessResponse;
    }
  | {
      kind: "error";
      status: number;
      payload: DocsBundleApiErrorResponse;
      error: ParsedDocsBundleApiError;
    }
  | {
      kind: "internal";
      status: number;
      error: {
        name: string;
        message: string;
      };
    };

function previewBody(body: string): string {
  const normalized = body.replace(/\s+/g, " ").trim();
  if (normalized.length <= BODY_PREVIEW_LIMIT) {
    return normalized;
  }
  return `${normalized.slice(0, BODY_PREVIEW_LIMIT)}…`;
}

export function logDocsBundleApiIssue(
  reason: string,
  context: DocsBundleApiRequestContext,
  details: Record<string, unknown>,
) {
  console.error({
    name: "DOCS_BUNDLE_API_TRANSPORT",
    message: reason,
    details: {
      owner: context.owner,
      repository: context.repository,
      ref: context.ref,
      path: context.path,
      bundleApiUrl: context.bundleApiUrl,
      ...details,
    },
  });
}

/**
 * Fetch `/api/bundle` and normalize success / contract errors / transport failures
 * so callers never throw from JSON parsing or malformed error payloads.
 */
export async function loadDocsBundleFromApi(
  bundleApiUrl: string,
  context: Omit<DocsBundleApiRequestContext, "bundleApiUrl">,
): Promise<DocsBundleApiLoadResult> {
  const requestContext: DocsBundleApiRequestContext = {
    ...context,
    bundleApiUrl,
  };

  let response: Response;
  try {
    response = await fetch(bundleApiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Bundle API fetch failed.";
    logDocsBundleApiIssue("fetch_failed", requestContext, {
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: message,
    });
    return {
      kind: "internal",
      status: 502,
      error: {
        name: "BUNDLE_FETCH_FAILED",
        message: "Failed to reach the docs bundle API.",
      },
    };
  }

  const contentType = response.headers.get("content-type");
  const cfRay = response.headers.get("cf-ray");
  const server = response.headers.get("server");
  const rawBody = await response.text();

  let payload: unknown;
  try {
    payload = rawBody.length > 0 ? JSON.parse(rawBody) : null;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON response.";
    logDocsBundleApiIssue("invalid_json", requestContext, {
      status: response.status,
      contentType,
      cfRay,
      server,
      bodyPreview: previewBody(rawBody),
      parseError: message,
    });
    return {
      kind: "internal",
      status: response.status >= 400 ? response.status : 502,
      error: {
        name: "INVALID_BUNDLE_JSON",
        message: "The docs bundle API returned a non-JSON response.",
      },
    };
  }

  if (
    response.ok &&
    payload &&
    typeof payload === "object" &&
    (payload as DocsBundleApiSuccessResponse).code === "OK"
  ) {
    return {
      kind: "success",
      payload: payload as DocsBundleApiSuccessResponse,
    };
  }

  const errorPayload = payload as DocsBundleApiErrorResponse;
  const hasContractError =
    !!payload &&
    typeof payload === "object" &&
    "error" in (payload as object) &&
    ((payload as DocsBundleApiErrorResponse).error !== null ||
      typeof (payload as DocsBundleApiErrorResponse).error === "string");

  // Treat missing/null `error` as transport/shape failure so we log the raw body.
  if (!hasContractError) {
    logDocsBundleApiIssue("unexpected_payload", requestContext, {
      status: response.status,
      ok: response.ok,
      contentType,
      cfRay,
      server,
      bodyPreview: previewBody(rawBody),
      payloadType: payload === null ? "null" : typeof payload,
      code:
        payload && typeof payload === "object"
          ? (payload as { code?: unknown }).code
          : undefined,
    });
    return {
      kind: "internal",
      status: response.status || 502,
      error: {
        name: "INVALID_BUNDLE_RESPONSE",
        message: "The docs bundle API returned an unexpected response.",
      },
    };
  }

  return {
    kind: "error",
    status: response.status,
    payload: errorPayload,
    error: parseDocsBundleApiError(errorPayload),
  };
}
