/* eslint-disable @typescript-eslint/no-explicit-any */
import A2A from 'a2a';
import { bundleMDX } from 'mdx-bundler';
import { setupXdmOptions } from './xdm-options.js';
import { BundleData } from '../types.js';
export function headerDepthToHeaderList(depth: number): string[] {
  const list: string[] = [];
  if (depth === 0) return list;

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export async function bundle(
  mdx: string,
  xdmOptionsSetup: typeof setupXdmOptions,
  headingDepth = 2,
): Promise<BundleData> {
  const output = {
    warnings: [],
    headings: [],
  };

  const [error, bundled] = await A2A(bundleMDX(mdx, xdmOptionsSetup({ output, headingDepth })));
  // console.log('DEBUG ERROR:', error);
  // console.log('DEBUG BUNDLED:', bundled);

  return {
    bundled,
    errors: error ? error?.errors : [],
    warnings: output.warnings,
    status: error ? 500 : 200,
    headings: output.headings,
  };
}

export const bundleWithOptions = (mdx: string, headingDepth: number): Promise<BundleData> =>
  bundle(mdx, setupXdmOptions, headingDepth);
