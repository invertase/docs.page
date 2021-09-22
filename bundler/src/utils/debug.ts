/* eslint-disable @typescript-eslint/no-explicit-any */

import { bundle, IBundledMdx } from './bundle.js';
import { setupXdmOptions } from './xdm-options.js';

export function insertCodeBlock(mdx: string, start: number, end: number): string {
  const lines: string[] = mdx.split('\n');
  lines.splice(Math.max(start - 1, 0), 0, '```');
  lines.splice(Math.min(end + 1, lines.length), 0, '```');
  return lines.join('\n');
}

export async function incrementalDebug(mdx: string): Promise<IBundledMdx | undefined> {
  const xdmOptionsSetup = setupXdmOptions;

  const lines = mdx.split('\n');

  let start = lines.length;

  while (start > 0) {
    const isolated = insertCodeBlock(mdx, start, lines.length);
    const attempt = await bundle(isolated, xdmOptionsSetup);
    if (attempt.status === 200) {
      return { ...attempt, line: start - 1 };
    }
    start = start - 1;
  }
}
