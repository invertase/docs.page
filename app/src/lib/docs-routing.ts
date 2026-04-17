import { isExternalLink } from "@/lib/docs-assets";

export type DocsRequestMode = "canonical" | "vanity" | "custom-domain";
const RAW_DOC_SUFFIX_REGEX = /\.(md|mdx)$/i;
const ROOT_RAW_DOC_FALLBACK = "index.md";

export type ResolvedDocsRoute = {
  owner: string;
  repository: string;
  ref: string | null;
  docPath: string;
  requestMode: DocsRequestMode;
  vanity: boolean;
  customDomain: boolean;
  canonicalPathname: string;
  publicPathname: string;
};

const RESERVED_VANITY_SUBDOMAINS = new Set(["docs", "www", "staging"]);

export function parseRepositorySegment(repoSegment: string) {
  const [repository, ...refParts] = repoSegment.split("~");
  const ref = refParts.length > 0 ? refParts.join("~") || null : null;

  return {
    repository,
    ref,
  };
}

export function getDocsRequestMode(headers: Headers): DocsRequestMode {
  if (headers.get("x-docs-page-custom-domain")) {
    return "custom-domain";
  }

  if (headers.get("x-docs-page-vanity-domain")) {
    return "vanity";
  }

  return "canonical";
}

export function isRawDocRequestPath(pathname: string) {
  return RAW_DOC_SUFFIX_REGEX.test(pathname);
}

/** Per-repo docs sitemap at `/{owner}/{repo}/sitemap.xml` (or vanity / custom-domain equivalents). */
export function isDocsSitemapPath(pathname: string) {
  return pathname === "/sitemap.xml" || pathname.endsWith("/sitemap.xml");
}

/** Per-repo LLM-oriented doc index at `/{owner}/{repo}/llms.txt` (or vanity / custom-domain equivalents). */
export function isDocsLlmsTxtPath(pathname: string) {
  return pathname === "/llms.txt" || pathname.endsWith("/llms.txt");
}

export function stripRawDocRequestSuffix(path: string) {
  return path.replace(RAW_DOC_SUFFIX_REGEX, "");
}

function normalizeRawDocsParams(args: {
  repoSegment: string;
  path?: string[];
}) {
  const { repoSegment, path } = args;

  if (path && path.length > 0) {
    return {
      repoSegment,
      path,
    };
  }

  const parsed = parseRepositorySegment(repoSegment);

  if (parsed.ref && isRawDocRequestPath(parsed.ref)) {
    return {
      repoSegment: `${parsed.repository}~${stripRawDocRequestSuffix(parsed.ref)}`,
      path: [ROOT_RAW_DOC_FALLBACK],
    };
  }

  if (isRawDocRequestPath(parsed.repository)) {
    return {
      repoSegment: stripRawDocRequestSuffix(parsed.repository),
      path: [ROOT_RAW_DOC_FALLBACK],
    };
  }

  return {
    repoSegment,
    path,
  };
}

function buildPublicPathname(args: {
  requestMode: DocsRequestMode;
  owner: string;
  repository: string;
  ref: string | null;
  docPath: string;
}) {
  const { requestMode, owner, repository, ref, docPath } = args;
  const encodedRef = ref ? `~${encodeURIComponent(ref)}` : "";
  const docSegment = docPath ? `/${docPath}` : "";

  if (requestMode === "custom-domain") {
    if (ref) {
      return `/${encodedRef}${docSegment}`;
    }

    return docSegment || "/";
  }

  if (requestMode === "vanity") {
    return `/${repository}${encodedRef}${docSegment}`;
  }

  return `/${owner}/${repository}${encodedRef}${docSegment}`;
}

/** Normalizes a route doc path or sidebar href segment for comparison (root ↔ `/`, `index`). */
export function normalizeDocPathSegment(path: string): string {
  const s = path.replace(/^\/+|\/+$/g, "");
  if (s === "" || s === "index") {
    return "";
  }
  return s;
}

export function getRouteLocale(routeDocPath: string, locales: string[] = []) {
  const locale = normalizeDocPathSegment(routeDocPath).split("/").filter(Boolean).at(0);
  return locale && locales.includes(locale) ? locale : undefined;
}

function resolveLocalizedDocPath(
  currentDocPath: string,
  href: string,
  locales: string[] = [],
) {
  const trimmed = href.trim();
  if (isExternalLink(trimmed)) {
    return trimmed;
  }

  const docPath = normalizeDocPathSegment(trimmed);
  const locale = getRouteLocale(currentDocPath, locales);

  if (!locale) {
    return docPath;
  }

  const [firstSegment] = docPath.split("/").filter(Boolean);
  if (firstSegment === locale || locales.includes(firstSegment ?? "")) {
    return docPath;
  }

  return docPath ? `${locale}/${docPath}` : locale;
}

