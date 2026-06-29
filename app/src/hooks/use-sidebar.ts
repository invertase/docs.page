import type { SidebarGroup } from "@/server/config/models/sidebar";
import { useActiveTab } from "./use-active-tab";
import { useDocPageContext } from "./use-doc-page-context";
import { useLocale } from "./use-locale";

// Returns the sidebar for the current page and locale.
export function useSidebar(): SidebarGroup[] {
  const ctx = useDocPageContext();
  const locale = useLocale();
  const activeTab = useActiveTab();

  let sidebar: SidebarGroup[] = [];
  if (locale && !Array.isArray(ctx.bundle.config.sidebar)) {
    sidebar = ctx.bundle.config.sidebar[locale];
  } else if (!Array.isArray(ctx.bundle.config.sidebar)) {
    sidebar = ctx.bundle.config.sidebar.default || [];
  } else {
    sidebar = ctx.bundle.config.sidebar;
  }

  if (activeTab !== undefined) {
    return sidebar.filter((group) => {
      return group.tab === activeTab || !group.tab;
    });
  }

  return sidebar;
}
