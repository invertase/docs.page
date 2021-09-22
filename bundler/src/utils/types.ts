/* eslint-disable @typescript-eslint/no-explicit-any */

// here is where we will keep OUR types that in particular exist on responses.

import * as core from 'express-serve-static-core';
import { Message } from 'esbuild';
import { GrayMatterFile } from 'gray-matter';
export interface Warning {
  warningType?: 'undefined component' | 'undeclared variable';
  line?: number;
  column?: number;
  detail?: string;
}
export interface BundleError {
  line: number;
  column: number;
  message: number;
}

export interface Heading {
  id: string;
  title: string;
  rank: number;
}

export interface RequestQuery extends core.Query {
  headerDepth: string;
}

export interface IBundledMdx {
  bundled:
    | {
        code: string;
        frontmatter: {
          [key: string]: any;
        };
        errors: Message[];
        matter: GrayMatterFile<any>;
      }
    | undefined;
  errors: BundleError[];
  warnings: Warning[];
  status: number;
}

export type IDebugMdx = IBundledMdx & { line: number };
