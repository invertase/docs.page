import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { bundle } from '../utils/bundler.js';
import { getGitHubContents, getPullRequestMetadata } from '../utils/github.js';
import { HeadingNode } from '../utils/plugins/rehype-headings.js';
import { getPlugins } from '../utils/getPlugins.js';
import { getFilePath, getRepositorySymLinks } from '../utils/symlinks.js';
// import remarkMath from 'remark-math';
// import rehypeKatex from 'rehype-katex';

/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const bundleGitHub = async (
  req: Request,
  res: Response,
): Promise<Response<BundleResponseData>> => {
  const queryData = extractQueryData(req);
  const { owner, repository, path, headerDepth } = queryData;
  if (!owner || !repository) {
    return res.status(404).send({
      code: 'BAD_REQUEST',
      error: 'Missing owner or repository parameters.',
    });
  }
  let ref = queryData.ref;
  let code: string | null = null;
  let frontmatter: {
    [key: string]: any;
  } = {};
  let config: {
    [key: string]: any;
  } | null = null;
  let headings: HeadingNode[] | null = [];
  let baseBranch: string | null = null;
  let repositoryFound = false;
  let source: {
    type: 'PR' | 'commit' | 'branch';
    owner: string;
    repository: string;
    ref: string;
  } = {
    type: 'branch',
    owner: owner || '',
    repository,
    ref: ref,
  };

  // Fetch from github:
  // If the ref looks like a PR
  if (/^[0-9]*$/.test(ref)) {
    // Fetch the PR metadata
    const metadata = await getPullRequestMetadata(owner, repository, ref);
    // If the PR was found, update the pointer and source
    if (metadata) {
      ref = metadata.ref;
      source = {
        type: 'PR',
        ...metadata,
      };
    }
  } else if (/^[a-fA-F0-9]{40}$/.test(ref)) {
    source = {
      type: 'commit',
      owner,
      repository,
      ref,
    };
  } else if (ref) {
    source = {
      type: 'branch',
      owner,
      repository,
      ref,
    };
  }

  let {
    md: markdown,
    config: sourceConfig,
    baseBranch: sourceBaseBranch,
    repositoryFound: sourceRepositoryFound,
  } = await getGitHubContents({
    ...source,
    path,
  });
  console.log(markdown)
  repositoryFound = sourceRepositoryFound;

  if (repositoryFound) {
    // check config
    if (sourceConfig) {
      try {
        config = JSON.parse(sourceConfig) || {};
        //@ts-ignore
        if (config && config.locales) {
          const defaulLocale = config.locales[0];
          const currentLocale = path.split('/')[0] || defaulLocale;
          config.sidebar = config?.sidebar[currentLocale];
        }

        if (config) {
          markdown = await matchSymLinks(owner, repository, path, source, markdown);
        }
      } catch (e) {
        console.error(e);

        config = null;
      }
    }
    // set the baseBranch
    if (sourceBaseBranch) {
      baseBranch = sourceBaseBranch;
    }
    // bundle the mdx
    if (markdown) {
      try {
        const bundleResult = await bundle(markdown, {
          ...getPlugins(config ?? {}),
          headerDepth,
        });
        code = bundleResult.code;
        frontmatter = bundleResult.frontmatter;
        headings = bundleResult.headings.length > 0 ? bundleResult.headings : null;
      } catch (e) {
        return res.status(400).send(e);
      }
    }
  }

  const statusCode = 200;
  return res.status(statusCode).send({
    code,
    frontmatter,
    headings,
    config,
    baseBranch,
    path,
    repositoryFound,
    source,
    ref,
  });
};

const extractQueryData = (req: Request) => {
  const owner = req?.query?.owner as string;
  const repository = (req?.query?.repository as string) || null;
  const ref = (req?.query.ref as string) || 'HEAD';
  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : 3;
  return {
    owner,
    repository,
    ref,
    path,
    headerDepth,
  };
};

const matchSymLinks = async (
  owner: string,
  repository: string,
  path: string,
  source: {
    type: 'PR' | 'commit' | 'branch';
    owner: string;
    repository: string;
    ref: string;
  },
  markdown: string | undefined,
) => {
  let md = markdown;
  const symLinks = await getRepositorySymLinks(owner, repository, 'docs', source.ref);

  const matches = symLinks.filter(s => s.formattedPath === path);

  if (matches.length) {
    const filePath = matches[0].filePath;

    const { md: symMarkdown } = await getGitHubContents(
      {
        ...source,
        path: filePath,
      },
      true,
    );
    if (symMarkdown) {
      md = symMarkdown;
    }
  }
  return md;
};
