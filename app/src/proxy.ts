import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getVanityOwnerFromHost, isDocsSitemapPath, isRawDocRequestPath } from "@/lib/docs-routing";

const DOCS_CACHE_CONTROL = "public, s-maxage=1, stale-while-revalidate=59";

function isMcpPath(pathname: string) {
  return pathname === "/mcp" || pathname.endsWith("/mcp");
}

function isDocsSearchPath(pathname: string) {
  return pathname === "/search.json" || pathname.endsWith("/search.json");
}

function isBypassPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    (/\.[a-zA-Z0-9]+$/.test(pathname) &&
      !isRawDocRequestPath(pathname) &&
      !isDocsSearchPath(pathname) &&
      !isDocsSitemapPath(pathname))
  );
}

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function shouldApplyDocsCache(request: NextRequest, vanityOwner: string | null) {
  if (isBypassPath(request.nextUrl.pathname)) {
    return false;
  }

  if (isMcpPath(request.nextUrl.pathname)) {
    return false;
  }

  if (request.headers.get("x-docs-page-custom-domain")) {
    return true;
  }

  if (request.headers.get("x-docs-page-vanity-domain") || vanityOwner) {
    return true;
  }

  return getPathSegments(request.nextUrl.pathname).length >= 2;
}

function withDocsCache(response: NextResponse, enabled: boolean) {
  if (enabled) {
    response.headers.set("Cache-Control", DOCS_CACHE_CONTROL);
  }

  return response;
}

export function proxy(request: NextRequest) {
  const vanityOwner = getVanityOwnerFromHost(request.nextUrl.hostname);
  const shouldCache = shouldApplyDocsCache(request, vanityOwner);

  if (
    request.headers.get("x-docs-page-vanity-domain") ||
    request.headers.get("x-docs-page-custom-domain")
  ) {
    return withDocsCache(NextResponse.next(), shouldCache);
  }

  if (!vanityOwner || isBypassPath(request.nextUrl.pathname)) {
    return withDocsCache(NextResponse.next(), shouldCache);
  }

  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean).at(0);

  if (firstSegment === vanityOwner) {
    return withDocsCache(NextResponse.next(), shouldCache);
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/${vanityOwner}${rewrittenUrl.pathname}`;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-docs-page-vanity-domain", "1");

  return withDocsCache(
    NextResponse.rewrite(rewrittenUrl, {
      request: {
        headers: requestHeaders,
      },
    }),
    true
  );
}
