import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getDocsEnvironment } from "@/lib/docs-environment";
import {
  getVanityOwnerFromHost,
  isDocsLlmsFullTxtPath,
  isDocsLlmsTxtPath,
  isDocsRobotsPath,
  isDocsSitemapPath,
  isPinnedCommitRef,
  isRawDocRequestPath,
} from "@/lib/docs-routing";
import { resolvePlausibleOwnerRepo, trackPageRequest } from "@/lib/plausible";

const SECONDS_PER_DAY = 24 * 60 * 60;
/** CDN edge: allow stale serve + async revalidate / error fallback for up to 7 days after freshness TTL. */
const CDN_STALE_SECONDS = 7 * SECONDS_PER_DAY;

export type DocsCacheHeaders = {
  cacheControl: string;
};

const SEARCH_JSON_BROWSER_MAX_AGE_SECONDS = 5 * 60;

/** Browser-only: never store HTML document responses in any cache. */
function buildBrowserCacheHeaders(): DocsCacheHeaders {
  return {
    cacheControl: "no-store",
  };
}

/**
 * CDN cache policy for deterministic API/utility responses (`/api/bundle`, search.json, etc.).
 * Browsers use `max-age=0`; edge TTL + stale-* live in `s-maxage`.
 */
function buildCdnCacheHeaders(args: {
  edgeMaxAgeSeconds: number;
  staleWhileRevalidate: number;
  staleIfError: number;
  /** When set, browsers may reuse the response without revalidating for this many seconds. */
  browserMaxAgeSeconds?: number;
}): DocsCacheHeaders {
  const browserMaxAge = args.browserMaxAgeSeconds ?? 0;

  return {
    cacheControl: [
      "public",
      `max-age=${browserMaxAge}`,
      `s-maxage=${args.edgeMaxAgeSeconds}`,
      `stale-while-revalidate=${args.staleWhileRevalidate}`,
      `stale-if-error=${args.staleIfError}`,
    ].join(", "),
  };
}

/** SSR HTML pages: always revalidate in the browser; do not cache at the CDN. */
export const DOCS_HTML_CACHE_HEADERS = buildBrowserCacheHeaders();
export const RAW_DOC_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
/** `search.json`: short browser TTL so SPAs can reuse the FlexSearch payload during a session without extra round-trips. */
export const SEARCH_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
  browserMaxAgeSeconds: SEARCH_JSON_BROWSER_MAX_AGE_SECONDS,
});

/** Same edge policy as search; keep `max-age=0` for clients (llms.txt consumers often want a fresh aggregate). */
export const LLMS_TXT_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
/** `llms-full.txt` can be larger and expensive to rebuild; reuse llms.txt edge/browser policy. */
export const LLMS_FULL_TXT_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 300,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
export const SITEMAP_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 3600,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});
export const ROBOTS_TXT_CACHE_HEADERS = buildCdnCacheHeaders({
  edgeMaxAgeSeconds: 3600,
  staleWhileRevalidate: CDN_STALE_SECONDS,
  staleIfError: CDN_STALE_SECONDS,
});

const MUTABLE_BUNDLE_EDGE_MAX_AGE = 60;
const PINNED_BUNDLE_EDGE_MAX_AGE = CDN_STALE_SECONDS;

/** Primary CDN cache target: expensive GitHub fetch + MDX bundle work, shared across all page renders. */
export function getBundleJsonCacheHeaders(
  ref: string | null | undefined,
): DocsCacheHeaders {
  if (isPinnedCommitRef(ref)) {
    return buildCdnCacheHeaders({
      edgeMaxAgeSeconds: PINNED_BUNDLE_EDGE_MAX_AGE,
      staleWhileRevalidate: CDN_STALE_SECONDS,
      staleIfError: CDN_STALE_SECONDS,
    });
  }

  return buildCdnCacheHeaders({
    edgeMaxAgeSeconds: MUTABLE_BUNDLE_EDGE_MAX_AGE,
    staleWhileRevalidate: CDN_STALE_SECONDS,
    staleIfError: CDN_STALE_SECONDS,
  });
}

