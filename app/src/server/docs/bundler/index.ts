import {
  type DocIrNode,
  type HeadingNode,
  renderDoc,
} from "@docs.page/mdx-bundler";
import { assertPublicRepo } from "@/lib/docs-access";
import { type Config, defaultConfig, parseConfig } from "@/server/config";
import {
  type GitHubSource,
  getGitHubContents,
  resolveGitHubSource,
} from "@/server/github/contents";
import { BundlerError } from "./error";

export const ERROR_CODES = {
  CONFIG_NOT_FOUND: "CONFIG_NOT_FOUND",
  REPO_NOT_FOUND: "REPO_NOT_FOUND",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  BUNDLE_ERROR: "BUNDLE_ERROR",
  PRIVATE_REPO_BLOCKED: "PRIVATE_REPO_BLOCKED",
  INVALID_DOC_PATH: "INVALID_DOC_PATH",
} as const;

export type ErrorCodes = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

type Source = GitHubSource;

export type BundlerOutput = {
  source: Source;
  ref: string;
  stars: number;
  forks: number;
  private: boolean;
  baseBranch: string;
  path: string;
  config: Config;
  markdown: string;
  docIr: DocIrNode;
  headings: HeadingNode[];
  frontmatter: Record<string, unknown>;
};

type CreateBundlerParams = {
  owner: string;
  repository: string;
  path: string;
  ref?: string;
  components?: Array<string>;
};

export class Bundler {
  readonly #owner: string;
  readonly #repository: string;
  readonly #path: string;
  readonly #components: Array<string>;
  #ref: string | undefined;
  #source?: Source;
  #config?: Config;
  #markdown?: string;

  constructor(params: CreateBundlerParams) {
    this.#owner = params.owner;
    this.#repository = params.repository;
    this.#path = params.path;
    this.#ref = params.ref;
    this.#components = params.components || [];
  }

  private async getSource(): Promise<Source> {
    return resolveGitHubSource({
      owner: this.#owner,
      repository: this.#repository,
      ref: this.#ref,
    });
  }

  async build(): Promise<BundlerOutput> {
    this.#source = await this.getSource();
    this.#ref = this.#source.ref;

    const metadata = await getGitHubContents({
      owner: this.#source.owner,
      repository: this.#source.repository,
      path: this.#path,
      ref: this.#ref,
    });

    if (!metadata) {
      throw new BundlerError({
        code: 404,
        name: ERROR_CODES.REPO_NOT_FOUND,
        message: `The repository ${this.#source.owner}/${this.#source.repository} was not found.`,
      });
    }

    assertPublicRepo(metadata, this.#source.owner, this.#source.repository);

    if (!metadata.config.configJson && !metadata.config.configYaml) {
      throw new BundlerError({
        code: 404,
        name: ERROR_CODES.CONFIG_NOT_FOUND,
        message:
          "No configuration file was found in the repository. To get started, create a <code>docs.json</code> file at the root of your repository.",
        source: `https://github.com/${this.#source.owner}/${this.#source.repository}`,
      });
    }

    if (!metadata.md) {
      throw new BundlerError({
        code: 404,
        name: ERROR_CODES.FILE_NOT_FOUND,
        message: `No file was found in the repository matching this path. Ensure a file exists at <code>/docs/${this.#path}.mdx<code> or <code>/docs/${this.#path}/index.mdx<code>.`,
        source: `https://github.com/${this.#source.owner}/${this.#source.repository}`,
      });
    }

    this.#markdown = metadata.md;

    if (!this.#ref) {
      this.#ref = metadata.baseBranch;
      this.#source.ref = metadata.baseBranch;
    }

    try {
      this.#config = parseConfig({
        json: metadata.config.configJson,
        yaml: metadata.config.configYaml,
      });
    } catch {
      this.#config = defaultConfig;
    }

    try {
      const { markdown, docIr, headings, frontmatter } = await renderDoc(
        this.#markdown,
        {
          variables: this.#config.variables ?? {},
          headerDepth: this.#config.content?.headerDepth ?? 3,
        },
      );

      return {
        source: this.#source,
        ref: this.#ref,
        stars: metadata.stars,
        forks: metadata.forks,
        private: metadata.isPrivate,
        baseBranch: metadata.baseBranch,
        path: this.#path,
        config: this.#config,
        markdown,
        docIr,
        headings,
        frontmatter,
      };
    } catch (error) {
      console.error(error);

      throw new BundlerError({
        code: 500,
        name: ERROR_CODES.BUNDLE_ERROR,
        message: `Something went wrong while preparing the file /${metadata.path}.mdx. Are you sure the markdown is valid?`,
        source: `https://github.com/${this.#source.owner}/${this.#source.repository}`,
      });
    }
  }
}
