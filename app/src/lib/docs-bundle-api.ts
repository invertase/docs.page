import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import type { BundlerOutput } from "@/server/docs/bundle";

/** JSON body shape for `code: "OK"` responses from `/api/bundle` (matches `getDocBundle`). */
export type DocsBundlePayload = BundlerOutput;

export type DocsBundleApiSuccessResponse = {
  code: "OK";
  bundle: DocsBundlePayload;
  hasAgent: boolean;
};

export type DocsBundleApiErrorResponse = {
  code: string | number;
  error:
    | string
    | {
        message: string;
        source?: string;
      };
};

export type DocsBundleApiResponse =
  | DocsBundleApiSuccessResponse
  | DocsBundleApiErrorResponse;

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
