import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getRouteLocale } from "@/lib/docs-nav";

export function useLocale(): string | undefined {
  const { bundle, route } = useDocPageContext();
  return getRouteLocale(route.docPath, bundle.config.locales);
}
