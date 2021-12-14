import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";

export const pluginMap: Record<string, any> = {
  "remark-parse": [remarkParse],
  "remark-gfm": [remarkGfm],
  "rehype-slug": [rehypeSlug],
};

export function getPlugins(pluginNames: string[] | null): any {
  return pluginNames
    ? pluginNames.map((pluginName) => pluginMap[pluginName])
    : [];
}
