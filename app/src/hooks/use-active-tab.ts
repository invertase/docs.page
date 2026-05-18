import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import { resolveActiveTabId } from "@/lib/docs-routing";

export function useActiveTab(): string | undefined {
  const { bundle, route } = useDocPageContext();
  const activeTab = resolveActiveTabId(route, useDocTabs(), bundle.config.locales);
  return activeTab ?? undefined;
}
