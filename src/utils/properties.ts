import { createContext } from 'react';
import { PullRequestMetadata } from './github';
import { hash } from './index';

export const DEFAULT_FILE = 'index';
export const SPLITTER = '~';

type Reference = {
  name: string;
  type: ReferenceType;
  source?: string;
};

export enum ReferenceType {
  base,
  branch,
  pullRequest,
  commit,
}
export class Properties {
  owner: string;
  repository: string;
  path: string;
  base: string;
  ref: Reference;

  public constructor(params: string[]) {
    let [, repository, , ...path] = params;
    const [owner] = params;
    const [, , maybeRef] = params;
    let ref: string = null;

    // project paths containing a SPLITTER mean a specific branch has been requested
    const chunks = repository.split(SPLITTER);

    // only projects with a single SPLITTER are allowed
    if (chunks.length > 2) {
      throw new Error(
        `Invalid project path provided. The path contains more than one ${SPLITTER} which is not allowed.`,
      );
    }

    /**
     * When no domain is provided the "ref" is part of the repository, e.g.
     * ['invertase', 'melos~ref', ...] - in this case we need to extract the ref from the repository.
     */
    if (chunks.length === 2 && chunks[1]) {
      repository = chunks[0];
      ref = chunks[1];
    }

    /**
     * In the case of pages with custom domains, the "ref" is a separated param, e.g.
     * ['invertase', 'melos', '~ref', ...] - in this case we need to extract the ref from the chunk.
     */
    if (!ref && maybeRef?.startsWith(SPLITTER)) {
      ref = maybeRef.substring(1);
    } else if (maybeRef) {
      path = [maybeRef, ...path];
    }

    let base = `/${owner}/${repository}`;

    if (ref) {
      base += encodeURI(`${SPLITTER}${ref}`);
    }

    this.owner = owner;
    this.repository = repository;
    this.path = path.length === 0 ? DEFAULT_FILE : path.join('/');
    this.base = base;
    this.ref = {
      name: ref ?? 'HEAD',
      type: ref ? ReferenceType.branch : ReferenceType.base,
    };
  }

  public setPullRequestMetadata(metadata: PullRequestMetadata, source: string): void {
    this.owner = metadata.owner;
    this.repository = metadata.repository;
    this.ref = {
      name: metadata.ref,
      type: ReferenceType.pullRequest,
      source,
    };
  }

  public setBaseRef(baseRef: string): void {
    this.base = `/${this.owner}/${this.repository}`;
    this.ref = {
      name: baseRef,
      type: ReferenceType.base,
    };
  }

  public setCommitHash(): void {
    this.ref.type = ReferenceType.commit;
  }

  public isPullRequest(): boolean {
    return /^[0-9]*$/.test(this.ref.name);
  }

  public isCommitHash(): boolean {
    return /^[a-fA-F0-9]{40}$/.test(this.ref.name);
  }

  toObject(): SlugProperties {
    return {
      owner: this.owner,
      repository: this.repository,
      githubUrl: `https://github.com/${this.owner}/${this.repository}`,
      debugUrl: `/_debug${this.base}/${this.path}`,
      editUrl: `https://github.com/${this.owner}/${this.repository}/edit/${this.ref.name}/docs/${this.path}.mdx`,
      createUrl: `https://github.com/${this.owner}/${this.repository}/new/${this.ref.name}/docs/${this.path}`,
      ref: this.ref,
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
  // The URL of the repository on GitHub
  githubUrl: string;
  // The URL to debug the page
  debugUrl: string;
  // The URL to edit the current page on GitHub
  editUrl: string;
  // The URL to create a new page on GitHub
  createUrl: string;
  // The branch/PR the request is for
  ref: Reference;
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
  githubUrl: '',
  debugUrl: '',
  editUrl: '',
  createUrl: '',
  ref: {} as Reference,
  path: '',
  base: '',
  hash: '',
});
