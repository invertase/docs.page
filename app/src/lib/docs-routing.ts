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
