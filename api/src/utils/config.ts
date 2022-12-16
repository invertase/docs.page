import { getBoolean, getNumber, getString, getValue } from './get.js';
import get from 'lodash.get';

import yaml from 'js-yaml';
import toml from '@ltd/j-toml';
import { OutputConfig } from '@docs.page/server';

// Represents how the sidebar should look in the config file.
export type SidebarItem = [string, Array<[string, string]>] | [string, string];

// Merges in a user sidebar config and ensures all items are valid.
function mergeSidebarConfig(json: Partial<OutputConfig> | null): SidebarItem[] {
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

export const defaultConfig: OutputConfig = {
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
  googleAnalytics: '',
  zoomImages: false,
  experimentalCodehike: false,
  experimentalMath: false,
  automaticallyInferNextPrevious: true,
  plausibleAnalytics: false,
};

// Merges any user config with default values.
export function mergeConfig(json: Record<string, unknown>): OutputConfig {
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
    googleAnalytics: getString(json, 'googleAnalytics', defaultConfig.googleAnalytics),
    zoomImages: getBoolean(json, 'zoomImages', defaultConfig.zoomImages),
    // TODO: tidy the following:
    locales: (json.locales as Record<string, string>) ?? undefined,
    experimentalCodehike: getBoolean(
      json,
      'experimentalCodehike',
      defaultConfig.experimentalCodehike,
    ),
    experimentalMath: getBoolean(json, 'experimentalMath', defaultConfig.experimentalMath),
    automaticallyInferNextPrevious: getBoolean(
      json,
      'automaticallyInferNextPrevious',
      defaultConfig.automaticallyInferNextPrevious,
    ),
    plausibleAnalytics: getBoolean(json, 'plausibleAnalytics', defaultConfig.plausibleAnalytics),
  };
}

type Configs = {
  configJson?: string;
  configYaml?: string;
  configToml?: string;
};

export function formatConfigLocales(configFiles: Configs, path: string): OutputConfig {
  const { configJson, configYaml, configToml } = configFiles;

  let config: Record<string, unknown> = {};

  try {
    if (configJson) {
      config = JSON.parse(configJson);
    } else if (configYaml) {
      config = yaml.load(configYaml) as Record<string, unknown>;
    } else if (configToml) {
      config = Object.assign({}, toml.parse(configToml));
    }
  } catch (e) {
    console.error('Error parsing config, using default.');
    return defaultConfig;
  }

  if (
    config.hasOwnProperty('locales') &&
    Array.isArray(config.locales) &&
    config.hasOwnProperty('sidebar')
  ) {
    // TODO: edge cases of bad configs, e.g what if locales is not an array?

    const defaulLocale = config.locales[0];

    const currentLocale = path.split('/')[0] || defaulLocale;

    const sidebar = (getValue(config, 'sidebar') as Record<string, unknown>)[currentLocale];

    config = {
      ...config,
      sidebar,
    };

    return mergeConfig(config);
  }
  return mergeConfig(config);
}
