import type { IncomingHttpHeaders } from "node:http";
import { getCustomDomain } from "@/lib/custom-domain";
import {
  getDocsEnvironment,
  getPublicDocsSiteBase,
} from "@/lib/docs-environment";
import { buildPublicPathname, getSitemapPathname } from "@/lib/docs-paths";
import { type ResolvedDocsRoute, resolveDocsRoute } from "@/lib/docs-routing";
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

  return new URL(route.canonicalPathname, getPublicDocsSiteBase()).toString();
}

export type PublicDocsPathRoute = Pick<
  ResolvedDocsRoute,
  "requestMode" | "owner" | "repository" | "ref"
>;

/** Path routing for public URLs — mirrors {@link resolveCanonicalUrl} link behavior. */
export function getPublicDocsPathRoute(
  route: ResolvedDocsRoute,
  customDomain: string | null,
): PublicDocsPathRoute {
  const environment = getDocsEnvironment();

  if (
    customDomain &&
    environment === "production" &&
    route.requestMode !== "preview"
  ) {
    return {
      requestMode: "custom-domain",
      owner: route.owner,
      repository: route.repository,
      ref: route.ref,
    };
  }

  return {
    requestMode: route.requestMode,
    owner: route.owner,
    repository: route.repository,
    ref: route.ref,
  };
}

export function resolvePublicDocPathname(
  route: ResolvedDocsRoute,
  customDomain: string | null,
): string {
  const pathRoute = getPublicDocsPathRoute(route, customDomain);

  return buildPublicPathname({
    requestMode: pathRoute.requestMode,
    owner: pathRoute.owner,
    repository: pathRoute.repository,
    ref: pathRoute.ref,
    docPath: route.docPath,
  });
}

/** Public site origin for absolute URLs in sitemaps, llms.txt, etc. */
export function resolvePublicDocsOrigin(
  route: ResolvedDocsRoute,
  customDomain: string | null,
  headers?: Headers | IncomingHttpHeaders,
): string {
  const environment = getDocsEnvironment();

  if (
    headers &&
    (route.requestMode === "preview" || environment === "development")
  ) {
    return getRequestOriginFromHeaders(headers);
  }

  if (customDomain && environment === "production") {
    return `https://${customDomain}`;
  }

  if (headers) {
    return getRequestOriginFromHeaders(headers);
  }

  return getPublicDocsSiteBase();
}

export function resolvePublicSitemapUrl(
  route: ResolvedDocsRoute,
  customDomain: string | null,
  headers?: Headers | IncomingHttpHeaders,
): string {
  const environment = getDocsEnvironment();

  if (
    headers &&
    (route.requestMode === "preview" || environment === "development")
  ) {
    return new URL(
      getSitemapPathname(route),
      getRequestOriginFromHeaders(headers),
    ).toString();
  }

  if (customDomain && environment === "production") {
    const pathRoute = getPublicDocsPathRoute(route, customDomain);

    return new URL(
      getSitemapPathname(pathRoute),
      `https://${customDomain}`,
    ).toString();
  }

  return new URL(getSitemapPathname(route), getPublicDocsSiteBase()).toString();
}

export async function resolvePublicDocsPublishingContext(
  args: Parameters<typeof resolveDocsRoute>[0],
) {
  const route = resolveDocsRoute(args);
  const customDomain =
    route.requestMode === "preview"
      ? null
      : await getCustomDomain(route.owner, route.repository);

  return {
    route,
    customDomain,
    origin: resolvePublicDocsOrigin(route, customDomain, args.headers),
    pathRoute: getPublicDocsPathRoute(route, customDomain),
  };
}

export async function resolvePublicDocsOriginForRoute(
  args: Parameters<typeof resolveDocsRoute>[0],
): Promise<string> {
  const { origin } = await resolvePublicDocsPublishingContext(args);

  return origin;
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
