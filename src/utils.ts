import axios from "axios";
import { Config } from "./config";
import { SlugProperties } from "./properties";

export async function safeGet<T>(url: string): Promise<T | null> {
  return axios
    .get<T>(url, {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
    .then(($) => $.data)
    .catch(() => null);
}

export function getConfigUrl(properties: SlugProperties): string {
  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.branch}/config.json`;
}

export function getFileUrl(config: Config, properties: SlugProperties): string {
  return `https://raw.githubusercontent.com/${properties.owner}/${
    properties.repository
  }/${properties.branch}/${config.directory}/${properties.path}.${
    config.extension
  }?flush_cache=${Math.random().toString()}`;
}

export function isClient(): boolean {
  return typeof window !== "undefined";
}
