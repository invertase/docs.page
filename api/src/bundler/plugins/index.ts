import type { PluggableList } from "@mdx-js/mdx/lib/core";

import remarkComment from "remark-comment";
// Remark Plugins
import remarkGfm from "remark-gfm";
import remarkComponentCheck from "./remark-component-check";
import remarkUndeclaredVariables from "./remark-undeclared-variables";
// import { remarkCodeHike } from '@code-hike/mdx';
// import { theme as codeHikeTheme } from './codeHikeTheme';

import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
// Rehype Plugins
import rehypeSlug from "rehype-slug";
import rehypeCodeBlocks from "./rehype-code-blocks";
import rehypeInlineBadges from "./rehype-inline-badges";

type PluginOptions = {
  components?: Array<string>;
  codeHike?: boolean;
  math?: boolean;
};

export function getRemarkPlugins(options?: PluginOptions): PluggableList {
  const plugins = [
    remarkComponentCheck(options?.components ?? []),
    remarkUndeclaredVariables,
    remarkGfm,
    remarkComment,
  ];

  if (options?.codeHike) {
    // plugins.push([remarkCodeHike, { theme: codeHikeTheme, lineNumbers: true }]);
  }

  return plugins;
}

export function getRehypePlugins(options?: PluginOptions): PluggableList {
  const plugins = [
    rehypeCodeBlocks,
    rehypeSlug,
    rehypeInlineBadges,
    rehypeAccessibleEmojis,
  ];

  if (options?.codeHike) {
    // plugins.push([]);
  }

  return plugins;
}
