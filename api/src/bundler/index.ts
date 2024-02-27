import parseConfig, { Config, defaultConfig } from '../utils/config';
import { getGitHubContents, getPullRequestMetadata } from '../utils/github';
import { bundle } from './mdx';

export class BundlerError extends Error {
  constructor(public code: number, name: string, message: string, cause?: string) {
    super(message);
    this.name = name;
    this.message = message;
    this.cause = cause;
  }
}

export const ERROR_CODES = {
  REPO_NOT_FOUND: 'REPO_NOT_FOUND',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  BUNDLE_ERROR: 'BUNDLE_ERROR',
} as const;

type Source = {
  type: 'PR' | 'commit' | 'branch';
  owner: string;
  repository: string;
  ref?: string;
};

class Bundler {
  readonly #owner: string;
  readonly #repository: string;
  readonly #path: string;
  #notices: Array<string> = [];
  #ref: string | undefined;
  #source?: Source;
  #config?: Config;
  #markdown?: string;

  constructor(params: CreateBundlerParams) {
    this.#owner = params.owner;
    this.#repository = params.repository;
    this.#path = params.path;
    this.#ref = params.ref;
  }

  /**
   * Gets the source of the bundle.
   *
   * If the ref is a PR, it will fetch the PR metadata and update the source.
   */
  private async getSource(): Promise<Source> {
    if (this.#ref) {
      // If the ref is a PR
      if (/^[0-9]*$/.test(this.#ref)) {
        const pullRequest = await getPullRequestMetadata(this.#owner, this.#repository, this.#ref);
        if (pullRequest) {
          return {
            type: 'PR',
            ...pullRequest,
          };
        }
      }

      // If the ref is a commit hash
      if (/^[a-fA-F0-9]{40}$/.test(this.#ref)) {
        return {
          type: 'commit',
          owner: this.#owner,
          repository: this.#repository,
          ref: this.#ref,
        };
      }
    }

    return {
      type: 'branch',
      owner: this.#owner,
      repository: this.#repository,
      ref: this.#ref,
    };
  }

  /**
   * Builds the payload with the MDX bundle.
   */
  build = async () => {
    // Get the real source of the request
    this.#source = await this.getSource();

    // Update the ref to the real ref
    this.#ref = this.#source.ref;

    const metadata = await getGitHubContents({
      owner: this.#source.owner,
      repository: this.#source.repository,
      path: this.#path,
      ref: this.#ref,
    });

    if (!metadata) {
      throw new BundlerError(
        404,
        ERROR_CODES.REPO_NOT_FOUND,
        `The repository ${this.#source.owner}/${this.#source.repository} was not found.`,
      );
    }

    if (!metadata.md) {
      throw new BundlerError(
        404,
        ERROR_CODES.FILE_NOT_FOUND,
        `The file "/docs/${this.#path}.mdx" or "/docs/${this.#path}/index.mdx" in repository ${
          this.#source.owner
        }/${this.#source.repository} was not found.`,
      );
    }

    this.#markdown = metadata.md;

    // If there is no ref (either not provided, or not a PR), use the metadata.
    if (!this.#ref) {
      this.#ref = metadata.baseBranch;
      this.#source.ref = metadata.baseBranch;
    }

    // Parse the users config, but fallback if it errors.
    try {
      this.#config = parseConfig({
        json: metadata.config.configJson,
        yaml: metadata.config.configYaml,
      });
    } catch {
      this.#notices.push(
        'The configuration file is invalid, falling back to the default configuration.',
      );
      this.#config = defaultConfig;
    }

    try {
      // Bundle the markdown file via MDX.
      const mdx = await bundle(this.#markdown, {
        headerDepth: this.#config.headerDepth,
      });

      return {
        source: this.#source,
        ref: this.#ref,
        baseBranch: metadata.baseBranch,
        notices: this.#notices,
        path: this.#path,
        config: this.#config,
        markdown: this.#markdown,
        headings: mdx.headings,
        frontmatter: mdx.frontmatter,
        code: mdx.code,
      };
    } catch (e) {
      console.error(e);
      throw new BundlerError(
        500,
        ERROR_CODES.BUNDLE_ERROR,
        `Something went wrong while bundling the file <a href="https://github.com/${
          this.#source.owner
        }/${this.#source.repository}/blob/${this.#ref}/${
          metadata.path
        }.mdx" rel="noopener noreferrer nofollow" target="_blank" class="text-green-400 hover:text-green-500"> /${
          metadata.path
        }.mdx</a>. Are you sure the MDX is valid?`,
        `${
          // @ts-ignore
          e?.message || ''
        }`,
      );
    }
  };
}

type CreateBundlerParams = {
  owner: string;
  repository: string;
  path: string;
  ref?: string;
};

export default function bundler(params: CreateBundlerParams) {
  return new Bundler(params).build();
}
