import { map } from 'nanostores';
import type { BundleConfig, GetBundleResponseSuccess, SidebarArray } from './bundle';

export type Context = {
  // The owner of the repository (e.g. invertase)
  owner: string;
  // The name of the repository (e.g. docs.page)
  repository: string;
  // The optional ref provided in the URL (invertase/docs.page~next)
  ref: string | undefined;
  // The locale of the request.
  locale: string | undefined;
  // The relative path of the page (e.g. /getting-started)
  relativePath: string;
  // The path to the page on github
  githubPath: string;
  // The path to the ref on github
  githubRefPath: string;
  // The sidebar for the page
  sidebar: SidebarArray;
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
  // The theme of the site
  theme: 'light' | 'dark' | undefined;
  // Any syncronized tabs (via groupId).
  tabs: Record<string, string>;
};

const store = map<Context>();

export default store;
