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
import axios from 'axios';
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

// export async function mdxSerialize(content: PageContent): Promise<SerializationResponse> {
//   const response: SerializationResponse = {
//     source: null,
//     headings: [],
//     warnings: [],
//   };

//   const res = await axios({
//     method: 'post',
//     url: `http://localhost:8000/bundle?headerDepth=${content.config.headerDepth}`,
//     data: {body: content.markdown}
//   });
//   console.log(res);

//   return response
// }

export async function mdxSerialize(content: PageContent): Promise<SerializationResponse> {
  const response: SerializationResponse = {
    source: null,
    errors: null,
    headings: [],
    warnings: [],
  };

  // const remarkPlugins = [
  //   // Checks for undefined components, converts them to text:
  //   [
  //     remarkComponentCheck,
  //     {
  //       callback: warning => {
  //         response.warnings.push(warning);
  //       },
  //     },
  //   ],
  //   // Checks for undeclared variables, converts them to text:
  //   [
  //     remarkUndeclaredVariables,
  //     {
  //       callback: warning => {
  //         response.warnings.push(warning);
  //       },
  //     },
  //   ],
  //   // Support GitHub flavoured markdown
  //   remarkGfm,
  //   // Ensure any `img` tags are not wrapped in `p` tags
  //   remarkUnwrapImages,
  // ];

  // const rehypePlugins = [
  //   rehypeCodeBlocks,
  //   // Add an `id` to all heading tags
  //   rehypeSlug,
  //   [
  //     rehypeHeadings,
  //     {
  //       headings: headerDepthToHeaderList(content.config.headerDepth),
  //       callback: (headings: HeadingNode[]) => (response.headings = headings),
  //     },
  //   ],
  //   // Make emojis accessible
  //   rehypeAccessibleEmojis,
  // ];

  // async function createDebugBlock(lines, start, end) {
  //   const wrappedSrc = '``` \n ' + lines.slice(start, end).join(' \n') + '\n ```';
  //   // const wrappedSrc = 'Hello world'
  //   return (
  //     await bundleMDX(wrappedSrc, {
  //       xdmOptions(options) {
  //         // @ts-ignore TODO fix types
  //         options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

  //         return options;
  //       },
  //     })
  //   ).code;
  // }

  // const createDebug = async (errors, markdown) => {
  //   const lines = markdown.split('\n');

  //   return await Promise.all(
  //     errors.map(async error => {
  //       const message = error?.text || error?.detail?.reason || 'no message found';
  //       const line = error.detail.line || error.location.line || 0;
  //       const start = Math.max(line - 2, 0);
  //       const end = Math.min(line + 2, lines.length);
  //       let offendingCode = null;
  //       try {
  //         offendingCode = await createDebugBlock(lines, start, end);
  //       } catch (e) {
  //         offendingCode = null;
  //       }

  //       return {
  //         message,
  //         line,
  //         column: error?.detail?.column || error.location.column || 0,
  //         src: offendingCode || null,
  //         start,
  //         end,
  //       };
  //     }),
  //   );
  // };

  // try {
  //   const result = await bundleMDX(content.markdown, {
  //     xdmOptions(options) {
  //       // @ts-ignore TODO fix types
  //       options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
  //       // @ts-ignore TODO fix types
  //       options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

  //       return options;
  //     },
  //   });
  //   response.source = result.code;
  // } catch (e) {
  //   // response.errors = await createDebug(e.errors, content.markdown);
  //   return response;
  // }

  const res = await axios.post(
    `http://localhost:8000/bundle?headerDepth=${content.config.headerDepth}`,
    content.markdown,
    { headers: { 'Content-Type': 'text/plain' } },
  );
  response.source = res?.data?.bundled?.code;
  if (res?.data?.status === 500) {
    // response.errors = res?.data?.errors
    const debug = await axios.post(`http://localhost:8000/debug`, content.markdown, {
      headers: { 'Content-Type': 'text/plain' },
    });
    console.log(debug);

    response.source = debug?.data?.bundled?.code;
    response.errors = res?.data?.bundled?.errors || [
      {
        column: '??',
        message: 'Undetermined Error. Check all JSX tags are closed',
        line: debug?.data?.line,
        start: debug?.data?.line,
        emd: debug?.data?.line,
        leftOver: debug?.data.leftOver || null
      },
    ];
  }

  return response;
}
