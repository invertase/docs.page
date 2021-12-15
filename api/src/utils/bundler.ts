import { bundleMDX } from 'mdx-bundler';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeHeadings, { HeadingNode } from './plugins/rehype-headings.js';
import rehypeInlineBadges from './plugins/rehype-inline-badges.js';
import remarkComponentCheck from './plugins/remark-component-check.js';
import remarkUndeclaredVariables from './plugins/remark-undeclared-variables.js';
import { Message } from 'esbuild';

type MdxBundlerResponse = {
  code: string;
  frontmatter: {
    [key: string]: any;
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
    // warnings: [],
    headings: [],
  };
  const defaultRemarkPlugins = [
    // Checks for undefined components, converts them to text:
    [
      remarkComponentCheck,
      {
        callback: () => {},
      },
    ],
    // // Checks for undeclared variables, converts them to text:
    [
      remarkUndeclaredVariables,
      {
        callback: () => {},
        // callback: output.warnings.push.bind(output.warnings),
      },
    ],
    // Support GitHub flavoured markdown
    remarkGfm,
    // Ensure any `img` tags are not wrapped in `p` tags
  ];

  const defaultRehypePlugins = [
    // rehypeCodeBlocks,
    // Add an `id` to all heading tags
    rehypeSlug,
    rehypeInlineBadges,
    [
      rehypeHeadings,
      {
        headings: headerDepthToHeaderList(bundleOptions.headerDepth),
        callback: (headings: any) => {
          output.headings = headings;
        },
      },
    ],
    // Make emojis accessible
    rehypeAccessibleEmojis,
  ];

  console.log('plugins', bundleOptions.rehypePlugins.length);

  const { code, frontmatter, errors } = await bundleMDX({
    source: rawText,
    xdmOptions(options: any) {
      // @ts-ignore TODO fix types
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        ...(bundleOptions.remarkPlugins.length > 0
          ? bundleOptions.remarkPlugins
          : defaultRemarkPlugins),
      ];
      // @ts-ignore TODO fix types
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        ...(bundleOptions.rehypePlugins.length > 0
          ? bundleOptions.rehypePlugins
          : defaultRehypePlugins),
      ];

      return options;
    },
  });
  console.log('headings::', output.headings);

  return {
    code,
    frontmatter,
    errors,
    headings: output.headings,
  };
}
