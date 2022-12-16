/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { visit } from 'unist-util-visit';
import { Node } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';
import * as shiki from 'shiki';
let highlighter: shiki.Highlighter;
//@ts-ignore
import mermaid from 'headless-mermaid';
//@ts-ignore
import { fromHtml } from 'hast-util-from-html';
/**
 * Matches any `pre code` elements and extracts the raw code and titles from the code block and assigns to the parent.
 * @returns
 */
export default function rehypeCodeBlocks(): (ast: Node) => void {

  return async (ast: Node): Promise<null> => {

    const promises: any[] = [];

    async function visitor(node: any, i: number, parent: any) {
      if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
        return;
      }

      const language = getLanguage(node);

      const raw = toString(node);

      if (language === 'mermaid') {

        const value = node.children[0].value;


        promises.push(mermaid.execute(value).then((svgResult: string) => {
          //@ts-ignore
          console.log(fromHtml(svgResult).children[0].children[1].children)
          //@ts-ignore
          const svgNode = fromHtml(svgResult).children[0].children[1].children[0];

          Object.assign(parent, svgNode);
        }))

        return;
      }

      // If the user provides the `console` language, we add the 'shell' language and remove $ from the raw code, for copying purposes.
      if (language === 'console') {
        const removedDollarSymbol = raw.replace(/^(^ *)\$/g, '');

        parent.properties['raw'] = removedDollarSymbol;
        parent.properties['html'] = highlighter.codeToHtml(raw, { lang: 'shell' });
      } else {
        parent.properties['raw'] = raw;
        parent.properties['html'] = highlighter.codeToHtml(raw, { lang: language });
      }

      // Get any metadata from the code block
      const meta = (node.data?.meta as string) ?? '';

      const title = extractTitle(meta);
      if (title) parent.properties['title'] = title;
    }

    highlighter = await shiki.getHighlighter({
      theme: 'github-dark',
    });
    // @ts-ignore
    visit(ast, 'element', visitor);

    await Promise.all(promises);
    return null;
  };
}

function extractTitle(meta: string): string | null {
  // https://regex101.com/r/4JngU0/1
  const match =
    /(?:title="(?<title1>.*)"|title='(?<title2>.*)'|title=(?<title3>.*?)\s|title=(?<title4>.*?)$)/gm.exec(
      meta,
    );

  if (!match) {
    return null;
  }

  const title = Object.values(match.groups ?? []).find(value => value !== undefined);
  return title || null;
}

// Get the programming language of `node`.
function getLanguage(node: any): string | undefined {
  const className = node.properties.className || [];
  let index = -1;
  let value: string;

  while (++index < className.length) {
    value = className[index];

    if (value === 'no-highlight' || value === 'nohighlight') {
      return undefined;
    }

    if (value.slice(0, 5) === 'lang-') {
      return value.slice(5);
    }

    if (value.slice(0, 9) === 'language-') {
      return value.slice(9);
    }
  }
}