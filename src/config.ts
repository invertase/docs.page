import { createContext } from "react";
import get from "lodash.get";

type Extension = "md" | "mdx";

export type Config = {
  directory: string;
  extension: Extension;
  theme: string;
};

export const defaultConfig: Config = {
  directory: "docs",
  extension: "md",
  theme: "#00bcd4",
};

export function mergeConfig(json: any): Config {
  return {
    directory: get(json, "directory", defaultConfig.directory),
    extension: get(json, "extension", defaultConfig.extension),
    theme: get(json, "theme", defaultConfig.theme),
  };
}

export const ConfigContext = createContext<Config>(defaultConfig);
