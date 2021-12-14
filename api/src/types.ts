import { Message } from 'esbuild';
import { HeadingNode } from './utils/plugins/rehype-headings';

export type BundleError = {
  message: string;
  errors: Message[];
};

export type BundleSuccess = {
  bundle: string;
  frontmatter: {
    [key: string]: any;
  };
  errors: Message[];
  headings: HeadingNode[];
};

export type BundleResponseData = BundleError | BundleSuccess;
