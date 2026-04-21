import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRemoveNotationEscape,
} from "@shikijs/transformers";
import type { Element } from "hast";
import { toString } from "mdast-util-to-string";
import * as shiki from "shiki";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

let highlighter: shiki.HighlighterGeneric<never, never> | undefined;

const languages: Record<string, string> = {
  "": "text",
  gradle: "groovy",
};

for (const language of Object.keys(shiki.bundledLanguages)) {
  languages[language] = language;
}

const cssVariablesTheme = shiki.createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

export default function rehypeCodeBlocks(): (ast: Node) => Promise<void> {
  function visitor(node: Element, _index: number | undefined, parent: Element | undefined) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code" || !highlighter) {
      return;
    }

    const raw = toString(node);
    const blockLanguage = getLanguage(node) || "";
    const languageActual = languages[blockLanguage] || "text";

    if (!parent.properties) {
      parent.properties = {};
    }

    parent.properties.raw = raw;
    parent.properties.language = languageActual;

    const transformers = [
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerRemoveNotationEscape(),
      transformerNotationFocus(),
      transformerMetaHighlight(),
    ];

    parent.properties.html = highlighter.codeToHtml(raw, {
      lang: languageActual,
      theme: "css-variables",
      transformers,
    });

    const meta = (node.data?.meta as string) ?? "";
    const title = extractTitle(meta);

    if (title) {
      parent.properties.title = title;
    }
  }

  return async (ast: Node): Promise<void> => {
    if (!highlighter) {
      highlighter = await shiki.createHighlighter({
        langs: Array.from(new Set(Object.values(languages))),
        themes: [cssVariablesTheme],
      });
    }

    visit(ast, "element", visitor);
  };
}

function extractTitle(meta: string): string | null {
  const match = /(?:title="(.*)"|title='(.*)'|title=(.*?)\s|title=(.*?)$)/gm.exec(meta);

  if (!match) {
    return null;
  }

  const title = match.slice(1).find((value) => value !== undefined);
  return title || null;
}

function getLanguage(node: Element): string | undefined {
  const className = (node.properties?.className as string[]) || [];

  for (const value of className) {
    if (value === "no-highlight" || value === "nohighlight") {
      return undefined;
    }

    if (value.slice(0, 5) === "lang-") {
      return value.slice(5);
    }

    if (value.slice(0, 9) === "language-") {
      return value.slice(9);
    }
  }
}
