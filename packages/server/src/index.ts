import fetch from 'node-fetch';
import querystring from 'querystring';

import { config } from 'dotenv';
import { BundleResponseData, FetchBundleInput } from './types';

config();

// The base URL for the bundler.
const { BUNDLER_URL, API_PASSWORD, NODE_ENV } = process.env;

function getEndpoint(base: string, { owner, repository, ref, path }: FetchBundleInput): string {
  const params: Record<string, string> = {
    owner,
    repository,
  };
  if (path) params['path'] = path;
  if (ref) params['ref'] = ref;
  return `${base}/bundle?${querystring.stringify(params)}`;
}

export async function fetchBundle(params: FetchBundleInput): Promise<BundleResponseData> {

  const endpoint = getEndpoint(
    BUNDLER_URL || NODE_ENV === 'production' ? `https://api.docs.page` : 'http://localhost:8000',
    params,
  );


  if (NODE_ENV == 'production' && !API_PASSWORD) {
    throw new Error('Please provide API_PASSWORD env variable');
  }

  const token = Buffer.from(`admin:${API_PASSWORD}`).toString('base64');
  const data = await fetch(endpoint, {
    headers: { Authorization: `Basic ${token}` },
  }).then(response => {
    console.log(endpoint);

    console.dir(response.headers);
    if (response.status == 200) {
      return response.json();
    } else
      throw new Error(
        `Failed to fetch bundle for "${endpoint}". HTTP Status: "${response.status}".`,
      );
  });

  return data as BundleResponseData;
}

export * from './types';
