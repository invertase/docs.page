import { serialize } from '@invertase/next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

import { MDXRemoteSerializeResult } from '@invertase/next-mdx-remote/dist/types';
import { HeadingNode, PageContent } from './content';
import { headerDepthToHeaderList } from './index';
import rehypeCodeBlocks from '../mdx/plugins/rehype-code-blocks';
import rehypeHeadings from '../mdx/plugins/rehype-headings';

interface SerializationResponse {
  source: MDXRemoteSerializeResult;
  headings: HeadingNode[];
  error?: Error;
}

export async function mdxSerialize(content: PageContent): Promise<SerializationResponse> {
  const response: SerializationResponse = {
    source: null,
    headings: [],
  };

  try {
    response.source = await serialize(content.markdown, {
      mdxOptions: {
        remarkPlugins: [
          // Support GitHub flavoured markdown
          remarkGfm,
          // Ensure any `img` tags are not wrapped in `p` tags
          remarkUnwrapImages,
          // Convert any admonition to HTML
          // TODO(ehesp): Not compatible with new MDX version: https://github.com/elviswolcott/remark-admonitions/issues/27
          // remarkAdmonitions,
        ],
        rehypePlugins: [
          rehypeCodeBlocks,
          // Convert `pre` blogs into prism formatting
          rehypeHighlight,
          // Add an `id` to all heading tags
          rehypeSlug,
          [
            rehypeHeadings,
            {
              headings: headerDepthToHeaderList(content.config.headerDepth),
              callback: (headings: HeadingNode[]) => (response.headings = headings),
            },
          ],
          // Make emojis accessible
          rehypeAccessibleEmojis,
        ],
      },
    });
  } catch (e) {
    console.log(e);
    response.error = e;
  }

  return response;
}
