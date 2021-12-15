import { Message } from "esbuild";

export type FetchBundleInput = {
  owner: string;
  repository: string;
  ref?: string;
  path?: string;
};

type HeadingNode = {
  id: string;
  title: string;
  rank: number | null;
};

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
