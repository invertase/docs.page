import { createContext } from 'react';
import matter from 'gray-matter';
import get from 'lodash.get';

import { LayoutType } from '../components/Layout';
import { Config, mergeConfig } from './config';
import { Properties } from './properties';
import { getBoolean, getString } from '.';
import { getGitHubContents } from './github';

export type HeadingNode = {
  id: string;
  title: string;
  rank: number;
};

export type Frontmatter = {
  title: string;
  description: string;
  image: string;
  tableOfContents: boolean;
  layout: LayoutType;
  sidebar: boolean;
  redirect: string;
};

export type PageContent = {
  baseBranch: string;
  config: Config;
  frontmatter: Frontmatter;
  markdown: string;
  headings: HeadingNode[];
  flags: {
    hasConfig: boolean;
    hasFrontmatter: boolean;
    isFork: boolean;
    isIndexable: boolean;
  };
};

export const PageContentContext = createContext<PageContent | null>(null);

export async function getPageContent(properties: Properties): Promise<PageContent | null> {
  const contents = await getGitHubContents(properties);

  // Repository not found
  if (!contents) {
    return null;
  }

  let config: Config;
  if (contents.config) {
    try {
      const json = JSON.parse(contents.config);
      config = mergeConfig(json || {});
    } catch (e) {
      console.error(e);
      // Ignore errors
    }
  }

  // Assign the default config if one doesn't already exist
  if (!config) {
    config = mergeConfig({});
  }

  // Find & Replace any "{{ variable }}" values within the content
  const raw = replaceVariables(config.variables, contents.md ?? '');

  const parsed = matter(raw);
  const frontmatter = mergeFrontmatter(parsed.data);
  const markdown = parsed.content;

  return {
    baseBranch: contents.baseBranch,
    config,
    frontmatter,
    headings: [],
    markdown,
    flags: {
      hasConfig: !!contents.config,
      hasFrontmatter: Object.keys(parsed.data).length > 0,
      isFork: contents.isFork,
      isIndexable:
        !!contents.md &&
        !config.noindex &&
        !contents.isFork &&
        properties.isBaseBranch &&
        !!contents.config,
    },
  };
}

function mergeFrontmatter(data: any): Frontmatter {
  return {
    title: getString(data, 'title', ''),
    description: getString(data, 'description', ''),
    image: getString(data, 'image', ''),
    tableOfContents: getBoolean(data, 'tableOfContents', true),
    layout: getString<LayoutType>(data, 'layout', '' as LayoutType),
    sidebar: getBoolean(data, 'sidebar', true),
    redirect: getString(data, 'redirect', ''),
  };
}

const VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;

function replaceVariables(variables: object, value: string) {
  let output = value;
  let m: RegExpExecArray;

  while ((m = VARIABLE_REGEX.exec(value)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === VARIABLE_REGEX.lastIndex) {
      VARIABLE_REGEX.lastIndex++;
    }

    output = output.replace(m[0], get(variables, m[1], ''));
  }

  return output;
}
