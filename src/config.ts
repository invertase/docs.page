import { createContext } from "react";
import get from "lodash.get";

// Markdown file extension types.
type Extension = "md" | "mdx";

// A single item.
//
// A single string indicates a header. A tuple represents an item.
type SidebarItem = string | [string, string];

/**
 * Project config.
 *
 * This can be provided by creating a `docs.json` file at the root of your
 * repository.
 */
export type Config = {
  // The directory to look for documentation. Defaults to "docs".
  directory: string;
  // The markdown file extension names. Defaults to "md".
  extension: Extension;
  // A color theme used for this project. Defaults to "#00bcd4".
  theme: string;
  // Docsearch Application ID. If populated, a search box with autocomplete will be rendered.
  docsearch: string;
  // Sidebar
  sidebar: SidebarItem[];
};

export const defaultConfig: Config = {
  directory: "docs",
  extension: "md",
  theme: "#00bcd4",
  docsearch: "",
  sidebar: [],
};

// Merges any user config with default values.
export function mergeConfig(json: any): Config {
  return {
    directory: get(json, "directory", defaultConfig.directory),
    extension: get(json, "extension", defaultConfig.extension),
    theme: get(json, "theme", defaultConfig.theme),
    docsearch: get(json, "docsearch", defaultConfig.docsearch),
    sidebar: mergeSidebarConfig(json),
  };
}

function mergeSidebarConfig(json: any): SidebarItem[] {
  return get(json, "sidebar", defaultConfig.sidebar)
    .map((item: SidebarItem) => {
      if (typeof item === "string") return item;
      if (!Array.isArray(item)) return null;
      const [title, url] = item;
      if (typeof title !== "string") return null;
      if (typeof url !== "string") return null;
      return [title, url];
    })
    .filter(Boolean);
}

export const ConfigContext = createContext<Config>(defaultConfig);
