import { buildPublicPathname, formatRefPathSegment } from "@/lib/docs-paths";

export type DocsRequestMode = "canonical" | "vanity" | "custom-domain" | "preview";
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
  return isDocsRepoFilePath(pathname, "sitemap.xml");
}

/** Per-repo LLM-oriented doc index at `/{owner}/{repo}/llms.txt` (or vanity / custom-domain equivalents). */
export function isDocsLlmsTxtPath(pathname: string) {
  return isDocsRepoFilePath(pathname, "llms.txt");
}

/** Per-repo full LLM-oriented doc index at `/{owner}/{repo}/llms-full.txt` (or vanity / custom-domain equivalents). */
export function isDocsLlmsFullTxtPath(pathname: string) {
  return isDocsRepoFilePath(pathname, "llms-full.txt");
}

export function isDocsRepoFilePath(pathname: string, filename: string) {
  return pathname === `/${filename}` || pathname.endsWith(`/${filename}`);
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
  const refSegment = formatRefPathSegment(ref);
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
