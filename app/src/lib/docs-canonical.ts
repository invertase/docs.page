import type { IncomingHttpHeaders } from "node:http";
import { getCustomDomain } from "@/lib/custom-domain";
import {
  getDocsEnvironment,
  getPublicDocsSiteBase,
} from "@/lib/docs-environment";
import { buildPublicPathname } from "@/lib/docs-paths";
import {
  resolveDocsRoute,
  type ResolvedDocsRoute,
} from "@/lib/docs-routing";
import { getRequestOriginFromHeaders } from "@/lib/incoming-http-headers";

export function resolveCanonicalUrl(
  route: ResolvedDocsRoute,
  customDomain: string | null,
): string | null {
  const environment = getDocsEnvironment();

  if (route.requestMode === "preview" || environment === "development") {
    return null;
  }

  if (customDomain && environment === "production") {
    const path = buildPublicPathname({
      requestMode: "custom-domain",
      owner: route.owner,
      repository: route.repository,
      ref: route.ref,
      docPath: route.docPath,
    });

    return new URL(path || "/", `https://${customDomain}`).toString();
  }

  return new URL(
    route.canonicalPathname,
    getPublicDocsSiteBase(),
  ).toString();
}

/** Public site origin for absolute URLs in sitemaps, llms.txt, etc. */
export function resolvePublicDocsOrigin(
  route: ResolvedDocsRoute,
  customDomain: string | null,
  headers?: Headers | IncomingHttpHeaders,
): string {
  const environment = getDocsEnvironment();

  if (
    headers
    && (route.requestMode === "preview" || environment === "development")
  ) {
    return getRequestOriginFromHeaders(headers);
  }

  if (customDomain && environment === "production") {
    return `https://${customDomain}`;
  }

  return getPublicDocsSiteBase();
}

export async function resolvePublicDocsOriginForRoute(
  args: Parameters<typeof resolveDocsRoute>[0],
): Promise<string> {
  const route = resolveDocsRoute(args);

  if (route.requestMode === "preview") {
    return getRequestOriginFromHeaders(args.headers);
  }

  const customDomain = await getCustomDomain(route.owner, route.repository);

  return resolvePublicDocsOrigin(route, customDomain, args.headers);
}

export async function resolveDocsRouteWithCanonical(
  args: Parameters<typeof resolveDocsRoute>[0],
): Promise<ResolvedDocsRoute> {
  const route = resolveDocsRoute(args);

  if (route.requestMode === "preview") {
    return route;
  }

  const customDomain = await getCustomDomain(route.owner, route.repository);

  return {
    ...route,
    canonicalUrl: resolveCanonicalUrl(route, customDomain),
  };
}
