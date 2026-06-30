export type ConfigTab = string | string[];

export function matchesConfigTab(
  tab: ConfigTab | undefined,
  activeTab: string | undefined,
): boolean {
  if (tab === undefined) {
    return true;
  }

  if (activeTab === undefined) {
    return true;
  }

  if (typeof tab === "string") {
    return tab === activeTab;
  }

  return tab.includes(activeTab);
}
