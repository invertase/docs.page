import { Message } from 'esbuild';
import { HeadingNode } from './utils/plugins/rehype-headings';

export type BundleError = {
  message: string;
  errors: Message[];
};

export type BundleSuccess = {
  code: string;
  frontmatter: {
    [key: string]: any;
  };
  errors: Message[];
  headings: HeadingNode[];
};

export type BundleResponseData = {
  code: string | null;
  config: {
    [key: string]: any;
  } | null;
  frontmatter: {
    [key: string]: any;
  };
  headings: HeadingNode[] | null;
};