/** Apply Cache-Control for docs responses (browser-only or CDN-backed). */
export function setDocsCacheHeaders(
  target:
    | { setHeader(name: string, value: string): void }
    | Pick<Headers, "set">,
  headers: DocsCacheHeaders,
): void {
  if ("setHeader" in target) {
    target.setHeader("Cache-Control", headers.cacheControl);
    return;
  }

  target.set("Cache-Control", headers.cacheControl);
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
    pathname.startsWith("/.well-known") ||
    pathname === "/favicon.ico" ||
    (/\.[a-zA-Z0-9]+$/.test(pathname) &&
      !isRawDocRequestPath(pathname) &&
      !isDocsSearchPath(pathname) &&
      !isDocsSitemapPath(pathname) &&
      !isDocsRobotsPath(pathname) &&
      !isDocsLlmsTxtPath(pathname) &&
      !isDocsLlmsFullTxtPath(pathname))
  );
}

function getPathSegments(pathname: string) {
  return pathname.split("/").filter(Boolean);
}

function shouldApplyDocsCache(
  request: NextRequest,
  vanityOwner: string | null,
) {
  if (!getDocsCacheHeaders(request.nextUrl.pathname)) {
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

function getDocsCacheHeaders(pathname: string): DocsCacheHeaders | null {
  if (isMcpPath(pathname)) {
    return null;
  }

  if (isRawDocRequestPath(pathname)) {
    return RAW_DOC_CACHE_HEADERS;
  }

  if (isDocsSearchPath(pathname)) {
    return SEARCH_CACHE_HEADERS;
  }

  if (isDocsLlmsTxtPath(pathname)) {
    return LLMS_TXT_CACHE_HEADERS;
  }

  if (isDocsLlmsFullTxtPath(pathname)) {
    return LLMS_FULL_TXT_CACHE_HEADERS;
  }

  if (isDocsSitemapPath(pathname)) {
    return SITEMAP_CACHE_HEADERS;
  }

  if (isDocsRobotsPath(pathname)) {
    return ROBOTS_TXT_CACHE_HEADERS;
  }

  const segments = getPathSegments(pathname);

  if (segments.length >= 2) {
    return DOCS_HTML_CACHE_HEADERS;
  }

  return null;
}

function withDocsCache(
  response: NextResponse,
  headers: DocsCacheHeaders | null,
) {
  if (headers) {
    setDocsCacheHeaders(response.headers, headers);
  }

  return response;
}

function maybeTrackPageRequest(
  request: NextRequest,
  vanityOwner: string | null,
) {
  if (getDocsEnvironment() !== "production") {
    return;
  }

  if (isBypassPath(request.nextUrl.pathname)) {
    return;
  }

  const resolved = resolvePlausibleOwnerRepo(request.nextUrl.pathname, {
    vanityOwner,
    vanityDomain: Boolean(
      vanityOwner || request.headers.get("x-docs-page-vanity-domain"),
    ),
  });

  if (!resolved) {
    return;
  }

  void trackPageRequest(request, resolved.owner, resolved.repository);
}

export function proxy(request: NextRequest) {
  const vanityOwner = getVanityOwnerFromHost(request.nextUrl.hostname);
  maybeTrackPageRequest(request, vanityOwner);
  const cacheHeaders = shouldApplyDocsCache(request, vanityOwner)
    ? getDocsCacheHeaders(request.nextUrl.pathname)
    : null;

  if (
    request.headers.get("x-docs-page-vanity-domain") ||
    request.headers.get("x-docs-page-custom-domain")
  ) {
    return withDocsCache(NextResponse.next(), cacheHeaders);
  }

  if (!vanityOwner || isBypassPath(request.nextUrl.pathname)) {
    return withDocsCache(NextResponse.next(), cacheHeaders);
  }

  const firstSegment = request.nextUrl.pathname
    .split("/")
    .filter(Boolean)
    .at(0);

  if (firstSegment === vanityOwner) {
    return withDocsCache(NextResponse.next(), cacheHeaders);
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
    getDocsCacheHeaders(request.nextUrl.pathname),
  );
}
