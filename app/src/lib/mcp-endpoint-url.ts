import type { ResolvedDocsRoute } from "@/lib/docs-routing";

export function getMcpEndpointPathname(
  route: Pick<
    ResolvedDocsRoute,
    "requestMode" | "owner" | "repository" | "ref"
  >,
) {
  const encodedRef = route.ref ? `~${encodeURIComponent(route.ref)}` : "";

  if (route.requestMode === "custom-domain") {
    return route.ref ? `/${encodedRef}/mcp` : "/mcp";
  }

  if (route.requestMode === "vanity") {
    return `/${route.repository}${encodedRef}/mcp`;
  }

  return `/${route.owner}/${route.repository}${encodedRef}/mcp`;
}

export function getMcpEndpointUrl(
  route: Pick<
    ResolvedDocsRoute,
    "requestMode" | "owner" | "repository" | "ref"
  >,
  origin: string,
) {
  return new URL(getMcpEndpointPathname(route), origin).toString();
}
