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
import remarkComponentCheck from '../mdx/plugins/remark-component-check';
import remarkUndeclaredVariables from '../mdx/plugins/remark-undeclared-variables';
import { IWarning } from './warning';
interface SerializationResponse {
  source: string;
  headings: HeadingNode[];
  errors?: {
    line?: number;
    column?: number;
    message?: string;
    start?: number;
    end?: number;
  }[];
  warnings?: IWarning[];
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
    warnings: [],
  };

  const remarkPlugins = [
    // Checks for undefined components, converts them to text:
    [
      remarkComponentCheck,
      {
        callback: warning => {
          response.warnings.push(warning);
        },
      },
    ],
    // Checks for undeclared variables, converts them to text:
    [
      remarkUndeclaredVariables,
      {
        callback: warning => {
          response.warnings.push(warning);
        },
      },
    ],
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

  async function createDebugBlock(lines, start, end) {
    const wrappedSrc = '``` \n ' + lines.slice(start, end).join(' \n') + '\n ```';
    // const wrappedSrc = 'Hello world'
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

  const createDebug = async (errors, markdown) => {
    const lines = markdown.split('\n');

    return await Promise.all(
      errors.map(async error => {
        const message = error?.text || error?.detail?.reason || 'no message found';
        const line = error.detail.line || error.location.line || 0;
        const start = Math.max(line - 2, 0);
        const end = Math.min(line + 2, lines.length);
        let offendingCode = null;
        try {
          offendingCode = await createDebugBlock(lines, start, end);
        } catch (e) {
          offendingCode = null;
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
  };

  try {
    const result = await bundleMDX(content.markdown, {
      xdmOptions(options) {
        // @ts-ignore TODO fix types
        options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
        // @ts-ignore TODO fix types
        options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

        return options;
      },
    });
    response.source = result.code;
  } catch (e) {
    response.errors = await createDebug(e.errors, content.markdown);
    return response;
  }
  return response;
}
