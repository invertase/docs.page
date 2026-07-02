import { getCustomDomain } from "@/lib/custom-domain";
import type { DocsBundlePayload } from "@/lib/docs-bundle-api";
import {
  getDocsEnvironment,
  getPublicDocsSiteBase,
} from "@/lib/docs-environment";
import { ensureLeadingSlash, isExternalLink } from "@/lib/docs-links";
import { formatRefPathSegment } from "@/lib/docs-paths";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";

function getRelativeRedirectBase(
  route: ResolvedDocsRoute,
  domain: string | null,
) {
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

/**
 * Resolve a redirect target against the repo doc-root + ref (the same base the
 * frontmatter `redirect` key uses). External URLs are returned verbatim;
 * everything else is treated as repo-relative and anchored to the doc-root, so
 * relative values like `bar/baz` resolve cleanly instead of relative to the
 * incoming (possibly bad) path.
 */
async function buildRedirectDestination(
  route: ResolvedDocsRoute,
  redirectTo: string,
) {
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

export async function resolveFrontmatterRedirectDestination(
  route: ResolvedDocsRoute,
  bundle: Pick<DocsBundlePayload, "frontmatter">,
) {
  const redirectTo =
    typeof bundle.frontmatter.redirect === "string"
      ? bundle.frontmatter.redirect.trim()
      : "";

  if (!redirectTo) {
    return null;
  }

  return buildRedirectDestination(route, redirectTo);
}

/** Strip leading/trailing slashes so `/foo`, `foo` and `foo/` all compare equal. */
function normalizeRedirectKey(value: string): string {
  return value.trim().replace(/^\/+/, "").replace(/\/+$/, "");
}

/**
 * Resolve a config-level `redirects` map for the incoming doc path. Keys are
 * matched tolerant of leading/trailing slashes; the matched value is resolved
 * against the repo doc-root + ref (see {@link buildRedirectDestination}).
 *
 * Returns the destination URL, or `null` when there is no matching redirect.
 * This is intended to run on the 404 / not-found branch (a deleted `.mdx`),
 * where the bundle — and therefore the config — is not otherwise available.
 */
export async function resolveConfigRedirectDestination(
  route: ResolvedDocsRoute,
  redirects: Record<string, string> | undefined,
) {
  if (!redirects) {
    return null;
  }

  const incomingKey = normalizeRedirectKey(route.docPath);

  for (const [key, target] of Object.entries(redirects)) {
    if (typeof target !== "string") {
      continue;
    }

    if (normalizeRedirectKey(key) !== incomingKey) {
      continue;
    }

    const redirectTo = target.trim();

    if (!redirectTo) {
      return null;
    }

    return buildRedirectDestination(route, redirectTo);
  }

  return null;
}
