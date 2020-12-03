import { createContext } from 'react';
import get from 'lodash.get';
import { DEFAULT_LAYOUT, LayoutType } from './components/Layout';
import { getNumber, getString } from './utils';

export type NavigationItem = [string, string];

// A single item within the nav bar
export type SidebarItem = [string, SidebarItem[]] | [string, string];

/**
 * Project config.
 *
 * This can be provided by creating a `docs.json` file at the root of your
 * repository.
 */
export type Config = {
  // Project name.
  name: string;
  // URL to project logo.
  logo: string;
  // Image to display as the social preview on shared URLs
  socialPreview: string;
  // A color theme used for this project. Defaults to "#00bcd4".
  theme: string;
  // Docsearch Application ID. If populated, a search box with autocomplete will be rendered.
  docsearch?: {
    apiKey: string;
    indexName: string;
  };
  // Header navigation
  navigation: NavigationItem[];
  // Sidebar
  sidebar: SidebarItem[];
  // The default layout type.
  defaultLayout: LayoutType;
  // The depth to heading tags are linked. Set to 0 to remove any linking.
  headerDepth: number;
  // Variables which can be injected into the pages content.
  variables: object;
  // Adds Google Analytics tracking ID to the page
  googleAnalytics: string;
};

export const defaultConfig: Config = {
  name: '',
  logo: '',
  socialPreview: '',
  theme: '#00bcd4',
  docsearch: null,
  navigation: [],
  sidebar: [],
  defaultLayout: DEFAULT_LAYOUT,
  headerDepth: 3,
  variables: {},
  googleAnalytics: '',
};

// Merges any user config with default values.
export function mergeConfig(json: any): Config {
  return {
    name: getString(json, 'name', defaultConfig.name),
    logo: getString(json, 'logo', defaultConfig.logo),
    socialPreview: getString(json, 'socialPreview', defaultConfig.socialPreview),
    theme: getString(json, 'theme', defaultConfig.theme),
    docsearch: get(json, 'docsearch')
      ? {
          apiKey: getString(json, 'docsearch.apiKey', ''),
          indexName: getString(json, 'docsearch.indexName', ''),
        }
      : defaultConfig.docsearch,
    navigation: mergeNavigationConfig(json),
    sidebar: mergeSidebarConfig(json),
    defaultLayout: getString<LayoutType>(json, 'defaultLayout', defaultConfig.defaultLayout),
    headerDepth: getNumber(json, 'headerDepth', defaultConfig.headerDepth),
    variables: get(json, 'variables', defaultConfig.variables),
    googleAnalytics: getString(json, 'googleAnalytics', defaultConfig.googleAnalytics),
  };
}

// Merges in a user sidebar config and ensures all items are valid.
function mergeSidebarConfig(json: any): SidebarItem[] {
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
function mergeNavigationConfig(json: any): NavigationItem[] {
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

export const ConfigContext = createContext<Config>(defaultConfig);
