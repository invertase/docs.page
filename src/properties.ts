import { createContext } from "react";

export const DEFAULT_BRANCH = "master";
export const DEFAULT_FILE = "index";

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

export const SlugPropertiesContext = createContext<SlugProperties>({
  owner: "",
  repository: "",
  branch: "",
  path: "",
});
