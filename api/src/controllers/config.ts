import { Request, Response } from 'express';
import { BundleResponseData } from '@docs.page/server';
import { getPullRequestMetadata } from '../utils/github.js';
import fetch from 'node-fetch';

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
  const { owner, repository, path } = queryData;

  if (!owner || !repository) {
    return res.status(404).send({
      code: 'BAD_REQUEST',
      error: 'Missing owner or repository parameters.',
    });
  }
  let ref = queryData.ref;
  let config: Record<string, any> | null = null;
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

  const endpoint = `https://raw.githubusercontent.com/${source.owner}/${source.repository}/${source.ref}/docs.json`;

  let sourceConfig: string | null;

  try {
    sourceConfig = await (await fetch(endpoint)).text();
  } catch (e) {
    console.error(e);
    sourceConfig = null;
  }

  if (sourceConfig) {
    try {
      config = JSON.parse(sourceConfig) || {};
      if (config && config.locales) {
        const defaulLocale = config.locales[0];
        const currentLocale = path.split('/')[0] || defaulLocale;
        config.sidebar = config?.sidebar[currentLocale];
      }
    } catch (e) {
      console.error(e);
      config = null;
    }
  }

  const statusCode = 200;
  return res.status(statusCode).send({
    config,
  });
};

const extractQueryData = (req: Request) => {
  const owner = req?.query?.owner as string;
  const repository = (req?.query?.repository as string) || null;
  const ref = (req?.query.ref as string) || 'HEAD';
  const path = (req?.query.path as string) || 'index';
  return {
    owner,
    repository,
    ref,
    path,
  };
};
