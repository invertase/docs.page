import { createContext } from 'react';
import { getPullRequestMetadata, PullRequestMetadata } from './github';
import { hash } from './index';

export const DEFAULT_FILE = 'index';
export const SPLITTER = '~';

type Source = {
  owner: string;
  repository: string;
  ref: string;
};

export enum Pointer {
  base,
  branch,
  pullRequest,
  commit,
}
export class Properties {
  owner: string;
  repository: string;
  source: Source;
  path: string;
  base: string;
  baseBranch?: string;
  ref?: string;
  pointer: Pointer;

  private constructor(params: string[]) {
    const [owner, repositoryWithRef, ...path] = params;

    // project paths containing a SPLITTER mean a specific ref has been requested
    const [repository, ref] = repositoryWithRef.split(SPLITTER);

    let base = `/${owner}/${repository}`;

    if (ref) {
      base += encodeURIComponent(`${SPLITTER}${ref}`);
    }

    this.owner = owner;
    this.repository = repository;
    this.ref = ref;
    this.path = path.length === 0 ? DEFAULT_FILE : path.join('/');
    this.base = base;
  }

  public static async build(params: string[]): Promise<Properties> {
    const properties = new Properties(params);

    if (/^[0-9]*$/.test(properties.ref)) {
      // Fetch the PR metadata
      const metadata = await getPullRequestMetadata(
        properties.owner,
        properties.repository,
        properties.ref,
      );

      // TODO what happens if no PR is found?
      if (metadata) {
        properties.pointer = Pointer.pullRequest;
        properties.source = {
          owner: metadata.owner,
          repository: metadata.repository,
          ref: metadata.ref,
        };
      }
    } else {
      if (/^[a-fA-F0-9]{40}$/.test(properties.ref)) {
        properties.pointer = Pointer.commit;
      } else if (properties.ref) {
        properties.pointer = Pointer.branch;
      } else {
        properties.pointer = Pointer.base;
      }
      // The source is the current repository
      properties.source = {
        owner: properties.owner,
        repository: properties.repository,
        ref: properties.ref || 'HEAD',
      };
    }

    return properties;
  }

  toObject(): SlugProperties {
    return {
      owner: this.owner,
      repository: this.repository,
      source: this.source,
      githubUrl: `https://github.com/${this.owner}/${this.repository}`,
      debugUrl: `/_debug${this.base}/${this.path}`,
      editUrl: `https://github.com/${this.owner}/${this.repository}/edit/${
        this.ref || this.baseBranch
      }/docs/${this.path}.mdx`,
      createUrl: `https://github.com/${this.owner}/${this.repository}/new/${
        this.ref || this.baseBranch
      }/docs/${this.path}`,
      ref: this.ref || null,
      pointer: this.pointer,
      base: this.base,
      path: this.path,
      hash: hash(`${this.owner}/${this.repository}`),
    };
  }
}

// Properties corresponding to an incoming slug.
export type SlugProperties = {
  // The project owner, e.g. "invertase"
  owner: string;
  // The repository name, e.g. "melos"
  repository: string;
  // The source of the contents.
  source: Source;
  // The URL to the GitHub repo
  githubUrl: string;
  // The URL to debug the page
  debugUrl: string;
  // The URL to edit the current page on GitHub
  editUrl: string;
  // The URL to create a new page on GitHub
  createUrl: string;
  // The branch/PR the request is for
  ref: string | null;
  // The request pointer of the properties
  pointer: Pointer;
  // The path of the content
  path: string;
  // Base path for this project
  base: string;
  // Unique hash of the owner/repository
  hash: string;
};

export const SlugPropertiesContext = createContext<SlugProperties>({
  owner: '',
  repository: '',
  source: {} as Source,
  githubUrl: '',
  debugUrl: '',
  editUrl: '',
  createUrl: '',
  ref: '',
  pointer: Pointer.base,
  path: '',
  base: '',
  hash: '',
});