export function resolveInternalDocHref(
  route: ResolvedDocsRoute,
  href: string,
  locales: string[] = [],
): string {
  const docPath = resolveLocalizedDocPath(route.docPath, href, locales);
  if (isExternalLink(docPath)) {
    return docPath;
  }

  return buildPublicPathname({
    requestMode: route.requestMode,
    owner: route.owner,
    repository: route.repository,
    ref: route.ref,
    docPath,
  });
}

/** Resolves a sidebar `href` from docs config to the correct pathname for the current request mode. */
export function resolveSidebarNavHref(
  route: ResolvedDocsRoute,
  href: string,
  locales: string[] = [],
): string {
  return resolveInternalDocHref(route, href, locales);
}

/** True when the current page matches a sidebar link (same docs path). */
export function docPathMatchesSidebarHref(
  routeDocPath: string,
  sidebarHref: string,
  locales: string[] = [],
): boolean {
  if (isExternalLink(sidebarHref.trim())) {
    return false;
  }

  return (
    normalizeDocPathSegment(routeDocPath)
    === normalizeDocPathSegment(resolveLocalizedDocPath(routeDocPath, sidebarHref, locales))
  );
}

export function isDocHrefActive(
  route: ResolvedDocsRoute,
  href: string,
  locales: string[] = [],
): boolean {
  if (isExternalLink(href.trim())) {
    return false;
  }

  return route.publicPathname === resolveInternalDocHref(route, href, locales);
}

/**
 * When `tabs` is non-empty, returns the tab `id` whose `href` prefix best matches the current doc path.
 */
export function resolveActiveTabId(
  route: ResolvedDocsRoute,
  tabs: Array<{ id: string; href: string }>,
  locales: string[] = [],
): string | null {
  if (tabs.length === 0) {
    return null;
  }
  const current = normalizeDocPathSegment(route.publicPathname);
  let best: { id: string; len: number } | null = null;
  for (const tab of tabs) {
    const tabPath = normalizeDocPathSegment(
      resolveInternalDocHref(route, tab.href, locales),
    );
    const matches =
      current === tabPath ||
      (tabPath !== "" && (current === tabPath || current.startsWith(`${tabPath}/`)));
    if (matches && (!best || tabPath.length >= best.len)) {
      best = { id: tab.id, len: tabPath.length };
    }
  }
  return best?.id ?? tabs[0]?.id ?? null;
}

export function resolveDocsRoute(args: {
  owner: string;
  repoSegment: string;
  path?: string[];
  headers: Headers;
}): ResolvedDocsRoute {
  const { owner, repoSegment, path, headers } = args;
  const { repository, ref } = parseRepositorySegment(repoSegment);
  const docPath = path?.join("/") ?? "";
  const requestMode = getDocsRequestMode(headers);
  const vanity = requestMode === "vanity";
  const customDomain = requestMode === "custom-domain";
  const refSegment = ref ? `~${encodeURIComponent(ref)}` : "";
  const docSegment = docPath ? `/${docPath}` : "";

  return {
    owner,
    repository,
    ref,
    docPath,
    requestMode,
    vanity,
    customDomain,
    canonicalPathname: `/${owner}/${repository}${refSegment}${docSegment}`,
    publicPathname: buildPublicPathname({
      requestMode,
      owner,
      repository,
      ref,
      docPath,
    }),
  };
}

export function resolveRawDocsRoute(args: {
  owner: string;
  repoSegment: string;
  path?: string[];
  headers: Headers;
}) {
  const normalized = normalizeRawDocsParams({
    repoSegment: args.repoSegment,
    path: args.path,
  });

  return resolveDocsRoute({
    owner: args.owner,
    repoSegment: normalized.repoSegment,
    path: normalized.path,
    headers: args.headers,
  });
}

export function getVanityOwnerFromHost(hostname: string): string | null {
  if (!hostname.endsWith(".docs.page")) {
    return null;
  }

  const subdomain = hostname.slice(0, -".docs.page".length);

  if (!subdomain || subdomain.includes(".") || RESERVED_VANITY_SUBDOMAINS.has(subdomain)) {
    return null;
  }

  return subdomain;
}

/** Matches `resolveGitHubSource` commit detection: pinned to an immutable tree. */
export function isPinnedCommitRef(ref: string | null | undefined): boolean {
  return typeof ref === "string" && /^[a-fA-F0-9]{40}$/.test(ref);
}
