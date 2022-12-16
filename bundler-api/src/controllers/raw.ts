import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { Bundle, BundleError } from '../utils/bundle.js';
import { formatConfigLocales } from '../utils/config.js';
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
  const path = (req?.query.path as string) || 'index';
  const headerDepth = req?.query?.headerDepth ? parseInt(req?.query?.headerDepth as string) : 3;
  const { md: markdown, config: sourceConfig } = req.body;

  const bundleInstance = new Bundle({
    owner: 'n/a',
    repository: 'n/a',
    path,
    headerDepth,
    markdown,
  });
  if (sourceConfig) {
    bundleInstance.config = formatConfigLocales(sourceConfig, path);
  }
  try {
    const data = await bundleInstance.build();
    return res.status(200).send(data);
  } catch (e) {
    if (e instanceof BundleError) {
      return res.status(e.statusCode).send(e);
    }
    throw e;
  }
};
