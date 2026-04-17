import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { resolveInternalDocHref } from "@/lib/docs-routing";

export function useDocHref(href: string) {
  const { bundle, route } = useDocPageContext();

  return resolveInternalDocHref(route, href, bundle.config.locales);
}
