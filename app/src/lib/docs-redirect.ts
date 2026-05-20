import type { DocsBundlePayload } from "@/lib/docs-bundle-api";
import { getCustomDomain } from "@/lib/custom-domain";
import {
  getDocsEnvironment,
  getPublicDocsSiteBase,
} from "@/lib/docs-environment";
import { formatRefPathSegment } from "@/lib/docs-paths";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import { ensureLeadingSlash, isExternalLink } from "@/lib/docs-links";

function getRelativeRedirectBase(route: ResolvedDocsRoute, domain: string | null) {
  const environment = getDocsEnvironment();

  if (route.vanity) {
    return `https://${route.owner}.docs.page/${route.repository}`;
  }

  if (route.customDomain) {
    if (environment === "development") {
      return "http://localhost:8787";
    }

    if (domain) {
      return `https://${domain}`;
    }
  }

  return `${getPublicDocsSiteBase()}/${route.owner}/${route.repository}`;
}

export async function resolveFrontmatterRedirectDestination(
  route: ResolvedDocsRoute,
  bundle: Pick<DocsBundlePayload, "frontmatter">,
) {
  const redirectTo = typeof bundle.frontmatter.redirect === "string"
    ? bundle.frontmatter.redirect.trim()
    : "";

  if (!redirectTo) {
    return null;
  }

  if (isExternalLink(redirectTo)) {
    return redirectTo;
  }

  const customDomain = route.customDomain
    ? await getCustomDomain(route.owner, route.repository)
    : null;
  let destination = getRelativeRedirectBase(route, customDomain);

  if (route.ref) {
    destination += route.customDomain ? "/" : "";
    destination += formatRefPathSegment(route.ref);
  }

  return `${destination}${ensureLeadingSlash(redirectTo)}`;
}
