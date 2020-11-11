import axios from "axios";
import { Config } from "./config";

export const DEFAULT_BRANCH = "master";
export const DEFAULT_FILE = "index";

export async function safeGet<T>(url: string): Promise<T | null> {
  return axios
    .get<T>(url)
    .then(($) => $.data)
    .catch(() => null);
}

export type SlugProperties = {
  owner: string;
  repository: string;
  branch: string;
  path: string;
};

export function getSlugProperties(slug: string[]): SlugProperties {
  let [owner, repository, ...path] = slug;
  let branch = DEFAULT_BRANCH;

  // project paths containing a # mean a specific branch has been requested
  const chunks = repository.split("#");

  // only projects with a single # are allowed
  if (chunks.length > 2) {
    throw new Error("Invalid project path provided.");
  }

  // if there is a branch, assign it
  if (chunks.length === 2) {
    repository = chunks[0];
    branch = chunks[1] || DEFAULT_BRANCH;
  }

  return {
    owner,
    repository,
    branch: "master",
    path: path.length === 0 ? DEFAULT_FILE : path.join("/"),
  };
}

export function getConfigUrl(properties: SlugProperties): string {
  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.branch}/config.json`;
}

export function getFileUrl(config: Config, properties: SlugProperties): string {
  return `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.branch}/${config.directory}/${properties.path}.${config.extension}`;
}
