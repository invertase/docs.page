import { isDocHrefActive, type ResolvedDocsRoute } from "@/lib/docs-routing";
import type { SidebarGroup } from "@/server/config/models/sidebar";

export function getSidebarGroups(config: { sidebar: unknown }): SidebarGroup[] {
  const raw = config.sidebar;
  if (Array.isArray(raw)) {
    return raw as SidebarGroup[];
  }
  if (raw && typeof raw === "object") {
    const rec = raw as Record<string, SidebarGroup[]>;
    return rec.default ?? Object.values(rec)[0] ?? [];
  }
  return [];
}

function isPageLink(item: SidebarGroup["pages"][number]): boolean {
  return "title" in item;
}

export function subtreeHasActivePage(
  route: ResolvedDocsRoute,
  pages: SidebarGroup["pages"],
  locales: string[],
): boolean {
  for (const p of pages) {
    if (isPageLink(p)) {
      const link = p as { title: string; href: string };
      if (isDocHrefActive(route, link.href, locales)) {
        return true;
      }
    } else {
      const nested = p as SidebarGroup;
      if (nested.href && isDocHrefActive(route, nested.href, locales)) {
        return true;
      }
      if (subtreeHasActivePage(route, nested.pages, locales)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * The top-level `group` label for the sidebar block that contains the
 * current page (same rail section as the left nav group header).
 */
export function getActiveTopLevelSidebarGroupLabel(
  route: ResolvedDocsRoute,
  config: { sidebar: unknown },
  locales: string[],
  hasTabs: boolean,
  activeTabId: string | null,
): string | null {
  const groups = getSidebarGroups(config).filter((g) => {
    if (!g.tab) {
      return true;
    }
    if (!hasTabs) {
      return true;
    }
    return g.tab === activeTabId;
  });
  for (const g of groups) {
    if (!g.group) {
      continue;
    }
    if (g.href && isDocHrefActive(route, g.href, locales)) {
      return g.group;
    }
    if (subtreeHasActivePage(route, g.pages, locales)) {
      return g.group;
    }
  }
  return null;
}
