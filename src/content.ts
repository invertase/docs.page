import { createContext } from "react";
import matter from "gray-matter";
import yaml from "js-yaml";

import { LayoutType } from "./components/Layout";
import { Config, defaultConfig, mergeConfig } from "./config";
import { SlugProperties } from "./properties";
import { getBoolean, getString, GithubGQLClient } from "./utils";

export type FileType = null | "md" | "mdx" | "html";

export type Frontmatter = {
  title: string;
  description: string;
  layout: LayoutType;
  sidebar: boolean;
};

export type PageContent = {
  config: Config;
  type: FileType;
  frontmatter: Frontmatter;
  raw: string;
  content: string;
};

export const ContentContext = createContext<PageContent | null>(null);

export async function getPageContent(
  properties: SlugProperties
): Promise<PageContent | null> {
  const { repository } = await GithubGQLClient({
    query: `
      query RepositoryConfig($owner: String!, $repository: String!, $config: String!, $md: String!, $mdx: String!, $html: String!) {
        repository(owner: $owner, name: $repository) {
          config: object(expression: $config) {
            ... on Blob {
              text
            }
          }
          md: object(expression: $md) {
            ... on Blob {
              text
            }
          }
          mdx: object(expression: $mdx) {
            ... on Blob {
              text
            }
          }
          html: object(expression: $html) {
            ... on Blob {
              text
            }
          }
        }
      }
    `,
    owner: properties.owner,
    repository: properties.repository,
    // Not sure how to build string values with variables within GQL
    config: `${properties.branch}:docs.yaml`,
    md: `${properties.branch}:docs/${properties.path}.md`,
    mdx: `${properties.branch}:docs/${properties.path}.mdx`,
    html: `${properties.branch}:docs/${properties.path}.html`,
  });

  const type = (() => {
    if (repository.md) return "md";
    if (repository.mdx) return "mdx";
    if (repository.html) return "html";
    return null;
  })();

  // If the file isn't found, return null.
  if (type === null) {
    return null;
  }

  let config: Config;
  try {
    const json = yaml.safeLoad(repository.config?.text ?? "");
    config = mergeConfig(json || {});
  } catch (e) {
    // Ignore errors for now
    config = mergeConfig({});
  }

  // // const config: Config = mergeConfig(repository.config?.text ?? {});
  // const config: Config = defaultConfig;

  // Get the raw file contents
  let raw =
    repository.md?.text ?? repository.mdx?.text ?? repository.html?.text ?? "";

  // Only MD/MDX pages can have frontmatter
  let frontmatter: Frontmatter;
  let content = "";
  if (type === "md" || type === "mdx") {
    const parsed = matter(raw);
    frontmatter = mergeFrontmatter(parsed.data ?? {});
    content = parsed.content;
  } else {
    frontmatter = mergeFrontmatter({});
    content = raw;
  }

  return {
    config,
    type,
    frontmatter,
    raw,
    content,
  };
}

function mergeFrontmatter(data: any): Frontmatter {
  return {
    title: getString(data, "title", ""),
    description: getString(data, "description", ""),
    layout: getString<LayoutType>(data, "layout", "" as LayoutType),
    sidebar: getBoolean(data, "sidebar", true),
  };
}
