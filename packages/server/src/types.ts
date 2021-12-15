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
