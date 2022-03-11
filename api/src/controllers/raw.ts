import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { bundle } from '../utils/bundler.js';
import { HeadingNode } from '../utils/plugins/rehype-headings.js';
import { getPlugins } from '../utils/getPlugins.js';
/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const bundleRaw = async (
  req: Request,
  res: Response,
): Promise<Response<BundleResponseData>> => {
  // const owner = (req?.query?.owner as string) || null;
  // const repository = (req?.query?.repository as string) || null;
  // const ref = (req?.query.ref as string) || 'HEAD';
  // console.log(req.body);

  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : 3;
  const { md: markdown, config: sourceConfig, baseBranch: sourceBaseBranch } = req.body;

  let code: string | null = null;
  let frontmatter: {
    [key: string]: any;
  } = {};
  let config: Record<string, unknown> | null = null;
  let headings: HeadingNode[] | null = [];
  let baseBranch: string | null = null;
  if (sourceConfig) {
    try {
      config = JSON.parse(sourceConfig);
    } catch (e) {
      config = null;
    }
  }
  if (sourceBaseBranch) {
    baseBranch = sourceBaseBranch;
  }
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

  const statusCode = code !== null ? 200 : 404;

  return res.status(statusCode).send({
    code,
    frontmatter,
    headings,
    config,
    baseBranch,
    path,
  });
};
