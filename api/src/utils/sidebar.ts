
type SidebarItem = [string, Array<[string, string]>] | [string, string];

type SidebarConfig = SidebarItem[] | Record<string, SidebarItem[]>

export const getLocaleSidebar = (sidebar: SidebarConfig, locale?: string) => {
    if (Array.isArray(sidebar)) {
        return sidebar;
    }
    if (locale && sidebar[locale] && Array.isArray(sidebar[locale])) {
        return sidebar[locale];
    }
}