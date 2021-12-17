import { config } from 'dotenv';
import fetch from 'node-fetch';
import { BundleResponseData, FetchBundleInput } from './types';

config();

// The base URL for the bundler.
const BUNDLER_URL = process.env.BUNDLER_URL;

function getEndpoint(base: string, { owner, repository, ref, path }: FetchBundleInput): string {
  let endpoint = `${base}/bundle?`;

  const query = [];
  query.push(`owner=${owner}`);
  query.push(`repository=${repository}`);
  if (path) query.push(`path=${path}`);
  if (ref) query.push(`ref=${ref}`);

  return endpoint + query.join('&');
}

export async function fetchBundle(params: FetchBundleInput): Promise<BundleResponseData> {
  const endpoint = getEndpoint(BUNDLER_URL || `https://api.docs.page`, params);
  const data = await fetch(endpoint, { method: 'POST' }).then(r => {
    if (r.status !== 500) {
      return r.json();
    } else throw new Error();
  });
  return data as unknown as BundleResponseData;
}

export * from './types';
