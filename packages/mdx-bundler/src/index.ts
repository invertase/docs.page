import { compile } from "@mdx-js/mdx";
import frontmatter from "gray-matter";
import rehypeSlug from "rehype-slug";
import { getRehypePlugins, getRemarkPlugins } from "./plugins";
import rehypeHeadings, { type HeadingNode } from "./plugins/rehype-headings";

export type { HeadingNode } from "./plugins/rehype-headings";

export type ParseMdxOptions = {
  headerDepth: number;
  components: string[];
};

export type ParseMdxResult = {
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
  options: ParseMdxOptions,
): Promise<ParseMdxResult> {
  const output = {
    headings: [] as HeadingNode[],
    frontmatter: {} as Record<string, unknown>,
  };

  const parsed = frontmatter(rawText);
  output.frontmatter = parsed.data;

  const content = withLineNumbers(
    rawText,
    parsed.content,
  );

  const vfile = await compile(content, {
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

function withLineNumbers(rawText: string, content: string) {
  if (!rawText.endsWith(content)) {
    return content;
  }

  const removedPrefix = rawText.slice(0, rawText.length - content.length);
  const removedLineCount = countNewlines(removedPrefix);

  if (removedLineCount === 0) {
    return content;
  }

  return `${"\n".repeat(removedLineCount)}${content}`;
}

function countNewlines(value: string) {
  let count = 0;

  for (const character of value) {
    if (character === "\n") {
      count += 1;
    }
  }

  return count;
}