import { describe, expect, test } from "bun:test";
import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import {
  githubAlertTypeToComponent,
  tryParseGithubAlert,
} from "./github-alert";

type MdastNode = {
  type?: string;
  value?: string;
  lang?: string | null;
  children?: MdastNode[];
};

function parseBlockquote(source: string): MdastNode {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
  const blockquote = tree.children.find((child) => child.type === "blockquote");
  if (!blockquote) {
    throw new Error(`Expected blockquote in source: ${source}`);
  }
  return blockquote as MdastNode;
}

describe("githubAlertTypeToComponent", () => {
  test("maps supported GitHub alert types to callout components", () => {
    expect(githubAlertTypeToComponent("NOTE")).toBe("Info");
    expect(githubAlertTypeToComponent("note")).toBe("Info");
    expect(githubAlertTypeToComponent("TIP")).toBe("Success");
    expect(githubAlertTypeToComponent("IMPORTANT")).toBe("Warning");
    expect(githubAlertTypeToComponent("WARNING")).toBe("Warning");
    expect(githubAlertTypeToComponent("CAUTION")).toBe("Error");
  });

  test("returns null for unknown alert types", () => {
    expect(githubAlertTypeToComponent("UNKNOWN")).toBeNull();
    expect(githubAlertTypeToComponent("")).toBeNull();
  });
});

describe("tryParseGithubAlert", () => {
  test("parses a single-line NOTE alert", () => {
    const alert = tryParseGithubAlert(
      parseBlockquote("> [!NOTE]\n> Useful information."),
    );

    expect(alert?.componentName).toBe("Info");
    expect(alert?.bodyNodes).toHaveLength(1);
    expect(alert?.bodyNodes[0]?.type).toBe("paragraph");
    expect(alert?.bodyNodes[0]?.children?.[0]).toMatchObject({
      type: "text",
      value: "Useful information.",
    });
  });

  test("parses alerts with the marker on its own line", () => {
    const alert = tryParseGithubAlert(
      parseBlockquote("> [!NOTE]\n>\n> Second paragraph."),
    );

    expect(alert?.componentName).toBe("Info");
    expect(alert?.bodyNodes).toHaveLength(1);
    expect(alert?.bodyNodes[0]?.children?.[0]).toMatchObject({
      type: "text",
      value: "Second paragraph.",
    });
  });

  test("preserves inline markdown in the alert body", () => {
    const blockquote = parseBlockquote(
      "> [!WARNING]\n> **Bold** and [link](/foo)",
    );
    const alert = tryParseGithubAlert(blockquote);

    expect(alert?.componentName).toBe("Warning");
    expect(alert?.bodyNodes).toHaveLength(1);
    const paragraph = alert?.bodyNodes[0];
    expect(paragraph?.type).toBe("paragraph");
    expect(paragraph?.children?.map((child) => child.type)).toEqual([
      "strong",
      "text",
      "link",
    ]);
  });

  test("preserves lists nested inside alerts", () => {
    const alert = tryParseGithubAlert(
      parseBlockquote("> [!TIP]\n> - item one\n> - item two"),
    );

    expect(alert?.componentName).toBe("Success");
    expect(alert?.bodyNodes).toHaveLength(1);
    expect(alert?.bodyNodes[0]?.type).toBe("list");
    expect(alert?.bodyNodes[0]?.children).toHaveLength(2);
  });

  test("preserves fenced code blocks nested inside alerts", () => {
    const alert = tryParseGithubAlert(
      parseBlockquote("> [!CAUTION]\n>\n> ```js\n> console.log(1)\n> ```"),
    );

    expect(alert?.componentName).toBe("Error");
    expect(alert?.bodyNodes).toHaveLength(1);
    expect(alert?.bodyNodes[0]).toMatchObject({
      type: "code",
      lang: "js",
      value: "console.log(1)",
    });
  });

  test("maps all supported alert types", () => {
    expect(
      tryParseGithubAlert(parseBlockquote("> [!NOTE]\n> Body"))?.componentName,
    ).toBe("Info");
    expect(
      tryParseGithubAlert(parseBlockquote("> [!TIP]\n> Body"))?.componentName,
    ).toBe("Success");
    expect(
      tryParseGithubAlert(
        parseBlockquote("> [!IMPORTANT]\n> Body"),
      )?.componentName,
    ).toBe("Warning");
    expect(
      tryParseGithubAlert(parseBlockquote("> [!WARNING]\n> Body"))
        ?.componentName,
    ).toBe("Warning");
    expect(
      tryParseGithubAlert(parseBlockquote("> [!CAUTION]\n> Body"))
        ?.componentName,
    ).toBe("Error");
  });

  test("returns null for regular blockquotes", () => {
    expect(
      tryParseGithubAlert(parseBlockquote("> Example of a blockquote.")),
    ).toBeNull();
    expect(
      tryParseGithubAlert(
        parseBlockquote("> See [!NOTE] in the middle of a quote."),
      ),
    ).toBeNull();
  });

  test("returns null for unsupported alert markers", () => {
    expect(
      tryParseGithubAlert(parseBlockquote("> [!UNKNOWN]\n> Body")),
    ).toBeNull();
  });

  test("returns null for empty blockquotes", () => {
    expect(tryParseGithubAlert({ type: "blockquote", children: [] })).toBeNull();
  });

  test("allows marker-only alerts with empty bodies", () => {
    const alert = tryParseGithubAlert(parseBlockquote("> [!NOTE]"));

    expect(alert).toEqual({
      componentName: "Info",
      bodyNodes: [],
    });
  });
});
