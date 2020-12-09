import { createContext } from 'react';
import matter from 'gray-matter';
import get from 'lodash.get';

import { LayoutType } from './components/Layout';
import { Config, mergeConfig } from './config';
import { Properties, SlugProperties } from './properties';
import { getBoolean, getString } from './utils';
import { getGitHubFiles } from './github';

export type FileType = null | 'md' | 'mdx';

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
  config: Config;
  type: FileType;
  frontmatter: Frontmatter;
  raw: string;
  content: string;
  flags: {
    hasConfig: boolean;
    hasFrontmatter: boolean;
  };
};

export const PageContentContext = createContext<PageContent | null>(null);

export async function getPageContent(properties: Properties): Promise<PageContent | null> {
  const files = await getGitHubFiles(properties);

  if (!files) {
    return null;
  }

  const type = (() => {
    if (files.md) return 'md';
    if (files.mdx) return 'mdx';
    return null;
  })();

  // If the file isn't found, return null.
  if (type === null) {
    return null;
  }

  let config: Config;
  if (files.config) {
    try {
      const json = JSON.parse(files.config);
      config = mergeConfig(json || {});
    } catch (e) {
      // Ignore errors
    }
  }

  if (!config) {
    config = mergeConfig({});
  }

  // Get the raw file contents
  let raw = files.md ?? files.mdx ?? '';

  // Only MD/MDX pages can have frontmatter
  let hasFrontmatter = false;
  let frontmatter: Frontmatter;
  let content = '';
  if (type === 'md' || type === 'mdx') {
    const parsed = matter(raw);
    hasFrontmatter = true;
    frontmatter = mergeFrontmatter(parsed.data ?? {});
    content = parsed.content;
  } else {
    frontmatter = mergeFrontmatter({});
    content = raw;
  }

  // Find & Replace any "{{ variable }}" values within the content
  content = replaceVariables(config.variables, content);

  return {
    config,
    type,
    frontmatter,
    raw,
    content,
    flags: {
      hasConfig: !!files.config,
      hasFrontmatter,
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
