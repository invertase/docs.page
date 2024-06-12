import { compile } from '@mdx-js/mdx';
import type { Message } from 'esbuild';
import frontmatter from 'gray-matter';
import { getRehypePlugins, getRemarkPlugins } from './plugins/index';
import rehypeHeadings, { type HeadingNode } from './plugins/rehype-headings';

type MdxResponse = {
  code: string;
  frontmatter: Record<string, unknown>;
  errors: Message[];
  headings: HeadingNode[];
};

export function headerDepthToHeaderList(depth: number): string[] {
  const list: string[] = [];
  if (depth === 0) return list;

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export async function parseMdx(
  rawText: string,
  options: {
    headerDepth: number;
  },
): Promise<MdxResponse> {
  const output = {
    headings: [] as HeadingNode[],
    frontmatter: {} as { [key: string]: string },
  };

  const parsed = frontmatter(rawText);
  output.frontmatter = parsed.data;

  const vfile = await compile(parsed.content, {
    // prevent this error `_jsxDEV is not a function`
    // enable next line
    // development: process.env.NODE_ENV === 'production',
    format: 'mdx',
    outputFormat: 'function-body',
    remarkPlugins: getRemarkPlugins(),
    rehypePlugins: [
      ...getRehypePlugins(),
      [
        rehypeHeadings,
        {
          headings: headerDepthToHeaderList(options.headerDepth),
          callback: (headings: HeadingNode[]) => {
            output.headings = headings;
          },
        },
      ],
    ],
  });

  return {
    code: String(vfile),
    frontmatter: output.frontmatter,
    errors: [],
    headings: output.headings,
  };
}
