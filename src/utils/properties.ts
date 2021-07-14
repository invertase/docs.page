import { createContext } from 'react';
import { getPullRequestMetadata } from './github';
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
  ref?: string;
  pointer: Pointer;

  private constructor(params: string[]) {
    const [owner, repositoryWithRef, maybeRef, ...path] = params;
    let finalPath = path;
    let repository: string;
    let ref: string;

    // docs.page/invertase/melos~docs-updates/foo
    if (repositoryWithRef.includes(SPLITTER)) {
      [repository, ref] = repositoryWithRef.split(SPLITTER);

      if (maybeRef) {
        finalPath = [maybeRef, ...path];
      }
    } else {
      repository = repositoryWithRef;
    }

    // docs.page/invertase/melos/~docs-updates/foo
    if (maybeRef?.startsWith(SPLITTER)) {
      repository = repositoryWithRef;
      [, ref] = maybeRef.split(SPLITTER);
    }
    // docs.page/invertase/melos/foo
    else if (maybeRef) {
      finalPath = [maybeRef, ...path];
    }

    let base = `/${owner}/${repository}`;

    if (ref) {
      base += encodeURIComponent(`${SPLITTER}${ref}`);
    }

    this.owner = owner;
    this.repository = repository;
    this.ref = ref;
    this.path = finalPath.length === 0 ? DEFAULT_FILE : finalPath.join('/');
    this.base = base;
  }

  public static async build(params: string[]): Promise<Properties> {
    const properties = new Properties(params);

    let source: Source;

    // If the ref looks like a PR
    if (/^[0-9]*$/.test(properties.ref)) {
      // Fetch the PR metadata
      const metadata = await getPullRequestMetadata(
        properties.owner,
        properties.repository,
        properties.ref,
      );

      // If the PR was found, update the pointer and source
      if (metadata) {
        properties.pointer = Pointer.pullRequest;
        source = {
          owner: metadata.owner,
          repository: metadata.repository,
          ref: metadata.ref,
        };
      }
    }

    // If no source was found (also if no matching PR was found)
    if (!source) {
      // Is the ref a commit sha?
      if (/^[a-fA-F0-9]{40}$/.test(properties.ref)) {
        properties.pointer = Pointer.commit;
      } else if (properties.ref) {
        properties.pointer = Pointer.branch;
      } else {
        properties.pointer = Pointer.base;
      }
      // The source is the current repository
      source = {
        owner: properties.owner,
        repository: properties.repository,
        ref: properties.ref || 'HEAD',
      };
    }

    properties.source = source;

    return properties;
  }

  toObject(): SlugProperties {
    return {
      owner: this.owner,
      repository: this.repository,
      source: this.source,
      githubUrl: `https://github.com/${this.owner}/${this.repository}`,
      debugUrl: `/_debug${this.base}/${this.path}`,
      editUrl: `https://github.com/${this.source.owner}/${this.source.repository}/edit/${this.ref}/docs/${this.path}.mdx`,
      createUrl: `https://github.com/${this.source.owner}/${this.source.repository}/new/${this.ref}/docs/${this.path}`,
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
