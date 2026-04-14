import { rehypeAccessibleEmojis } from "rehype-accessible-emojis";
import rehypeUnwrapImages from "rehype-unwrap-images";
import remarkComment from "remark-comment";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import rehypeCodeBlocks from "./rehype-code-blocks";
import rehypeInlineBadges from "./rehype-inline-badges";
import remarkFixClassname from "./remark-class-names";
import remarkComponentCheck from "./remark-component-check";
import remarkUndeclaredVariables from "./remark-undeclared-variables";

type PluginOptions = {
  components?: Array<string>;
  codeHike?: boolean;
  math?: boolean;
};

export function getRemarkPlugins(options?: PluginOptions): PluggableList {
  const plugins = [
    remarkComponentCheck(options?.components ?? []),
    remarkUndeclaredVariables,
    remarkGfm,
    remarkComment,
    remarkFixClassname,
  ];

  if (options?.codeHike) {
    return plugins;
  }

  return plugins;
}

export function getRehypePlugins(options?: PluginOptions): PluggableList {
  const plugins = [
    rehypeUnwrapImages,
    rehypeCodeBlocks,
    rehypeInlineBadges,
    rehypeAccessibleEmojis,
  ];

  if (options?.codeHike) {
    return plugins;
  }

  return plugins;
}
