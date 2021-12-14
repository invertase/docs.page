import { bundle } from '../utils/bundler.js';

import { Request, Response } from 'express';
import { getPlugins } from '../utils/pluginMap.js';
import { getGitHubContents } from '../utils/github.js';
import { BundleError, BundleResponseData } from '../types.js';
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
  //
  // parse query params:
  const owner = (req?.query?.owner as string) || null;
  const repository = (req?.query?.repository as string) || null;
  const ref = (req?.query.ref as string) || 'HEAD';
  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : null;
  //
  //
  // get plugins for mdx-bundler:
  const remarkPlugins = getPlugins(['remark-parse', 'remark-gfm']);
  const rehypePlugins = getPlugins(['rehype-slug']);
  //
  //
  //
  //
  if (owner && repository && ref && path) {
    // fetch from github:
    const { md } = await getGitHubContents({
      owner,
      repository,
      ref: ref || 'HEAD',
      path,
    });
    if (md) {
      const result = await bundle(md, {
        remarkPlugins,
        rehypePlugins,
        headerDepth,
      });
      if (result?.errors?.length > 0) {
        console.log(result);

        return res
          .status(500)
          .send({ message: 'Error bundling your markdown', errors: result.errors });
      }
      return res.status(200).json(result);
    }
  }
  return res
    .status(404)
    .send('Error: missing some parameters, you need at least owner, repository');
};
