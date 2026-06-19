import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getRouteLocale } from "@/lib/docs-nav";

export function useDocTabs() {
  const { bundle, route } = useDocPageContext();
  const tabs = bundle.config.tabs ?? [];
  const locale = getRouteLocale(route.docPath, bundle.config.locales);

  if (!locale) {
    return tabs.filter((tab) => !tab.locale);
  }

  return tabs.filter((tab) => tab.locale === locale);
}
