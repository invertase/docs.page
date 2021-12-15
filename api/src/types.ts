import { Message } from 'esbuild';
import { HeadingNode } from './utils/plugins/rehype-headings';

export type BundleError = {
  errors: Message[];
};

export type BundleResponseData =
  | {
      code: string | null;
      config: {
        [key: string]: any;
      } | null;
      frontmatter: {
        [key: string]: any;
      };
      headings: HeadingNode[] | null;
    }
  | BundleError;
