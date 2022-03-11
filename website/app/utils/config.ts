import { getBoolean, getNumber, getString, getValue } from './get';
import get from 'lodash.get';

// Represents how the sidebar should look in the config file.
export type SidebarItem = [string, Array<[string, string]>] | [string, string];

// Merges in a user sidebar config and ensures all items are valid.
function mergeSidebarConfig(json: Partial<ProjectConfig> | null): SidebarItem[] {
  const sidebar = get(json, 'sidebar', defaultConfig.sidebar);

  if (!Array.isArray(sidebar)) {
    return defaultConfig.sidebar;
  }

  function iterate(sidebar: SidebarItem[]): SidebarItem[] {
    return (
      sidebar
        .map((item: SidebarItem) => {
          // Each item should be an array.
          if (!Array.isArray(item)) return null;

          // Get the label and url/children
          const [label, urlOrChildren] = item;

          // The label should be a string.
          if (typeof label !== 'string') return null;

          // If the second item is a string, it's a url.
          if (typeof urlOrChildren === 'string') return [label, urlOrChildren];

          // Therefore, the second item must be an array.
          if (!Array.isArray(urlOrChildren)) return null;

          // Iterate the children and do some validation.
          const children = urlOrChildren
            .map(([nestedLabel, nestedUrl]) => {
              // Only allow single depth - each item must be a string.
              if (typeof nestedLabel !== 'string' || typeof nestedUrl !== 'string') return null;

              return [nestedLabel, nestedUrl];
            })
            .filter(Boolean);

          return [label, children];
        })
        // Filter out any nulls.
        .filter(Boolean) as SidebarItem[]
    );
  }

  return iterate(sidebar);
}

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
  // navigation: NavigationItem[];
  // Sidebar
  sidebar: SidebarItem[];
  // Locales:
  locales?: Record<string, string>;
  // The depth to heading tags are linked. Set to 0 to remove any linking.
  headerDepth: number;
  // Variables which can be injected into the pages content.
  variables: Record<string, string>;
  // Adds Google Tag Manager to your documentation pages.
  googleTagManager: string;
  // Whether zoomable images are enabled by default
  zoomImages: boolean;
  // Whether CodeHike is enabled
  experimentalCodehike: boolean;
  // Whether Math is enabled
  experimentalMath: boolean;
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
  // navigation: [],
  sidebar: [],
  headerDepth: 3,
  variables: {},
  googleTagManager: '',
  zoomImages: false,
  experimentalCodehike: false,
  experimentalMath: false,
};

// Merges any user config with default values.
export function mergeConfig(json: Record<string, unknown>): ProjectConfig {
  return {
    name: getString(json, 'name', defaultConfig.name),
    logo: getString(json, 'logo', defaultConfig.logo),
    logoDark: getString(json, 'logoDark', defaultConfig.logoDark),
    favicon: getString(json, 'favicon', defaultConfig.favicon),
    socialPreview: getString(json, 'socialPreview', defaultConfig.socialPreview),
    twitter: getString(json, 'twitter', defaultConfig.twitter),
    noindex: getBoolean(json, 'noindex', defaultConfig.noindex),
    theme: getString(json, 'theme', defaultConfig.theme),
    docsearch: getValue(json, 'docsearch')
      ? {
        appId: getString(json, 'docsearch.appId', ''),
        apiKey: getString(json, 'docsearch.apiKey', ''),
        indexName: getString(json, 'docsearch.indexName', ''),
      }
      : defaultConfig.docsearch,
    // navigation: mergeNavigationConfig(json),
    sidebar: mergeSidebarConfig(json),
    headerDepth: getNumber(json, 'headerDepth', defaultConfig.headerDepth),
    variables: getValue(json, 'variables', defaultConfig.variables) as Record<string, string>,
    googleTagManager: getString(json, 'googleTagManager', defaultConfig.googleTagManager),
    zoomImages: getBoolean(json, 'zoomImages', defaultConfig.zoomImages),
    // TODO: tidy the following:
    locales: (json.locales as Record<string, string>) ?? undefined,
    experimentalCodehike: getBoolean(
      json,
      'experimentalCodehike',
      defaultConfig.experimentalCodehike,
    ),
    experimentalMath: getBoolean(json, 'experimentalMath', defaultConfig.experimentalMath),
  };
}

export async function getConfiguration({ owner, repo, ref }: Record<string, string>): Promise<ProjectConfig> {

  let config: ProjectConfig = defaultConfig;

  const host = process.env.NODE_ENV === 'production' ? 'https://api.docs.page' : 'http://localhost:8000';

  const endpoint = `${host}/config?owner=${owner}&repository=${repo}${ref ? `&ref=${ref}` : ''}`;
  try {
    const res = await (await fetch(endpoint)).json();
    config = res.config
  } catch (e) {
    console.error(e)
  }

  return config;
}