// here is where we will keep OUR types that in particular exist on responses.
import * as core from 'express-serve-static-core';
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
