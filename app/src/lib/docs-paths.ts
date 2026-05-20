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

export function getMcpEndpointUrl(route: DocsPathRoute, origin: string) {
  return new URL(getMcpEndpointPathname(route), origin).toString();
}
