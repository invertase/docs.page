import { createContext } from 'react';
import matter from 'gray-matter';
import get from 'lodash.get';

import { LayoutType } from '../components/Layout';
import { Config, mergeConfig } from './config';
import { Properties } from './properties';
import { getBoolean, getString } from '.';
import { getGitHubContents } from './github';

export type FileType = null | 'md';

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
  type: FileType;
  frontmatter: Frontmatter;
  raw: string;
  content: string;
  headings: HeadingNode[];
  flags: {
    hasConfig: boolean;
    hasFrontmatter: boolean;
    isFork: boolean;
  };
};

export const PageContentContext = createContext<PageContent | null>(null);

export async function getPageContent(properties: Properties): Promise<PageContent | null> {
  const contents = await getGitHubContents(properties);

  if (!contents) {
    return null;
  }

  const type = contents.md ? 'md' : null;

  // If the file isn't found, return null.
  if (type === null) {
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

  if (!config) {
    config = mergeConfig({});
  }

  // Find & Replace any "{{ variable }}" values within the content
  const raw = replaceVariables(config.variables, contents.md ?? '');

  const parsed = matter(raw);
  const frontmatter = mergeFrontmatter(parsed.data);
  const content = parsed.content;

  return {
    baseBranch: contents.baseBranch,
    config,
    type,
    frontmatter,
    headings: [],
    raw,
    content,
    flags: {
      hasConfig: !!contents.config,
      hasFrontmatter: Object.keys(parsed.data).length > 0,
      isFork: contents.isFork,
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
