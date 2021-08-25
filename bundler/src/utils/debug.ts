import {bundleMDX} from 'mdx-bundler'
import rehypeHeadings from './plugins/rehype-headings.js';
import remarkComponentCheck from './plugins/remark-component-check.js';
import remarkUndeclaredVariables from './plugins/remark-undeclared-variables.js';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from "remark-unwrap-images";
import rehypeSlug from 'rehype-slug';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import path from 'path';


interface Warning {
    line: number;
    column: number;
    message: number
}
interface Error {
    line: number;
    column: number;
    message: number
}

interface Heading {
    id: string,
    title: string,
    rank: number
}

export const _debug = async (mdx: string) => {

    let response = {
        warnings: [],
        errors: [],
        headings: [],
        code: ''
    }
    const remarkPlugins = [
        // Checks for undefined components, converts them to text:
        [
          remarkComponentCheck,
          {
            callback: response.warnings.push
          },
        ],
        // Checks for undeclared variables, converts them to text:
        [
          remarkUndeclaredVariables,
          {
            callback: response.warnings.push
          },
        ],
        // Support GitHub flavoured markdown
        remarkGfm,
        // Ensure any `img` tags are not wrapped in `p` tags
        remarkUnwrapImages,
      ];
    
      const rehypePlugins = [
        // rehypeCodeBlocks,
        // Add an `id` to all heading tags
        rehypeSlug,
        [
          rehypeHeadings,
          {
            headings: headerDepthToHeaderList(2),
            callback: (headings : any) => {response.headings = headings},
          },
        ],
        // Make emojis accessible
        rehypeAccessibleEmojis,
      ];
    






    try {
        const bundled = await bundleMDX(mdx, {
            xdmOptions(options) {
                // @ts-ignore TODO fix types
                options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
                // @ts-ignore TODO fix types
                options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];
        
                return options;
          },
        });
        response.code = bundled.code
    } catch (e) {
        response.errors = e
    }
    return response;
}

export function headerDepthToHeaderList(depth: number): string[] {
    const list : string[] = [];
    if (depth === 0) return list;
  
    for (let i = 2; i <= depth; i++) {
      list.push(`h${i}`);
    }
  
    return list;
  }