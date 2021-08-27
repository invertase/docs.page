/* eslint-disable @typescript-eslint/no-explicit-any */

import { DebugData } from '../types.js';
import { bundle } from './bundle.js';
import { setupXdmOptions } from './xdm-options.js';

export function insertCodeBlock(mdx: string, start: number, end: number): string {
  const lines: string[] = mdx.split('\n');
  lines.splice(Math.max(start - 1, 0), 0, '<error>"');
  lines.splice(Math.min(end + 1, lines.length), 0, '"</error>');
  console.log(lines);

  return lines.join('\n');
}

export async function incrementalDebug(
  mdx: string,
  line?: number,
  stepLength = 1,
): Promise<DebugData> {
  const xdmOptionsSetup = setupXdmOptions;

  const lines = mdx.split('\n');

  let start = mdx.split('\n').length;

  while (start > 0) {
    const isolated = lines
      .filter((l, i) => i < start)
      .concat(['<SerializationError/>'])
      .join('\n');
    const leftOver = lines.filter((l, i) => i >= start).join('\n');
    const attempt = await bundle(isolated, xdmOptionsSetup);
    if (attempt.status === 200) {
      return { ...attempt, leftOver, line: start - 1 };
    }
    start = start - stepLength;
  }
  return { leftOver: mdx, line: 0 };
}
