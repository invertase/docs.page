import { getCustomDomain } from "@/lib/custom-domain";
import {
  getDocsEnvironment,
  getPublicDocsSiteBase,
} from "@/lib/docs-environment";
import { buildPublicPathname } from "@/lib/docs-paths";
import {
  resolveDocsRoute,
  type ResolvedDocsRoute,
} from "@/lib/docs-routing";

export function resolveCanonicalUrl(
  route: ResolvedDocsRoute,
  customDomain: string | null,
): string | null {
  const environment = getDocsEnvironment();

  if (route.requestMode === "preview" || environment === "development") {
    return null;
  }

  if (customDomain && environment === "production") {
    const path = buildPublicPathname({
      requestMode: "custom-domain",
      owner: route.owner,
      repository: route.repository,
      ref: route.ref,
      docPath: route.docPath,
    });

    return new URL(path || "/", `https://${customDomain}`).toString();
  }

  return new URL(
    route.canonicalPathname,
    getPublicDocsSiteBase(),
  ).toString();
}

export async function resolveDocsRouteWithCanonical(
  args: Parameters<typeof resolveDocsRoute>[0],
): Promise<ResolvedDocsRoute> {
  const route = resolveDocsRoute(args);

  if (route.requestMode === "preview") {
    return route;
  }

  const customDomain = await getCustomDomain(route.owner, route.repository);

  return {
    ...route,
    canonicalUrl: resolveCanonicalUrl(route, customDomain),
  };
}
