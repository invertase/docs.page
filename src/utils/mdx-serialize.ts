import { serialize } from '@invertase/next-mdx-remote/serialize';
import rehypeSlug from 'rehype-slug';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeHighlight from 'rehype-highlight';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';

import { PageContent } from './content';
import { headerDepthToHeaderList } from './index';
// import rehypeCodeBlocks from '../../plugins/rehype-code-blocks';
import rehypeHeadings from '../mdx/plugins/rehype-headings';
// import remarkSanitizeJsx from '../../plugins/remark-sanitize-jsx';

interface SerializationResponse {
  source: any;
  headings: Record<string, string>[];
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
          // Sanitize any JSX nodes within MD
          // remarkSanitizeJsx,
          // Ensure any `img` tags are not wrapped in `p` tags
          remarkUnwrapImages,
          // Convert any admonition to HTML
          // TODO(ehesp): Not compatible with new MDX version: https://github.com/elviswolcott/remark-admonitions/issues/27
          // remarkAdmonitions,
        ],
        rehypePlugins: [
          // rehypeCodeBlocks,
          // Convert `pre` blogs into prism formatting
          rehypeHighlight,
          // Add an `id` to all heading tags
          rehypeSlug,
          // If the table of contents is enabled for this page,
          // gather the headings for the current page
          content.frontmatter.tableOfContents
            ? [
                rehypeHeadings,
                {
                  headings: headerDepthToHeaderList(content.config.headerDepth),
                  callback: (headings: Record<string, string>[]) => (response.headings = headings),
                },
              ]
            : [],
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
