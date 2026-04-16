import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  getVanityOwnerFromHost,
  isDocsLlmsTxtPath,
  isDocsSitemapPath,
  isPinnedCommitRef,
  isRawDocRequestPath,
} from "@/lib/docs-routing";

const SECONDS_PER_DAY = 24 * 60 * 60;
/** Fastly edge: allow stale serve + async revalidate / error fallback for up to 7 days after freshness TTL. */
const CDN_STALE_SECONDS = 7 * SECONDS_PER_DAY;

function buildCacheControl(args: {
  sMaxAge: number;
  staleWhileRevalidate: number;
  staleIfError: number;
}) {
  return [
    "public",
    "max-age=0",
    `s-maxage=${args.sMaxAge}`,
    `stale-while-revalidate=${args.staleWhileRevalidate}`,
    `stale-if-error=${args.staleIfError}`,
  ].join(", ");
}

export const DOCS_HTML_CACHE_CONTROL = buildCacheControl({
  sMaxAge: 60,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
export const RAW_DOC_CACHE_CONTROL = buildCacheControl({
  sMaxAge: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
export const SEARCH_CACHE_CONTROL = buildCacheControl({
  sMaxAge: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
export const SITEMAP_CACHE_CONTROL = buildCacheControl({
  sMaxAge: 3600,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});

const MUTABLE_BUNDLE_S_MAXAGE = 60;
const MUTABLE_BUNDLE_STALE_WHILE_REVALIDATE = CDN_STALE_SECONDS;
const MUTABLE_BUNDLE_STALE_IF_ERROR = CDN_STALE_SECONDS;
const PINNED_BUNDLE_S_MAXAGE = CDN_STALE_SECONDS;
const PINNED_BUNDLE_STALE_WHILE_REVALIDATE = CDN_STALE_SECONDS;
const PINNED_BUNDLE_STALE_IF_ERROR = CDN_STALE_SECONDS;

export function getBundleJsonCacheControl(ref: string | null | undefined) {
  if (isPinnedCommitRef(ref)) {
    return buildCacheControl({
      sMaxAge: PINNED_BUNDLE_S_MAXAGE,
      staleWhileRevalidate: PINNED_BUNDLE_STALE_WHILE_REVALIDATE,
      staleIfError: PINNED_BUNDLE_STALE_IF_ERROR,
    });
  }

  return buildCacheControl({
    sMaxAge: MUTABLE_BUNDLE_S_MAXAGE,
    staleWhileRevalidate: MUTABLE_BUNDLE_STALE_WHILE_REVALIDATE,
    staleIfError: MUTABLE_BUNDLE_STALE_IF_ERROR,
  });
}

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
      !isDocsSitemapPath(pathname) &&
      !isDocsLlmsTxtPath(pathname))
  );
}

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function shouldApplyDocsCache(request: NextRequest, vanityOwner: string | null) {
  if (!getDocsCacheControl(request.nextUrl.pathname)) {
    return false;
  }

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

function getDocsCacheControl(pathname: string) {
  if (isMcpPath(pathname)) {
    return null;
  }

  if (isRawDocRequestPath(pathname)) {
    return RAW_DOC_CACHE_CONTROL;
  }

  if (isDocsSearchPath(pathname)) {
    return SEARCH_CACHE_CONTROL;
  }

  if (isDocsLlmsTxtPath(pathname)) {
    return SEARCH_CACHE_CONTROL;
  }

  if (isDocsSitemapPath(pathname)) {
    return SITEMAP_CACHE_CONTROL;
  }

  const segments = getPathSegments(pathname);

  if (segments.length >= 2) {
    return DOCS_HTML_CACHE_CONTROL;
  }

  return null;
}

function withDocsCache(response: NextResponse, cacheControl: string | null) {
  if (cacheControl) {
    response.headers.set("Cache-Control", cacheControl);
  }

  return response;
}

export function proxy(request: NextRequest) {
  const vanityOwner = getVanityOwnerFromHost(request.nextUrl.hostname);
  const cacheControl = shouldApplyDocsCache(request, vanityOwner)
    ? getDocsCacheControl(request.nextUrl.pathname)
    : null;

  if (
    request.headers.get("x-docs-page-vanity-domain") ||
    request.headers.get("x-docs-page-custom-domain")
  ) {
    return withDocsCache(NextResponse.next(), cacheControl);
  }

  if (!vanityOwner || isBypassPath(request.nextUrl.pathname)) {
    return withDocsCache(NextResponse.next(), cacheControl);
  }

  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean).at(0);

  if (firstSegment === vanityOwner) {
    return withDocsCache(NextResponse.next(), cacheControl);
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
    getDocsCacheControl(request.nextUrl.pathname)
  );
}
