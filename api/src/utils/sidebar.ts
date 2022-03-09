type SidebarItem = [string, Array<[string, string]>] | [string, string];

type SidebarConfig = SidebarItem[] | Record<string, SidebarItem[]>;

export const getPrefixSidebar = (sidebar: SidebarConfig, prefix?: string) => {
  if (Array.isArray(sidebar)) {
    return sidebar;
  }
  if (prefix && sidebar[prefix] && Array.isArray(sidebar[prefix])) {
    return sidebar[prefix];
  }
};
