import { theme } from '../utils/plugins/codeHikeTheme.js';
import { remarkCodeHike } from '@code-hike/mdx';
import remarkGfm from 'remark-gfm';
import rehypeCodeBlocks from '../utils/plugins/rehype-code-blocks.js';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeInlineBadges from '../utils/plugins/rehype-inline-badges.js';
import rehypeSlug from 'rehype-slug';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { OutputConfig } from '@docs.page/server';

function getPlugins(config: OutputConfig) {
  //
  const remarkPlugins = config?.experimentalCodehike
    ? [remarkGfm, [remarkCodeHike, { theme, lineNumbers: true }]]
    : [remarkGfm];

  const rehypePlugins = config?.experimentalCodehike
    ? [rehypeSlug, rehypeInlineBadges, rehypeAccessibleEmojis]
    : [rehypeCodeBlocks, rehypeSlug, rehypeInlineBadges, rehypeAccessibleEmojis];

  if (config?.experimentalMath) {
    //@ts-ignore
    remarkPlugins.push(remarkMath);
    rehypePlugins.push(rehypeKatex);
  }
  return { remarkPlugins, rehypePlugins };
}

export { getPlugins };
