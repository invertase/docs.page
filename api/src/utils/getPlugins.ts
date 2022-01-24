import { theme } from '../utils/plugins/codeHikeTheme.js';
import { remarkCodeHike } from '@code-hike/mdx';
import remarkGfm from 'remark-gfm';
import rehypeCodeBlocks from '../utils/plugins/rehype-code-blocks.js';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeInlineBadges from '../utils/plugins/rehype-inline-badges.js';
import rehypeSlug from 'rehype-slug';

function getPlugins(config: Record<string, any>) {
  const remarkPlugins = config?.experimentalCodehike
    ? [remarkGfm, [remarkCodeHike, { theme, lineNumbers: true }]]
    : [remarkGfm];

  const rehypePlugins = config?.experimentalCodehike
    ? [rehypeSlug, rehypeInlineBadges, rehypeAccessibleEmojis]
    : [rehypeCodeBlocks, rehypeSlug, rehypeInlineBadges, rehypeAccessibleEmojis];

  // if (config?.experimentalMath) {
  //   //@ts-ignore
  //   remarkPlugins.push(remarkMath);
  //   rehypePlugins.push(rehypeKatex);
  // }
  return { remarkPlugins, rehypePlugins };
}

export { getPlugins };
