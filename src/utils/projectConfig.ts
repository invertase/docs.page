import { createContext } from 'react';
import get from 'lodash.get';
import { getBoolean, getNumber, getString } from './index';

export type NavigationItem = [string, string];

// A single item within the nav bar
export type SidebarItem = [string, SidebarItem[]] | [string, string];

/**
 * Project config.
 *
 * This can be provided by creating a `docs.json` file at the root of your
 * repository.
 */
export interface ProjectConfig {
  // Project name.
  name: string;
  // URL to project logo.
  logo: string;
  // URL to project logo for dark mode
  logoDark: string;
  // URL to the favicon
  favicon: string;
  // Image to display as the social preview on shared URLs
  socialPreview: string;
  // Twitter tag for use in the header.
  twitter: string;
  // Whether the website should be indexable by search bots.
  noindex: boolean;
  // A color theme used for this project. Defaults to "#00bcd4".
  theme: string;
  // Docsearch Application ID. If populated, a search box with autocomplete will be rendered.
  docsearch?: {
    appId?: string;
    apiKey: string;
    indexName: string;
  };
  // Header navigation
  navigation: NavigationItem[];
  // Sidebar
  sidebar: SidebarItem[];
  // The depth to heading tags are linked. Set to 0 to remove any linking.
  headerDepth: number;
  // Variables which can be injected into the pages content.
  variables: Record<string, string>;
  // Adds Google Tag Manager to your documentation pages.
  googleTagManager: string;
  // Whether zoomable images are enabled by default
  zoomImages: boolean;
}

export const defaultConfig: ProjectConfig = {
  name: '',
  logo: '',
  logoDark: '',
  favicon: '',
  socialPreview: '',
  twitter: '',
  noindex: false,
  theme: '#00bcd4',
  docsearch: null,
  navigation: [],
  sidebar: [],
  headerDepth: 3,
  variables: {},
  googleTagManager: '',
  zoomImages: false,
};

// Merges any user config with default values.
export function mergeConfig(json: Partial<ProjectConfig> | null): ProjectConfig {
  return {
    name: getString(json, 'name', defaultConfig.name),
    logo: getString(json, 'logo', defaultConfig.logo),
    logoDark: getString(json, 'logoDark', defaultConfig.logoDark),
    favicon: getString(json, 'favicon', defaultConfig.favicon),
    socialPreview: getString(json, 'socialPreview', defaultConfig.socialPreview),
    twitter: getString(json, 'twitter', defaultConfig.twitter),
    noindex: getBoolean(json, 'noindex', defaultConfig.noindex),
    theme: getString(json, 'theme', defaultConfig.theme),
    docsearch: get(json, 'docsearch')
      ? {
          appId: getString(json, 'docsearch.appId', ''),
          apiKey: getString(json, 'docsearch.apiKey', ''),
          indexName: getString(json, 'docsearch.indexName', ''),
        }
      : defaultConfig.docsearch,
    navigation: mergeNavigationConfig(json),
    sidebar: mergeSidebarConfig(json),
    headerDepth: getNumber(json, 'headerDepth', defaultConfig.headerDepth),
    variables: get(json, 'variables', defaultConfig.variables),
    googleTagManager: getString(json, 'googleTagManager', defaultConfig.googleTagManager),
    zoomImages: getBoolean(json, 'zoomImages', defaultConfig.zoomImages),
  };
}

// Merges in a user sidebar config and ensures all items are valid.
function mergeSidebarConfig(json: Partial<ProjectConfig> | null): SidebarItem[] {
  const sidebar = get(json, 'sidebar', defaultConfig.sidebar);

  if (!Array.isArray(sidebar)) {
    return defaultConfig.sidebar;
  }

  function iterate(items: SidebarItem[]) {
    return items
      .map<SidebarItem>((item: SidebarItem) => {
        if (!Array.isArray(item)) return null;
        const [first, second] = item;
        if (typeof first !== 'string') return null;
        if (typeof second === 'string') return [first, second];
        if (!Array.isArray(second)) return null;
        return [first, iterate(second)];
      })
      .filter(Boolean);
  }

  return iterate(sidebar);
}

// Merges in a user navigation config and ensures all items are valid.
function mergeNavigationConfig(json: Partial<ProjectConfig> | null): NavigationItem[] {
  const navigation = get(json, 'navigation', defaultConfig.navigation);

  if (!Array.isArray(navigation)) {
    return defaultConfig.navigation;
  }

  return navigation
    .map<NavigationItem>((item: NavigationItem) => {
      if (!Array.isArray(item)) return null;
      const [title, url] = item;
      if (typeof title !== 'string') return null;
      if (typeof url !== 'string') return null;
      return [title, url];
    })
    .filter(Boolean);
}

export const ConfigContext = createContext<ProjectConfig>(defaultConfig);
