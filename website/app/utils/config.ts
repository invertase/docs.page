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
  // sidebar: SidebarItem[];
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
  // navigation: [],
  // sidebar: [],
  headerDepth: 3,
  variables: {},
  googleTagManager: '',
  zoomImages: false,
};

// Merges any user config with default values.
// export function mergeConfig(json: Partial<ProjectConfig> | null): ProjectConfig {
//   return {
//     name: getString(json, 'name', defaultConfig.name),
//     logo: getString(json, 'logo', defaultConfig.logo),
//     logoDark: getString(json, 'logoDark', defaultConfig.logoDark),
//     favicon: getString(json, 'favicon', defaultConfig.favicon),
//     socialPreview: getString(json, 'socialPreview', defaultConfig.socialPreview),
//     twitter: getString(json, 'twitter', defaultConfig.twitter),
//     noindex: getBoolean(json, 'noindex', defaultConfig.noindex),
//     theme: getString(json, 'theme', defaultConfig.theme),
//     docsearch: get(json, 'docsearch')
//       ? {
//           appId: getString(json, 'docsearch.appId', ''),
//           apiKey: getString(json, 'docsearch.apiKey', ''),
//           indexName: getString(json, 'docsearch.indexName', ''),
//         }
//       : defaultConfig.docsearch,
//     navigation: mergeNavigationConfig(json),
//     sidebar: mergeSidebarConfig(json),
//     headerDepth: getNumber(json, 'headerDepth', defaultConfig.headerDepth),
//     variables: get(json, 'variables', defaultConfig.variables),
//     googleTagManager: getString(json, 'googleTagManager', defaultConfig.googleTagManager),
//     zoomImages: getBoolean(json, 'zoomImages', defaultConfig.zoomImages),
//   };
// }

