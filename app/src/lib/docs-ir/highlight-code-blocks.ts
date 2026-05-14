import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerRemoveNotationEscape,
} from "@shikijs/transformers";
import * as shiki from "shiki";
import type { DocIrNode } from "./types";

let highlighter: shiki.Highlighter | undefined;

const cssVariablesTheme = shiki.createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

const languages: Record<string, string> = {
  "": "text",
  gradle: "groovy",
  nohighlight: "text",
  "no-highlight": "text",
};

for (const lang of shiki.bundledLanguagesInfo) {
  languages[lang.id] = lang.id;
  for (const alias of lang.aliases ?? []) {
    languages[alias] = lang.id;
  }
}

const transformers = [
  transformerNotationDiff(),
  transformerNotationHighlight(),
  transformerRemoveNotationEscape(),
  transformerNotationFocus(),
  transformerMetaHighlight(),
];

export async function highlightCodeBlocksInIr(
  node: DocIrNode,
): Promise<DocIrNode> {
  switch (node.kind) {
    case "root":
      return {
        ...node,
        children: await Promise.all(node.children.map(highlightCodeBlocksInIr)),
      };
    case "component":
      return {
        ...node,
        children: await Promise.all(node.children.map(highlightCodeBlocksInIr)),
      };
    case "code": {
      const highlighted = await highlightCode(node.value, node.lang, node.meta);
      return {
        ...node,
        highlightedHtml: highlighted.html,
        highlightedLang: highlighted.lang,
        title: extractTitle(node.meta ?? "") ?? undefined,
      };
    }
    case "markdown":
    case "thematicBreak":
      return node;
  }
}

async function highlightCode(
  code: string,
  lang: string | undefined,
  meta: string | undefined,
) {
  const language = languageFor(lang);

  try {
    return {
      html: await codeToHtml(code, language, meta),
      lang: language,
    };
  } catch {
    return {
      html: await codeToHtml(code, "text", meta),
      lang: "text",
    };
  }
}

async function codeToHtml(code: string, lang: string, meta: string | undefined) {
  const currentHighlighter = await getHighlighter();

  return currentHighlighter.codeToHtml(code, {
    lang,
    meta: { __raw: meta ?? "" },
    theme: "css-variables",
    transformers,
  });
}

async function getHighlighter() {
  if (highlighter) {
    return highlighter;
  }

  highlighter = await shiki.createHighlighter({
    langs: Array.from(new Set(Object.values(languages))),
    themes: [cssVariablesTheme],
  });

  return highlighter;
}

function languageFor(lang: string | undefined) {
  return languages[lang?.toLowerCase() ?? ""] ?? "text";
}

function extractTitle(meta: string): string | null {
  const match = /title=(?:"([^"]*)"|'([^']*)'|(\S+))/.exec(meta);

  if (!match) {
    return null;
  }

  const title = match.slice(1).find((value) => value !== undefined);
  return title || null;
}
