import { visit } from 'unist-util-visit';
import type { Node } from 'hast-util-heading-rank/lib';
import { toString } from 'mdast-util-to-string';
import * as shiki from 'shiki';

let highlighter: shiki.Highlighter;

// Returns an object of supported languages.
const languages = shiki.BUNDLED_LANGUAGES.reduce(
  (map, lang) => {
    const out = { [lang.id]: lang.id };
    for (const alias of lang.aliases || []) out[alias] = lang.id;
    return { ...map, ...out };
  },
  { '': 'text' } as Record<string, string>,
);

/**
 * Matches any `pre code` elements and extracts the raw code and titles from the code block and assigns to the parent.
 * @returns
 */
export default function rehypeCodeBlocks(): (ast: Node) => void {
  function visitor(node: any, _i: number, parent: any) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const raw = toString(node);
    const language = languages[getLanguage(node) || ''];

    // Raw value of the `code` block - used for copy/paste
    parent.properties['raw'] = raw;
    parent.properties['language'] = language;
    parent.properties['html'] = highlighter.codeToHtml(raw, {
      lang: language,
    });

    // Get any metadata from the code block
    const meta = (node.data?.meta as string) ?? '';

    const title = extractTitle(meta);
    if (title) parent.properties['title'] = title;
  }

  return async (ast: Node): Promise<void> => {
    highlighter = await shiki.getHighlighter({
      theme: 'css-variables',
    });
    // @ts-ignore
    visit(ast, 'element', visitor);
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
