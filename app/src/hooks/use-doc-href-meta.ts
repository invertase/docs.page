import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocHref } from "@/hooks/use-doc-href";
import { isDocHrefActive } from "@/lib/docs-nav";

export function useDocHrefMeta(href: string) {
  const { bundle, route } = useDocPageContext();

  return {
    href: useDocHref(href),
    isActive: isDocHrefActive(route, href, bundle.config.locales),
  };
}
