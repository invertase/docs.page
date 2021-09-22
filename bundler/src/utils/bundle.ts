/* eslint-disable @typescript-eslint/no-explicit-any */
import A2A from 'a2a';
import { Message } from 'esbuild';
import { GrayMatterFile } from 'gray-matter';
import { bundleMDX } from 'mdx-bundler';
import { setupXdmOptions } from './xdm-options.js';

export function headerDepthToHeaderList(depth: number): string[] {
  const list: string[] = [];
  if (depth === 0) return list;

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export interface IBundledMdx {
  bundled: {
    code: string;
    frontmatter: {
      [key: string]: any;
    };
    errors: Message[];
    matter: GrayMatterFile<any>;
  } | undefined;
  errors: any[];
  warnings: any[];
  status: number;
  line?: number;
}

export async function bundle(
  mdx: string,
  xdmOptionsSetup: typeof setupXdmOptions,
  headingDepth = 2,
): Promise<IBundledMdx> {
  const output = {
    warnings: [],
    headings: [],
  };

  const [error, bundled] = await A2A(bundleMDX(mdx, xdmOptionsSetup({ output, headingDepth })));

  return {
    bundled,
    errors: error ? error?.errors : [],
    warnings: output.warnings,
    status: error ? 500 : 200,
  };
}

export const bundleWithOptions = (mdx: string, headingDepth: number): Promise<IBundledMdx> =>
  bundle(mdx, setupXdmOptions, headingDepth);
