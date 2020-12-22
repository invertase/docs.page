import serialize from 'next-mdx-remote/serialize';
import { PageContent } from './content';

import { headerDepthToHeaderList } from './index';

const rehypeCodeBlocks = require('../../plugins/rehype-code-blocks');
const rehypeHeadings = require('../../plugins/rehype-headings');
const rehypeSlug = require('rehype-slug');
const rehypeAccessibleEmojis = require('rehype-accessible-emojis').rehypeAccessibleEmojis;

const remarkSanitizeJsx = require('../../plugins/remark-sanitize-jsx');
const remarkUnwrapImages = require('remark-unwrap-images');
const remarkAdmonitions = require('remark-admonitions');
interface SerializationResponse {
  source: any;
  headings: object[];
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
        rehypePlugins: [
          // Convert `pre` blogs into prism formatting
          rehypeCodeBlocks,
          // Add an `id` to all heading tags
          rehypeSlug,
          // If the table of contents is enabled for this page,
          // gather the headings for the current page
          content.frontmatter.tableOfContents
            ? [
                rehypeHeadings,
                {
                  headings: headerDepthToHeaderList(content.config.headerDepth),
                  callback: (headings: object[]) => (response.headings = headings),
                },
              ]
            : [],
          // Make emojis accessible
          rehypeAccessibleEmojis,
        ],
        remarkPlugins: [
          // Sanitize any JSX nodes within MD
          remarkSanitizeJsx,
          // Ensure any `img` tags are not wrapped in `p` tags
          remarkUnwrapImages,
          // Convert any admonition to HTML
          remarkAdmonitions,
        ],
      },
    });
  } catch (e) {
    console.log(e);
    response.error = e;
  }

  return response;
}
