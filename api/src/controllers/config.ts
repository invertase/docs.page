import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { Bundle, BundleError } from '../utils/bundle.js';

/**
 * Gets the API information.
 *
 * @param {Request} req
 * @param {Response} res
 */
export const getConfig = async (
  req: Request,
  res: Response,
): Promise<Response<BundleResponseData>> => {
  const queryData = extractQueryData(req);
  const { owner, repository, path, ref } = queryData;

  if (!owner || !repository) {
    return res.status(400).send({
      code: 'BAD_REQUEST',
      error: 'Missing owner or repository parameters.',
    });
  }

  const bundleInstance = new Bundle({ owner, repository, path, ref });

  try {
    await bundleInstance.updateSourceAndRef();
    await bundleInstance.getConfig();
  } catch (e) {
    if (e instanceof BundleError) {
      return res.status(e.statusCode).send(e);
    }
    throw e;
  }

  return res.status(200).send(bundleInstance.config);
};

const extractQueryData = (req: Request) => {
  const owner = req?.query?.owner as string;
  const repository = (req?.query?.repository as string) || null;
  const ref = req?.query.ref as string;
  const path = (req?.query.path as string) || 'index';
  return {
    owner,
    repository,
    ref,
    path,
  };
};
