import serialize from 'next-mdx-remote/serialize';
import { PageContent } from './content';

import { headerDepthToHeaderList } from './index';

const rehypePrism = require('../../rehype-prism');
const rehypeSlug = require('rehype-slug');
const rehypeToc = require('@jsdevtools/rehype-toc');
const rehypeAccessibleEmojis = require('rehype-accessible-emojis').rehypeAccessibleEmojis;

const remarkSanitizeJsx = require('../../remark-sanitize-jsx');
const remarkUnwrapImages = require('remark-unwrap-images');
const remarkAdmonitions = require('remark-admonitions');

interface SerializationResponse {
  source: any;
  error?: Error;
}

export async function mdxSerialize(page: PageContent): Promise<SerializationResponse> {
  const response: SerializationResponse = {
    source: null,
  };

  try {
    response.source = await serialize(page.content, {
      mdxOptions: {
        rehypePlugins: [
          // Convert `pre` blogs into prism formatting
          rehypePrism,
          // Add an `id` to all heading tags
          rehypeSlug,
          // Create a table of contents above the page
          page.frontmatter.tableOfContents
            ? [
                rehypeToc,
                {
                  headings: headerDepthToHeaderList(page.config.headerDepth),
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
