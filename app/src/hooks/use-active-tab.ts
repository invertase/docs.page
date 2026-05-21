import { useMemo } from "react";
import { useRouter } from "next/router";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { resolveActiveTabId } from "@/lib/docs-nav";
import {
  buildPublicPathname,
  extractDocPathFromPathname,
} from "@/lib/docs-paths";

export function useActiveTab(): string | undefined {
  const { bundle, route } = useDocPageContext();
  const router = useRouter();
  const tabs = useDocTabs();

  const liveRoute = useMemo(() => {
    const pathname = router.asPath.split("?")[0]?.split("#")[0] || "/";
    const docPath = extractDocPathFromPathname(pathname, route);

    if (docPath === route.docPath) {
      return route;
    }

    return {
      ...route,
      docPath,
      publicPathname: buildPublicPathname({
        requestMode: route.requestMode,
        owner: route.owner,
        repository: route.repository,
        ref: route.ref,
        docPath,
      }),
    };
  }, [router.asPath, route]);

  const activeTab = resolveActiveTabId(
    liveRoute,
    tabs,
    bundle.config.locales,
  );
  return activeTab ?? undefined;
}
