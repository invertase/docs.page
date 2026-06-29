import type { DocsBundlePayload } from "@/lib/docs-bundle-api";
import { ensureLeadingSlash, isExternalLink } from "@/lib/docs-links";

export function getGithubRawAssetUrl(
  bundle: Pick<DocsBundlePayload, "source" | "baseBranch">,
  path: string,
) {
  const { source, baseBranch } = bundle;
  const ref = source.ref ?? baseBranch;

  if (source.type === "branch" || source.type === "PR") {
    return `https://raw.githubusercontent.com/${source.owner}/${source.repository}/${encodeURIComponent(ref)}/docs${ensureLeadingSlash(path)}`;
  }

  return `https://raw.githubusercontent.com/${source.owner}/${source.repository}/HEAD/docs${ensureLeadingSlash(path)}`;
}

export function getAssetSrc(
  bundle: Pick<DocsBundlePayload, "source" | "baseBranch">,
  path: string,
) {
  return isExternalLink(path) ? path : getGithubRawAssetUrl(bundle, path);
}
