import { bundleMDX } from 'mdx-bundler';
import { Message } from 'esbuild';
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
  const output: { headings: HeadingNode[] } = {
    headings: [],
  };

  const { code, frontmatter, errors } = await bundleMDX({
    source: rawText,
    mdxOptions(options) {
      // @ts-ignore TODO fix types
      options.remarkPlugins = [...(options.remarkPlugins ?? []), ...bundleOptions.remarkPlugins];
      // @ts-ignore TODO fix types
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
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
      ];

      return options;
    },
  });
  return {
    code,
    frontmatter,
    errors,
    headings: output.headings,
  };
}
