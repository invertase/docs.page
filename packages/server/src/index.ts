import { config } from 'dotenv';
import fetch, { Headers } from 'node-fetch';
import { BundleResponseData, FetchBundleInput } from './types';
import base64 from 'base-64';
config();

// The base URL for the bundler.
const { BUNDLER_URL, API_PASSWORD } = process.env;

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

  if (!API_PASSWORD) {
    throw new Error('Please provide API_PASSWORD env variable')
  }
  const token = base64.encode(`admin:${API_PASSWORD}`)

  const data = await fetch(endpoint, { headers: new Headers({ 'Authorization': `Basic ${token}` }) }).then(r => {
    if (r.status !== 500) {
      return r.json();
    } else throw new Error();
  });

  return data as unknown as BundleResponseData;
}

export * from './types';
