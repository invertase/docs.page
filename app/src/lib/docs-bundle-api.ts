import type { ResolvedDocsRoute } from "@/lib/docs-routing";
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
  message: string;
  source?: string;
  branding?: DocsBranding;
};

export type DocsBundleApiErrorResponse = {
  code: string | number;
  error: string | DocsBundleApiErrorDetails;
};

export type DocsBundleApiResponse =
  | DocsBundleApiSuccessResponse
  | DocsBundleApiErrorResponse;

export function parseDocsBundleApiError(payload: DocsBundleApiErrorResponse): {
  message: string;
  source?: string;
  branding?: DocsBranding;
} {
  const error =
    typeof payload.error === "string"
      ? { message: payload.error }
      : payload.error;

  return {
    message: error.message,
    ...(typeof payload.error !== "string" && error.source
      ? { source: error.source }
      : {}),
    ...(typeof payload.error !== "string" && error.branding
      ? { branding: error.branding }
      : {}),
  };
}

export function isDocsBundleNotFoundResponse(
  payload: DocsBundleApiErrorResponse,
): boolean {
  return payload.code === 404;
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
