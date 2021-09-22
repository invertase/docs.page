/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from 'express-serve-static-core';
import { Request } from 'express';

export interface Warning {
  warningType?: 'undefined component' | 'undeclared variable';
  line?: number;
  column?: number;
  detail?: string;
}
export interface Error {
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

export interface BundleRequest extends Request {
  body: string;
  query: {
    headingDepth: string;
  };
}

export interface RecursiveDebugRequest extends Request {
  body: string;
  query: {
    line: string;
  };
}

export interface BundleData {
  bundled: any;
  errors: Error[] | [];
  warnings: Warning[] | [];
  status: number;
  leftOver?: string;
  headings: any[]
}
export interface DebugData extends Partial<BundleData> {
  leftOver?: string;
  line?: number;
}
