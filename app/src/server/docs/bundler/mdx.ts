import { compile } from "@mdx-js/mdx";
import frontmatter from "gray-matter";
import rehypeSlug from "rehype-slug";
import { getRehypePlugins, getRemarkPlugins } from "./plugins";
import rehypeHeadings, { type HeadingNode } from "./plugins/rehype-headings";

type MdxResponse = {
  code: string;
  frontmatter: Record<string, unknown>;
  headings: HeadingNode[];
};

export function headerDepthToHeaderList(depth: number): string[] {
  const list: string[] = [];

  if (depth === 0) {
    return list;
  }

  for (let i = 2; i <= depth; i++) {
    list.push(`h${i}`);
  }

  return list;
}

export async function parseMdx(
  rawText: string,
  options: {
    headerDepth: number;
    components: Array<string>;
  },
): Promise<MdxResponse> {
  const output = {
    headings: [] as HeadingNode[],
    frontmatter: {} as Record<string, unknown>,
  };

  const parsed = frontmatter(rawText);
  output.frontmatter = parsed.data;

  const vfile = await compile(parsed.content, {
    format: "mdx",
    outputFormat: "function-body",
    remarkPlugins: getRemarkPlugins({
      components: options.components,
    }),
    rehypePlugins: [
      ...getRehypePlugins(),
      rehypeSlug,
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
    headings: output.headings,
  };
}
