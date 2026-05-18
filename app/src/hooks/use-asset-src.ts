import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc, isExternalLink } from "@/lib/docs-assets";

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
