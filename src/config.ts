import { createContext } from "react";
import get from "lodash.get";
import { DEFAULT_LAYOUT, LayoutType } from "./components/Layout";

// Markdown file extension types.
type Extension = "md" | "mdx";

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
  // The directory to look for documentation. Defaults to "docs".
  directory: string;
  // The markdown file extension names. Defaults to "md".
  extension: Extension;
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
};

export const defaultConfig: Config = {
  name: "Melos",
  logo: "https://firebase.flutter.dev/img/flutterfire_300x.png",
  directory: "docs",
  extension: "md",
  theme: "#00bcd4",
  navigation: [
    ["Docs", "/docs"],
    ["Twitter", "https://twitter.com/flutterfiredev"],
  ],
  sidebar: [
    [
      "Getting Started",
      [
        ["Overview", "/"],
        ["Getting Started", "/getting-started"],
        ["Commands", "/commands"],
        ["Migration Guide", "/migration-guide"],
        [
          "Learn More",
          [
            ["Offical Docs", "https://google.com"],
            ["Issues", "https://google.com"],
          ],
        ],
      ],
    ],
  ],
  defaultLayout: DEFAULT_LAYOUT,
};

// Merges any user config with default values.
export function mergeConfig(json: any): Config {
  return {
    name: get(json, "name", defaultConfig.name),
    logo: get(json, "logo", defaultConfig.logo),
    directory: get(json, "directory", defaultConfig.directory),
    extension: get(json, "extension", defaultConfig.extension),
    theme: get(json, "theme", defaultConfig.theme),
    docsearch: get(json, "docsearch", defaultConfig.docsearch),
    navigation: mergeNavigationConfig(json),
    sidebar: mergeSidebarConfig(json),
    defaultLayout: get(json, "defaultLayout", defaultConfig.defaultLayout),
  };
}

function mergeSidebarConfig(json: any): SidebarItem[] {
  return defaultConfig.sidebar; // TOOD
  // return get(json, "sidebar", defaultConfig.sidebar)
  //   .map((item: SidebarItem) => {
  //     if (!Array.isArray(item)) return null;
  //     const [title, url] = item;
  //     if (typeof title !== "string") return null;
  //     if (typeof url !== "string") return null;
  //     return [title, url];
  //   })
  //   .filter(Boolean);
}

function mergeNavigationConfig(json: any): NavigationItem[] {
  return get(json, "navigation", defaultConfig.navigation)
    .map((item: NavigationItem) => {
      if (!Array.isArray(item)) return null;
      const [title, url] = item;
      if (typeof title !== "string") return null;
      if (typeof url !== "string") return null;
      return [title, url];
    })
    .filter(Boolean);
}

export const ConfigContext = createContext<Config>(defaultConfig);
