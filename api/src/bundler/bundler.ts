import { compile } from '@mdx-js/mdx';
import { Message } from 'esbuild';
import frontmatter from 'gray-matter';
import rehypeHeadings, { HeadingNode } from './plugins/rehype-headings.js';

type MdxBundlerResponse = {
  code: string;
  frontmatter: {
    // @ts-ignore TODO fix types
    [key: string]: string;
  };
  errors: Message[];
  headings: HeadingNode[];
};

// TODO - codehike types don't match other plugins
type BundlerOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remarkPlugins: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rehypePlugins: any;
  headerDepth: number;
};

export function headerDepthToHeaderList(depth: number): string[] {
  const list: string[] = [];
  if (depth === 0) return list;

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export async function bundle(
  rawText: string,
  bundleOptions: BundlerOptions = {
    remarkPlugins: [],
    rehypePlugins: [],
    headerDepth: 3,
  },
): Promise<MdxBundlerResponse> {
  const output = {
    headings: [] as HeadingNode[],
    frontmatter: {} as { [key: string]: string },
  };

  const parsed = frontmatter(rawText);
  output.frontmatter = parsed.data;

  let code = '';

  try {
    const vfile = await compile(parsed.content, {
      format: 'mdx',
      outputFormat: 'function-body',
      remarkPlugins: [...bundleOptions.remarkPlugins],
      rehypePlugins: [
        ...bundleOptions.rehypePlugins,
        [
          rehypeHeadings,
          {
            headings: headerDepthToHeaderList(bundleOptions.headerDepth),
            callback: (headings: HeadingNode[]) => {
              output.headings = headings;
            },
          },
        ],
      ],
    });

    code = String(vfile);
  } catch (error) {
    console.error(error);
  }

  return {
    code,
    frontmatter: output.frontmatter,
    errors: [],
    headings: output.headings,
  };
}
