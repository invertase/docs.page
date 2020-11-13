import { createContext } from "react";

export const DEFAULT_FILE = "index";
export const BRANCH_SPLITTER = "~";

// Properties corresponding to an incoming slug.
export type SlugProperties = {
  // The project owner, e.g. "invertase"
  owner: string;
  // The repository name, e.g. "melos"
  repository: string;
  // The branch the request is for
  branch: string;
  // The path of the content
  path: string;
  // Base path for this project
  base: string;
};

export function getSlugProperties(slug: string[]): SlugProperties {
  let [owner, repository, ...path] = slug;
  let branch = '';

  // project paths containing a BRANCH_SPLITTER mean a specific branch has been requested
  const chunks = repository.split(BRANCH_SPLITTER);

  // only projects with a single BRANCH_SPLITTER are allowed
  if (chunks.length > 2) {
    throw new Error(
      `Invalid project path provided. The path contains more than one ${BRANCH_SPLITTER} which is not allowed.`
    );
  }

  // if there is a branch, assign it
  if (chunks.length === 2 && chunks[1]) {
    repository = chunks[0];
    branch = chunks[1];
  }
  
  let base = `/${owner}/${repository}`;

  return {
    owner,
    repository,
    branch,
    path: path.length === 0 ? DEFAULT_FILE : path.join("/"),
    base,
  };
}

export const SlugPropertiesContext = createContext<SlugProperties>({
  owner: "",
  repository: "",
  branch: "",
  path: "",
  base: "",
});
