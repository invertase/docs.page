import type { BundleConfig, GetBundleResponseSuccess } from './bundle';

export type Context = {
  owner: string;
  repository: string;
  config: BundleConfig;
  frontmatter: GetBundleResponseSuccess['frontmatter'];
  code: string;
  headings: GetBundleResponseSuccess['headings'];
  domain: string | undefined;
};
