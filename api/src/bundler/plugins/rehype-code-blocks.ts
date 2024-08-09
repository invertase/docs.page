import type { Element } from "hast";
import { toString } from "mdast-util-to-string";
import * as shiki from "shiki";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

let highlighter: shiki.Highlighter;

const languages: Record<string, string> = {
  "": "text",
  gradle: "groovy",
};

for (const lang of shiki.bundledLanguagesInfo) {
  languages[lang.id] = lang.id;
  for (const alias of lang.aliases || []) {
    languages[alias] = lang.id;
  }
}

const cssVariablesTheme = shiki.createCssVariablesTheme({
  name: "css-variables",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

export default function rehypeCodeBlocks(): (ast: Node) => void {
  function visitor(node: Element, _i: number, parent: Element) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
      return;
    }

    const raw = toString(node);
    const blockLanguage = getLanguage(node) || "";
    const languageActual: string = languages[blockLanguage] || "text";
    if (!parent.properties) parent.properties = {};
    parent.properties.raw = raw; // Used to support copy/paste functionality,
    parent.properties.language = languageActual;
    parent.properties.html = highlighter.codeToHtml(raw, {
      lang: languageActual,
      theme: "css-variables",
    });
    const meta = (node.data?.meta as string) ?? "";
    const title = extractTitle(meta);
    if (title) parent.properties.title = title;
  }
  return async (ast: Node): Promise<void> => {
    if (!highlighter) {
      highlighter = await shiki.getHighlighter({
        langs: Array.from(new Set(Object.values(languages))),
        themes: [cssVariablesTheme],
      });
    }
    visit(ast, "element", visitor);
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

  const title = Object.values(match.groups ?? []).find(
    (value) => value !== undefined,
  );
  return title || null;
}

// Get the programming language of `node`.
function getLanguage(node: Element): string | undefined {
  const className: string[] = (node.properties?.className as string[]) || [];
  let index = -1;
  let value: string;
  while (++index < className.length) {
    value = className[index];

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
