import { buildPublicPathname } from "@/lib/docs-paths";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import { isExternalLink } from "@/lib/docs-links";

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
  const current = normalizeDocPathSegment(route.docPath);
  let best: { id: string; len: number } | null = null;
  for (const tab of tabs) {
    const tabPath = normalizeDocPathSegment(
      resolveLocalizedDocPath(route.docPath, tab.href, locales),
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
