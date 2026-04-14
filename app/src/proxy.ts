import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getVanityOwnerFromHost, isDocsSitemapPath, isRawDocRequestPath } from "@/lib/docs-routing";

const DOCS_CACHE_CONTROL = "public, s-maxage=1, stale-while-revalidate=59";

function isMcpPath(pathname: string) {
  return pathname === "/mcp" || pathname.endsWith("/mcp");
}

function isBypassPath(pathname: string) {
  return (
    pathname === "/" ||
    pathname.startsWith("/raw") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    (/\.[a-zA-Z0-9]+$/.test(pathname) &&
      !isRawDocRequestPath(pathname) &&
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

function rewriteToRawDocs(request: NextRequest, pathname: string, headers?: Headers) {
  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/raw${pathname}`;

  return NextResponse.rewrite(rewrittenUrl, headers
    ? {
        request: {
          headers,
        },
      }
    : undefined);
}

export function proxy(request: NextRequest) {
  const vanityOwner = getVanityOwnerFromHost(request.nextUrl.hostname);
  const shouldCache = shouldApplyDocsCache(request, vanityOwner);
  const isRawDocRequest = isRawDocRequestPath(request.nextUrl.pathname);

  if (
    request.headers.get("x-docs-page-vanity-domain") ||
    request.headers.get("x-docs-page-custom-domain")
  ) {
    if (isRawDocRequest) {
      return withDocsCache(rewriteToRawDocs(request, request.nextUrl.pathname), shouldCache);
    }

    return withDocsCache(NextResponse.next(), shouldCache);
  }

  if (!vanityOwner || isBypassPath(request.nextUrl.pathname)) {
    if (isRawDocRequest) {
      return withDocsCache(rewriteToRawDocs(request, request.nextUrl.pathname), shouldCache);
    }

    return withDocsCache(NextResponse.next(), shouldCache);
  }

  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean).at(0);

  if (firstSegment === vanityOwner) {
    return withDocsCache(NextResponse.next(), shouldCache);
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = isRawDocRequest
    ? `/raw/${vanityOwner}${rewrittenUrl.pathname}`
    : `/${vanityOwner}${rewrittenUrl.pathname}`;

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
