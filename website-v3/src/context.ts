import { map } from 'nanostores';
import type { BundleConfig, GetBundleResponseSuccess } from './bundle';

export type Context = {
  owner: string;
  repository: string;
  config: BundleConfig;
  frontmatter: GetBundleResponseSuccess['frontmatter'];
  code: string;
  headings: GetBundleResponseSuccess['headings'];
  domain: string | undefined;
  baseBranch: GetBundleResponseSuccess['baseBranch'];
  source: GetBundleResponseSuccess['source'];
};

const store = map<Context>();

export default store;
