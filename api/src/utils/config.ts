import { z } from 'zod';
import yaml from 'js-yaml';
import toml from '@ltd/j-toml';
import test from './test_config.js';

const $SidebarItem = z.tuple([
  z.coerce.string(),
  z
    .union([
      // URL
      z.string(),
      // Nested children
      z
        .array(z.tuple([z.coerce.string(), z.coerce.string()]).optional().catch(undefined))
        // Remove any undefined items from the array.
        .transform(items => {
          return items.filter(Boolean);
        }),
    ])
    // Fallback to empty array if something is wrong, so the entire sidebar doesn't break
    .catch([]),
]);

const $Config = z
  .object({
    name: z.string().catch(''),
    description: z.string().catch(''),
    logo: z.string().catch(''),
    logoDark: z.string().catch(''),
    favicon: z.string().catch(''),
    socialPreview: z.string().catch(''),
    twitter: z.string().catch(''),
    noindex: z.boolean().catch(false),
    theme: z.string().catch(''),
    headerDepth: z.number().catch(3),
    variables: z.record(z.any()).catch({}),
    googleTagManager: z.string().catch(''),
    googleAnalytics: z.string().catch(''),
    zoomImages: z.boolean().catch(false),
    experimentalCodehike: z.boolean().catch(false),
    experimentalMath: z.boolean().catch(false),
    automaticallyDisplayName: z.boolean().catch(true),
    automaticallyInferNextPrevious: z.boolean().catch(true),
    plausibleAnalytics: z.boolean().catch(false),
    anchors: z
      .array(
        z
          .object({
            icon: z.string(),
            title: z.string(),
            link: z.string(),
          })
          .optional()
          .catch(undefined),
      )
      .transform(items => items.filter(Boolean))
      .catch([]),
    docsearch: z
      .object({
        appId: z.string().catch(''),
        apiKey: z.string().catch(''),
        indexName: z.string().catch(''),
      })
      .optional()
      .catch(undefined),
    sidebar: z.union([z.record(z.array($SidebarItem)), z.array($SidebarItem)]).catch([]),
  })
  .transform(config => {
    return {
      ...config,
      locales: Array.isArray(config.sidebar)
        ? []
        : Object.keys(config.sidebar).filter(key => key !== 'default'),
    };
  });

export type Config = z.infer<typeof $Config>;

// The detfault config is used to fill in missing values.
export const defaultConfig = $Config.parse({});

// Given a user config, merges the config with the default config.
export default function parseConfig(configs: {
  json?: string;
  yaml?: string;
  toml?: string;
}): Config {
  let parsedConfig: unknown;

  if (configs.json) {
    parsedConfig = JSON.parse(configs.json);
  } else if (configs.yaml) {
    parsedConfig = yaml.load(configs.yaml);
  } else if (configs.toml) {
    parsedConfig = Object.assign({}, toml.parse(configs.toml));
  }

  return $Config.parse(JSON.parse(test));
  return $Config.parse(parsedConfig);
}
