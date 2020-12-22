import { createContext } from 'react';
import { PullRequestMetadata } from './github';
import { hash } from './index';

export const DEFAULT_FILE = 'index';
export const SPLITTER = '~';

type RefType = null | 'branch' | 'pull-request';

export class Properties {
  owner: string;
  repository: string;
  ref: string;
  path: string;
  base: string;
  isBaseBranch: boolean;

  public constructor(params: string[]) {
    let [owner, repository, ...path] = params;
    let ref = null;

    // project paths containing a SPLITTER mean a specific branch has been requested
    const chunks = repository.split(SPLITTER);

    // only projects with a single SPLITTER are allowed
    if (chunks.length > 2) {
      throw new Error(
        `Invalid project path provided. The path contains more than one ${SPLITTER} which is not allowed.`,
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

    this.owner = owner;
    this.repository = repository;
    this.ref = ref;
    this.path = path.length === 0 ? DEFAULT_FILE : path.join('/');
    this.base = base;
    this.isBaseBranch = !ref;
  }

  public setPullRequestMetadata(metadata: PullRequestMetadata) {
    this.owner = metadata.owner;
    this.repository = metadata.repository;
    this.ref = metadata.ref;
  }

  public setBaseRef(baseRef: string) {
    this.ref = baseRef;
    this.base = `/${this.owner}/${this.repository}`;
    this.isBaseBranch = true;
  }

  public isPullRequest() {
    return /^[0-9]*$/.test(this.ref);
  }

  toObject(): SlugProperties {
    return {
      isBaseBranch: this.isBaseBranch,
      owner: this.owner,
      repository: this.repository,
      githubUrl: `https://github.com/${this.owner}/${this.repository}`,
      debugUrl: `/_debug/${this.base}${this.path}`,
      editUrl: `https://github.com/${this.owner}/${this.repository}/edit/${this.ref}/docs/${this.path}.md`,
      ref: this.ref,
      refType: this.isPullRequest() ? 'pull-request' : 'branch',
      base: this.base,
      path: this.path,
      hash: hash(`${this.owner}/${this.repository}`),
    };
  }
}

// Properties corresponding to an incoming slug.
export type SlugProperties = {
  isBaseBranch: boolean;
  // The project owner, e.g. "invertase"
  owner: string;
  // The repository name, e.g. "melos"
  repository: string;
  // The URL of the repository on GitHub
  githubUrl: string;
  // The URL to debug the page
  debugUrl: string;
  // The URL to edit the current page on GitHub
  editUrl: string;
  // The branch/PR the request is for
  ref: string;
  // The type of reference
  refType: RefType;
  // The path of the content
  path: string;
  // Base path for this project
  base: string;
  // Unique hash of the owner/repository
  hash: string;
};

export const SlugPropertiesContext = createContext<SlugProperties>({
  isBaseBranch: true,
  owner: '',
  repository: '',
  githubUrl: '',
  debugUrl: '',
  editUrl: '',
  ref: '',
  refType: null,
  path: '',
  base: '',
  hash: '',
});
