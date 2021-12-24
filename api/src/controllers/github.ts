import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { bundle } from '../utils/bundler.js';
import { getGitHubContents } from '../utils/github.js';
import { HeadingNode } from '../utils/plugins/rehype-headings.js';
import { getPlugins } from '../utils/getPlugins.js';
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
  // parse query params:
  const {
    owner,
    repository,
    ref,
    path,
    headerDepth
  } = extractQueryData(req)


  let code: string | null = null;
  let frontmatter: {
    [key: string]: any;
  } = {};
  let config: {
    [key: string]: any;
  } | null = null;
  let headings: HeadingNode[] | null = [];
  let baseBranch: string | null = null;
  let repositoryFound: boolean = false;
  if (owner && repository) {
    // fetch from github:
    const {
      md: markdown,
      config: sourceConfig,
      baseBranch: sourceBaseBranch,
      repositoryFound: sourceRepositoryFound
    } = await getGitHubContents({
      owner,
      repository,
      ref: ref,
      path,
    });
    repositoryFound = sourceRepositoryFound
    if (!repositoryFound) {
      console.error('repository not found');
    }


    // check config
    if (sourceConfig) {
      try {
        // console.log(sourceConfig);
        config = JSON.parse(sourceConfig);
      } catch (e) {
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

  const statusCode = code !== null ? 200 : 404;

  return res.status(statusCode).send({
    code,
    frontmatter,
    headings,
    config,
    baseBranch,
    path,
    repositoryFound
  });
};


const extractQueryData = (req: Request) => {

  // extract query params and set defaults if nec.
  const owner = (req?.query?.owner as string) || null;
  const repository = (req?.query?.repository as string) || null;
  const ref = (req?.query.ref as string) || 'HEAD';
  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : 3;
  return {
    owner,
    repository,
    ref,
    path,
    headerDepth
  }
}