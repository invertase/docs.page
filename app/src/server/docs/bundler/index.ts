import {
  type DocIrNode,
  type HeadingNode,
  renderDoc,
} from "@docs.page/mdx-bundler";
import { assertPublicRepo } from "@/lib/docs-access";
import { getAssetSrc } from "@/lib/docs-assets";
import { type Config, defaultConfig, parseConfig } from "@/server/config";
import {
  hasNegativeDocsConfigCache,
  putNegativeDocsConfigCache,
} from "@/server/github/cache";
import {
  type GitHubSource,
  getGitHubContents,
  resolveGitHubSource,
} from "@/server/github/contents";
import { isUnresolvedNumericRef } from "@/server/github/ref-validation";
import { BundlerError, type DocsBranding } from "./error";

export const ERROR_CODES = {
  CONFIG_NOT_FOUND: "CONFIG_NOT_FOUND",
  REPO_NOT_FOUND: "REPO_NOT_FOUND",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  BUNDLE_ERROR: "BUNDLE_ERROR",
  PRIVATE_REPO_BLOCKED: "PRIVATE_REPO_BLOCKED",
  INVALID_DOC_PATH: "INVALID_DOC_PATH",
} as const;

export type { DocsBranding } from "./error";

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
  readonly #requestedRef: string | undefined;
  #ref: string | undefined;
  #source?: Source;
  #config?: Config;
  #markdown?: string;

  constructor(params: CreateBundlerParams) {
    this.#owner = params.owner;
    this.#repository = params.repository;
    this.#path = params.path;
    this.#requestedRef = params.ref;
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

  private getErrorDetails(source?: Source) {
    const requested = {
      owner: this.#owner,
      repository: this.#repository,
      ref: this.#requestedRef ?? null,
      path: this.#path,
    };

    if (!source) {
      return requested;
    }

    const sourceDiffers =
      source.owner !== this.#owner ||
      source.repository !== this.#repository ||
      (source.ref ?? null) !== (this.#requestedRef ?? null);
    const includeSource = source.type !== "branch" || sourceDiffers;

    return {
      ...requested,
      ...(includeSource
        ? {
            sourceType: source.type,
            sourceOwner: source.owner,
            sourceRepository: source.repository,
            sourceRef: source.ref ?? null,
          }
        : {}),
    };
  }

  private createConfigNotFoundError(
    source: Source,
    reason: "negative-config-cache" | "missing-docs-config",
  ): BundlerError {
    return new BundlerError({
      code: 404,
      name: ERROR_CODES.CONFIG_NOT_FOUND,
      message:
        "No configuration file was found in the repository. To get started, create a <code>docs.json</code> file at the root of your repository.",
      source: `https://github.com/${source.owner}/${source.repository}`,
      details: {
        ...this.getErrorDetails(source),
        reason,
        expectedConfigPaths: "docs.json, docs.yaml",
      },
    });
  }

  private createRefNotFoundError(source: Source): BundlerError {
    return new BundlerError({
      code: 404,
      name: ERROR_CODES.REPO_NOT_FOUND,
      message: `No matching branch, tag, pull request, or commit was found for ref ${source.ref}.`,
      source: `https://github.com/${source.owner}/${source.repository}`,
      details: {
        ...this.getErrorDetails(source),
        reason: "ref-not-found",
      },
    });
  }

  private parseConfigSafe(metadata: {
    config: {
      configJson?: string;
      configYaml?: string;
    };
  }): Config | undefined {
    try {
      return parseConfig({
        json: metadata.config.configJson,
        yaml: metadata.config.configYaml,
      });
    } catch {
      return undefined;
    }
  }

  private resolveBranding(
    config: Config | undefined,
    baseBranch: string,
    source: Source,
  ): DocsBranding | undefined {
    if (!config) {
      return undefined;
    }

    const assetContext = {
      source,
      baseBranch,
    };
    const light = config.logo?.light
      ? getAssetSrc(assetContext, config.logo.light)
      : undefined;
    const dark = config.logo?.dark
      ? getAssetSrc(assetContext, config.logo.dark)
      : undefined;

    if (!config.name && !light && !dark) {
      return undefined;
    }

    return {
      ...(config.name ? { name: config.name } : {}),
      ...(light || dark ? { logo: { light, dark } } : {}),
    };
  }

  async build(): Promise<BundlerOutput> {
    this.#source = await this.getSource();
    this.#ref = this.#source.ref;

    if (
      this.#ref &&
      isUnresolvedNumericRef(this.#ref, {
        type: this.#source.type,
      })
    ) {
      throw this.createRefNotFoundError(this.#source);
    }

    if (
      await hasNegativeDocsConfigCache(
        this.#source.owner,
        this.#source.repository,
        this.#ref,
      ).catch(() => false)
    ) {
      throw this.createConfigNotFoundError(
        this.#source,
        "negative-config-cache",
      );
    }

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
        details: {
          ...this.getErrorDetails(this.#source),
          reason: "repository-not-found-or-inaccessible",
        },
      });
    }

    assertPublicRepo(metadata, this.#source.owner, this.#source.repository);

    if (!metadata.config.configJson && !metadata.config.configYaml) {
      await putNegativeDocsConfigCache(
        this.#source.owner,
        this.#source.repository,
        this.#ref,
      ).catch(() => undefined);

      throw this.createConfigNotFoundError(this.#source, "missing-docs-config");
    }

    if (!metadata.md) {
      // The GraphQL query already returned the config blob, so parse it here
      // (once) and carry it on the error. The page's not-found branch reads it
      // for config-level `redirects` — the mdx is gone but the config is not,
      // and we avoid a second round-trip to re-fetch it.
      const config = this.parseConfigSafe(metadata);

      throw new BundlerError({
        code: 404,
        name: ERROR_CODES.FILE_NOT_FOUND,
        message: `No file was found in the repository matching this path. Ensure a file exists at <code>/docs/${this.#path}.mdx</code> or <code>/docs/${this.#path}/index.mdx</code>.`,
        source: `https://github.com/${this.#source.owner}/${this.#source.repository}`,
        details: {
          ...this.getErrorDetails(this.#source),
          resolvedContentPath: metadata.path,
          reason: "docs-file-not-found",
        },
        branding: this.resolveBranding(
          config,
          metadata.baseBranch,
          this.#source,
        ),
        config,
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
        details: {
          ...this.getErrorDetails(this.#source),
          resolvedContentPath: metadata.path,
        },
      });
    }
  }
}
