import type { PluggableList } from '@mdx-js/mdx/lib/core';

// Remark Plugins
import remarkGfm from 'remark-gfm';
import remarkComment from 'remark-comment';
import remarkComponentCheck from './remark-component-check.js';
import remarkUndeclaredVariables from './remark-undeclared-variables.js';
// import { remarkCodeHike } from '@code-hike/mdx';
// import { theme as codeHikeTheme } from './codeHikeTheme.js';

// Rehype Plugins
import rehypeSlug from 'rehype-slug';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeCodeBlocks from './rehype-code-blocks.js';
import rehypeInlineBadges from './rehype-inline-badges.js';

type PluginOptions = {
  codeHike?: boolean;
  math?: boolean;
};

export function getRemarkPlugins(options?: PluginOptions): PluggableList {
  const plugins = [remarkComponentCheck, remarkUndeclaredVariables, remarkGfm, remarkComment];

  if (options?.codeHike) {
    // plugins.push([remarkCodeHike, { theme: codeHikeTheme, lineNumbers: true }]);
  }

  return plugins;
}

export function getRehypePlugins(options?: PluginOptions): PluggableList {
  const plugins = [rehypeCodeBlocks, rehypeSlug, rehypeInlineBadges, rehypeAccessibleEmojis];

  if (options?.codeHike) {
    // plugins.push([]);
  }

  return plugins;
}
