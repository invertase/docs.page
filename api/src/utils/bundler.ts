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
  bundleOptions: any = {
    remarkPlugins: [],
    rehypePlugins: [],
    headerDepth: 3,
  },
): Promise<MdxBundlerResponse> {
  const output = {
    headings: [],
  };

  const { code, frontmatter, errors } = await bundleMDX({
    source: rawText,
    xdmOptions(options: any) {
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
            callback: (headings: any) => {
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
