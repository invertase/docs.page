import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkGfm from 'remark-gfm';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import { bundleMDX } from 'mdx-bundler';

import { HeadingNode, PageContent } from './content';
import { headerDepthToHeaderList } from './index';
import rehypeCodeBlocks from '../mdx/plugins/rehype-code-blocks';
import rehypeHeadings from '../mdx/plugins/rehype-headings';
import rehastUndeclaredVariables from '../mdx/plugins/remark-undeclared-variables';
import { ISerializationError } from './error';
interface SerializationResponse {
  source: string;
  headings: HeadingNode[];
  errors?: ISerializationError[];
}

// https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
process.env.ESBUILD_BINARY_PATH = path.join(
  process.cwd(),
  'node_modules',
  'esbuild',
  'bin',
  'esbuild',
);

export async function mdxSerialize(content: PageContent): Promise<SerializationResponse> {
  const response: SerializationResponse = {
    source: null,
    headings: [],
  };

  const remarkPlugins = [
    // Convert undeclared variables to strings
    rehastUndeclaredVariables,
    // Support GitHub flavoured markdown
    remarkGfm,
    // Ensure any `img` tags are not wrapped in `p` tags
    remarkUnwrapImages,
  ];

  const rehypePlugins = [
    rehypeCodeBlocks,
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
  ];

  try {
    const result = await bundleMDX(content.markdown, {
      xdmOptions(options) {
        options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
        // @ts-ignore TODO fix types
        options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

        return options;
      },
    });
    response.source = result.code;
  } catch ({ errors }) {
    const lines = content.markdown.split('\n');

    response.errors = await Promise.all(
      errors.map(async ({ detail: { message, line, column } }) => {
        const start = Math.max(line - 4, 0);
        const end = Math.min(line + 3, lines.length);

        const offendingCode = await createDebugBlock(lines, start, end);

        return {
          message,
          line,
          column,
          src: offendingCode,
          start,
          end,
        };
      }),
    );
    return response;
  }

  async function createDebugBlock(lines, start, end) {
    return (
      await bundleMDX('```' + lines.slice(start, end).join(' \n') + '```', {
        xdmOptions(options) {
          // @ts-ignore TODO fix types
          options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

          return options;
        },
      })
    ).code;
  }
  return response;
}
