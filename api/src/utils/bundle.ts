import fetch from 'node-fetch';
import { bundle } from './bundler.js';
import { getPlugins } from './getPlugins.js';
import { Contents, getGitHubContents } from './github.js';
import { HeadingNode } from './plugins/rehype-headings.js';
import { formatSourceAndRef } from './ref.js';
import { getRepositorySymLinks } from './symlinks.js';
import { hasLocales, InputConfig, OutputConfig, defaultConfig } from './types.js';

type Frontmatter = Record<string, string>;

type Source = {
  type: 'PR' | 'commit' | 'branch';
  owner: string;
  repository: string;
  ref: string;
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
  ref: string;
  headerDepth: number;
  built: boolean;
  contentFetched: boolean;

  constructor(owner: string, repository: string, path: string, ref: string, headerDepth?: number) {
    this.code = '';
    this.markdown = '';
    this.frontmatter = {};
    this.headings = [];
    this.headerDepth = headerDepth || 3;
    this.config = defaultConfig;
    this.path = path;
    this.baseBranch = 'main';
    this.repositoryFound = false;
    this.source = {
      type: 'branch',
      owner,
      repository,
      ref,
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
      throw new BundleError(404, "Couldn't fetch github contents");
    }
    if (!githubContents.repositoryFound) {
      throw new BundleError(404, "Couldn't find github contents");
    }
    this.markdown = githubContents.md;
    this.baseBranch = githubContents.baseBranch;
    this.repositoryFound = githubContents.repositoryFound;

    console.log('debug');
    this.formatConfigLocales(githubContents.config);
    await this.matchSymLinks();
    this.contentFetched = true;
  }

  async getConfig() {
    const { owner, repository, ref } = this.source;
    const extension = '.json';

    const endpoint = `https://raw.githubusercontent.com/${owner}/${repository}/${ref}/docs${extension}`;
    let configString: string;
    try {
      configString = await (await fetch(endpoint)).text();
      //TODO: validate config
    } catch (e) {
      throw new BundleError(404, 'Unable to fetch config file.');
    }
    this.formatConfigLocales(configString);
    return this.config;
  }

  // bundles markdown and return data for frontend
  async build() {
    if (!this.contentFetched) {
      await this.getContent();
    }

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
      throw new BundleError(500, 'Error bundling markdown');
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
      this.source.ref,
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

  formatConfigLocales(configString: string) {
    let inputConfig: InputConfig;

    // TODO: validation of config?
    try {
      inputConfig = JSON.parse(configString) as InputConfig;
    } catch (e) {
      throw new BundleError(500, 'Error parsing config');
    }

    if (hasLocales(inputConfig)) {
      const defaulLocale = inputConfig.locales[0];

      const currentLocale = this.path.split('/')[0] || defaulLocale;

      this.config = {
        ...inputConfig,
        sidebar: inputConfig?.sidebar[currentLocale],
      };
    } else {
      this.config = inputConfig;
    }
  }
}

export class BundleError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
