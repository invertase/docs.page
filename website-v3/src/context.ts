import { map } from 'nanostores';
import type { BundleConfig, GetBundleResponseSuccess } from './bundle';

export type Context = {
  // The owner of the repository (e.g. invertase)
  owner: string;
  // The name of the repository (e.g. docs.page)
  repository: string;
  // The optional ref provided in the URL (invertase/docs.page~next)
  ref: string | undefined;
  // The relative path of the page (e.g. /getting-started)
  relativePath: string;
  // The docs.json config file
  config: BundleConfig;
  // Frontmatter of the current page
  frontmatter: GetBundleResponseSuccess['frontmatter'];
  // The MDX ready code string
  code: string;
  // An array of headings on the page
  headings: GetBundleResponseSuccess['headings'];
  // The domain of the site (e.g. use.docs.page), matched from the domains.json file
  domain: string | undefined;
  // The base branch of the repo (e.g. main)
  baseBranch: GetBundleResponseSuccess['baseBranch'];
  // The source of the page contents
  source: GetBundleResponseSuccess['source'];
};

const store = map<Context>();

export default store;
