import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { bundle } from '../utils/bundler.js';
import { getPlugins } from '../utils/pluginMap.js';
import { getGitHubContents } from '../utils/github.js';
import { HeadingNode } from '../utils/plugins/rehype-headings.js';
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
  const owner = (req?.query?.owner as string) || null;
  const repository = (req?.query?.repository as string) || null;
  const ref = (req?.query.ref as string) || 'HEAD';
  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : 3;

  // get plugins for mdx-bundler:
  const remarkPlugins = getPlugins([]);
  const rehypePlugins = getPlugins([]);

  let code: string | null = null;
  let frontmatter: {
    [key: string]: any;
  } = {};
  let config: {
    [key: string]: any;
  } | null = null;
  let headings: HeadingNode[] | null = [];

  if (owner && repository && ref && path) {
    // fetch from github:
    const { md: markdown, config: sourceConfig } = await getGitHubContents({
      owner,
      repository,
      ref: ref || 'HEAD',
      path,
    });
    // check config
    if (sourceConfig) {
      try {
        config = JSON.parse(sourceConfig);
      } catch (e) {
        config = null;
      }
    }

    if (markdown) {
      try {
        const bundleResult = await bundle(markdown, {
          remarkPlugins,
          rehypePlugins,
          headerDepth,
        });
        code = bundleResult.code;
        frontmatter = bundleResult.frontmatter;
        console.log('debug');

        headings = bundleResult.headings.length > 0 ? bundleResult.headings : null;
      } catch (e) {
        return res.status(400).send(e);
      }
    }
  }

  const statusCode = code !== null ? 200 : 404;
  console.log(headings);
  
  return res.status(statusCode).send({
    code,
    frontmatter,
    headings,
    config,
  });
};
