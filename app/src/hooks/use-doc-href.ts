import { useRouter } from "next/router";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { isExternalLink } from "@/lib/docs-assets";
import { resolveInternalDocHref } from "@/lib/docs-routing";

export function useDocHref(href: string) {
  const { bundle, route } = useDocPageContext();
  const router = useRouter();
  const resolvedHref = resolveInternalDocHref(
    route,
    href,
    bundle.config.locales,
  );

  if (route.requestMode !== "preview" || isExternalLink(href)) {
    return resolvedHref;
  }

  const socketUrl = getPreviewSocketUrl(router.asPath);

  if (!socketUrl) {
    return resolvedHref;
  }

  const url = new URL(resolvedHref, "http://docs.page");
  url.searchParams.set("url", socketUrl);
  return `${url.pathname}${url.search}${url.hash}`;
}

function getPreviewSocketUrl(asPath: string) {
  const query = asPath.split("?", 2)[1];

  if (!query) {
    return null;
  }

  return new URLSearchParams(query).get("url");
}
