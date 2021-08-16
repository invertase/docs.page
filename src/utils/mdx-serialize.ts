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
      esbuildOptions(options) {
        return options;
      }
    });
    response.source = result.code;
  } catch (e) {
    console.log('HERE:',e.errors)
    const errors = e.errors
    const lines = content.markdown.split('\n');

    response.errors = await Promise.all(
      errors.map(async (error) => {
        const message = error?.detail?.reason || error?.text || "no message found";
        const line = error.detail.line || error.location.line || 0;
        console.log(line,'balblalafgasdf');
        
        const start = Math.max(line - 2, 0);
        const end = Math.min(line + 2, lines.length);
        console.log(start,end,'blabla')
        let offendingCode = null;
        try {          
          offendingCode = await createDebugBlock(lines, start, end);
        }
        catch (e) {
        }

        return {
          message,
          line,
          column: error?.detail?.column || error.location.column || 0,
          src: offendingCode || null,
          start,
          end,
        };
      }),
    );
    return response;
  }

  async function createDebugBlock(lines, start, end) {

    console.log(start,end)
    const wrappedSrc = '```' + lines.slice(start, end).join(' \n') + '```'
    console.log('wrapped',wrappedSrc);
    
    return (
      await bundleMDX(wrappedSrc, {
        xdmOptions(options) {
          // @ts-ignore TODO fix types
          options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

          return options;
        },
      })
    ).code;
  }
  console.log('we compiled:', response)
  return response;
}
