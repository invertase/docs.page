import { config } from 'dotenv';
config();
import fetch from 'node-fetch';
import { BundleResponseData, FetchBundleInput } from './types';
const base = process.env.BUNDLER_URL;
const getEndpoint = (base: string, { owner, repository, ref, path }: FetchBundleInput) =>
  `${base}/bundle?owner=${owner}&repository=${repository}${path ? `&path=${path}` : ''}${
    ref ? `&ref=${ref}` : ''
  }`;

export async function fetchBundle(params: FetchBundleInput): Promise<BundleResponseData> {
  const endpoint = getEndpoint(base || `https://api.docs.page`, params);
  //@ts-ignore
  const data = await fetch(endpoint, { method: 'POST' }).then(r => r.json());

  return data as unknown as BundleResponseData;
}

export * from './types';
