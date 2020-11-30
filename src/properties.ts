import { createContext } from "react";
import { hash } from "./utils";

export const DEFAULT_FILE = "index";
export const SPLITTER = "~";

// Properties corresponding to an incoming slug.
export type SlugProperties = {
  // The project owner, e.g. "invertase"
  owner: string;
  // The repository name, e.g. "melos"
  repository: string;
  // The branch the request is for
  ref: string;
  // A value representing whether the current slug is pointing at the default repository branch.
  isDefaultBranch: boolean;
  // The path of the content
  path: string;
  // Base path for this project
  base: string;
  // Unique hash of the owner/repository
  hash: string;
};

export function getSlugProperties(slug: string[]): SlugProperties {
  let [owner, repository, ...path] = slug;
  let ref = "";

  // project paths containing a SPLITTER mean a specific branch has been requested
  const chunks = repository.split(SPLITTER);

  // only projects with a single SPLITTER are allowed
  if (chunks.length > 2) {
    throw new Error(
      `Invalid project path provided. The path contains more than one ${SPLITTER} which is not allowed.`
    );
  }

  // if there is a branch or PR, assign it
  if (chunks.length === 2 && chunks[1]) {
    repository = chunks[0];
    ref = chunks[1];
  }

  let base = `/${owner}/${repository}`;

  if (ref) {
    base += encodeURI(`${SPLITTER}${ref}`);
  }

  return {
    owner,
    repository,
    isDefaultBranch: false,
    ref,
    path: path.length === 0 ? DEFAULT_FILE : path.join("/"),
    base,
    hash: hash(`${owner}/${repository}`),
  };
}

export const SlugPropertiesContext = createContext<SlugProperties>({
  owner: "",
  repository: "",
  isDefaultBranch: false,
  ref: "",
  path: "",
  base: "",
  hash: "",
});
