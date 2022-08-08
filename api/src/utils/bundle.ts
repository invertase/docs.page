import { bundle } from '../bundler/bundler.js';
import { getPlugins } from '../bundler/getPlugins.js';
import { Contents, getConfigs, getGitHubContents } from './github.js';
import { HeadingNode } from '../bundler/plugins/rehype-headings.js';
import { formatSourceAndRef } from './ref.js';
import { getRepositorySymLinks } from './symlinks.js';
import { OutputConfig, defaultConfig, ErrorReason } from '@docs.page/server';
import { formatConfigLocales } from './config.js';

type Frontmatter = Record<string, string>;

type Source = {
  type: 'PR' | 'commit' | 'branch';
  owner: string;
  repository: string;
  ref?: string;
};

type BundleConstructorParams = {
  owner: string;
  repository: string;
  path?: string;
  ref?: string;
  headerDepth?: number;
  markdown?: string;
  config?: OutputConfig;
};

export class Bundle {
  code: string;
  markdown: string;
  frontmatter: Frontmatter;
  headings: HeadingNode[];
  config: OutputConfig;
  baseBranch: string;
  path: string;
  repositoryFound: boolean;
  source: Source;
  sourceChecked: boolean;
  ref?: string;
  headerDepth: number;
  built: boolean;
  contentFetched: boolean;

  constructor({
    owner,
    repository,
    path,
    ref,
    headerDepth,
    markdown,
    config,
  }: BundleConstructorParams) {
    this.code = '';
    this.markdown = markdown || '';
    this.frontmatter = {};
    this.headings = [];
    this.headerDepth = headerDepth || 3;
    this.config = config || defaultConfig;
    this.path = path || 'index';
    this.baseBranch = 'main';
    this.repositoryFound = false;
    this.source = {
      type: 'branch',
      owner,
      repository,
      ref: ref,
    };
    this.ref = ref;
    this.sourceChecked = false;
    this.built = false;
    this.contentFetched = false;
  }

  // check for branch/PR ref
  async updateSourceAndRef() {
    const { owner, repository, ref } = this.source;
    const { source, ref: sourceRef } = await formatSourceAndRef(owner, repository, ref);
    this.source = source;
    this.ref = sourceRef;
    this.sourceChecked = true;
  }

  // fetches markdown from github
  async getContent() {
    if (!this.sourceChecked) {
      await this.updateSourceAndRef();
    }
    // fetch content
    let githubContents: Contents;
    try {
      githubContents = await getGitHubContents({
        ...this.source,
        path: this.path,
      });
    } catch (e) {
      throw new BundleError(404, "Couldn't fetch github contents", 'REPO_NOT_FOUND');
    }
    if (!githubContents.repositoryFound) {
      throw new BundleError(404, "Couldn't find github contents", 'REPO_NOT_FOUND');
    }
    this.baseBranch = githubContents.baseBranch;

    if (!this.ref) {
      this.ref = this.baseBranch;
      this.source.ref = this.baseBranch;
    }

    this.repositoryFound = githubContents.repositoryFound;

    this.config = formatConfigLocales(githubContents.config, this.path);

    await this.matchSymLinks();
    if (githubContents.md === null) {
      throw new BundleError(404, "Couldn't find file", 'FILE_NOT_FOUND');
    }
    this.markdown = githubContents.md;
    this.contentFetched = true;
  }

  async getConfig() {
    const { repositoryFound, config } = await getConfigs({
      ...this.source,
      path: this.path,
    });

    if (!repositoryFound || !config) {
      throw new BundleError(404, 'Unable to fetch config file.');
    }

    this.config = formatConfigLocales(config, this.path);

    return this.config;
  }

  // bundles markdown and return data for frontend
  async build() {
    try {
      const bundleResult = await bundle(this.markdown, {
        ...getPlugins(this.config),
        headerDepth: this.headerDepth,
      });
      this.code = bundleResult.code;
      this.frontmatter = bundleResult.frontmatter;
      this.headings = bundleResult.headings.length > 0 ? bundleResult.headings : [];
      this.built = true;
    } catch (e) {
      throw new BundleError(500, 'Error bundling markdown', 'BUNDLE_ERROR');
    }
    return {
      code: this.code,
      frontmatter: this.frontmatter,
      headings: this.headings,
      config: this.config,
      baseBranch: this.baseBranch,
      path: this.path,
      repositoryFound: this.repositoryFound,
      source: this.source,
      ref: this.ref,
    };
  }

  async matchSymLinks() {
    const symLinks = await getRepositorySymLinks(
      this.source.owner,
      this.source.repository,
      'docs',
      this.source.ref!,
    );

    const matches = symLinks.filter(s => s.formattedPath === this.path);

    if (matches.length) {
      const filePath = matches[0].filePath;

      const { md: symMarkdown } = await getGitHubContents(
        {
          ...this.source,
          path: filePath,
        },
        true,
      );
      if (symMarkdown) {
        this.markdown = symMarkdown;
      }
    }
  }
}

export class BundleError extends Error {
  statusCode: number;
  reason?: ErrorReason;

  constructor(statusCode: number, message: string, reason?: ErrorReason) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.reason = reason;
  }
}
