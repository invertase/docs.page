export const getLocaleSidebar = (sidebar: any, locale?: string) => {
    if (Array.isArray(sidebar)) {
        return sidebar;
    }
    if (locale && sidebar[locale] && Array.isArray(sidebar[locale])) {
        return sidebar[locale];
    }
}