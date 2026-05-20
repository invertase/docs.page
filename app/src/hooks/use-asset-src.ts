import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import { isExternalLink } from "@/lib/docs-links";

export function useAssetSrc(path: string) {
  const { bundle, route } = useDocPageContext();

  if (isExternalLink(path)) {
    return path;
  }

  // TODO: Resolve local preview assets once the CLI websocket exposes file URLs.
  if (route.requestMode === "preview") {
    return "";
  }

  return getAssetSrc(bundle, path);
}
