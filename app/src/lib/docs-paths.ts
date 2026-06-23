import type { DocsRequestMode, ResolvedDocsRoute } from "@/lib/docs-routing";

type DocsPathRoute = Pick<
  ResolvedDocsRoute,
  "requestMode" | "owner" | "repository" | "ref"
>;

export function formatRefPathSegment(ref: string | null | undefined): string {
  return ref ? `~${encodeURIComponent(ref)}` : "";
}

export function getDocsRepoScopedPath(route: DocsPathRoute) {
  const refSegment = formatRefPathSegment(route.ref);

  if (route.requestMode === "custom-domain") {
    return "/";
  }

  if (route.requestMode === "preview") {
    return "/preview";
  }

  if (route.requestMode === "vanity") {
    return `/${route.repository}${refSegment}`;
  }

  return `/${route.owner}/${route.repository}${refSegment}`;
}

function stripDocPathSegment(path: string): string {
  const s = path.replace(/^\/+|\/+$/g, "");
  if (s === "" || s === "index") {
    return "";
  }
  return s;
}

/** Doc path segment for the current URL (without repo/ref prefix). */
export function extractDocPathFromPathname(
  pathname: string,
  route: DocsPathRoute,
): string {
  const normalizedPath = pathname.split("?")[0]?.split("#")[0] || "/";

  if (route.requestMode === "custom-domain") {
    if (route.ref) {
      const refPrefix = `/${formatRefPathSegment(route.ref)}`;
      if (normalizedPath === refPrefix) {
        return "";
      }
      if (normalizedPath.startsWith(`${refPrefix}/`)) {
        return stripDocPathSegment(normalizedPath.slice(refPrefix.length));
      }
    }

    return stripDocPathSegment(normalizedPath);
  }

  const scoped = getDocsRepoScopedPath(route);

  if (normalizedPath === scoped) {
    return "";
  }

  if (normalizedPath.startsWith(`${scoped}/`)) {
    return stripDocPathSegment(normalizedPath.slice(scoped.length));
  }

  return stripDocPathSegment(normalizedPath);
}

export function buildPublicPathname(args: {
  requestMode: DocsRequestMode;
  owner: string;
  repository: string;
  ref: string | null;
  docPath: string;
}) {
  const { requestMode, owner, repository, ref, docPath } = args;
  const refSegment = formatRefPathSegment(ref);
  const docSegment = docPath ? `/${docPath}` : "";

  if (requestMode === "custom-domain") {
    if (ref) {
      return `/${refSegment}${docSegment}`;
    }

    return docSegment || "/";
  }

  if (requestMode === "vanity") {
    return `/${repository}${refSegment}${docSegment}`;
  }

  if (requestMode === "preview") {
    return docSegment ? `/preview${docSegment}` : "/preview";
  }

  return `/${owner}/${repository}${refSegment}${docSegment}`;
}

/** Public URL for the raw markdown version of a docs page. */
export function buildRawDocPathname(publicPathname: string): string {
  const base = publicPathname.replace(/\/$/, "") || "";

  return base ? `${base}.md` : "/index.md";
}

export function getMcpEndpointPathname(route: DocsPathRoute) {
  const refSegment = formatRefPathSegment(route.ref);

  if (route.requestMode === "custom-domain") {
    return route.ref ? `/${refSegment}/mcp` : "/mcp";
  }

  if (route.requestMode === "vanity") {
    return `/${route.repository}${refSegment}/mcp`;
  }

  return `/${route.owner}/${route.repository}${refSegment}/mcp`;
}

export function getSearchIndexPathname(route: DocsPathRoute) {
  return getDocsRepoUtilityPathname(route, "search.json");
}

function getDocsRepoUtilityPathname(route: DocsPathRoute, filename: string) {
  const refSegment = formatRefPathSegment(route.ref);

  if (route.requestMode === "custom-domain") {
    return route.ref ? `/${refSegment}/${filename}` : `/${filename}`;
  }

  if (route.requestMode === "vanity") {
    return `/${route.repository}${refSegment}/${filename}`;
  }

  return `/${route.owner}/${route.repository}${refSegment}/${filename}`;
}

export function getSitemapPathname(route: DocsPathRoute) {
  return getDocsRepoUtilityPathname(route, "sitemap.xml");
}

export function getMcpEndpointUrl(route: DocsPathRoute, origin: string) {
  return new URL(getMcpEndpointPathname(route), origin).toString();
}

export class InvalidDocPathError extends Error {
  readonly name = "INVALID_DOC_PATH";

  constructor(message = "Invalid documentation path.") {
    super(message);
  }
}

/**
 * Normalize a user-supplied docs page path and reject traversal attempts.
 */
export function normalizeDocPath(path: string): string {
  if (!path || path.includes("\0")) {
    throw new InvalidDocPathError();
  }

  if (/%2e/i.test(path)) {
    throw new InvalidDocPathError();
  }

  let decoded = path;

  try {
    decoded = decodeURIComponent(path);
  } catch {
    throw new InvalidDocPathError();
  }

  if (decoded.includes("..")) {
    throw new InvalidDocPathError();
  }

  if (decoded.startsWith("/") || decoded.includes("\\")) {
    throw new InvalidDocPathError();
  }

  let normalized = decoded.replace(/\\/g, "/").replace(/^\/+/, "");

  if (normalized.startsWith("docs/")) {
    normalized = normalized.slice("docs/".length);
  }

  normalized = normalized.replace(/\/+/g, "/").replace(/\/$/, "");

  if (
    !normalized ||
    normalized.split("/").some((segment) => segment === "..")
  ) {
    throw new InvalidDocPathError();
  }

  return normalized;
}
