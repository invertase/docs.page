import { describe, expect, test } from "bun:test";
import { mdxToDocIr, preprocessMdxSource } from "./from-mdx";

describe("preprocessMdxSource", () => {
  test("strips HTML comments", () => {
    expect(preprocessMdxSource("<!-- hidden -->\n\n## Hi")).toBe("\n\n## Hi");
  });

  test("escapes angle brackets that cannot start JSX", () => {
    expect(preprocessMdxSource("Use <*> for wildcard")).toBe(
      "Use &lt;*> for wildcard",
    );
  });
});

describe("mdxToDocIr", () => {
  test("does not throw on HTML comments", async () => {
    const ir = await mdxToDocIr("<!-- hidden -->\n\n## Hello");
    expect(ir.kind).toBe("root");
    expect(ir.children.length).toBeGreaterThan(0);
  });

  test("does not throw on wildcard angle brackets", async () => {
    const ir = await mdxToDocIr("Use <*> for wildcard");
    expect(ir.kind).toBe("root");
    const markdown = ir.children.find((child) => child.kind === "markdown");
    expect(markdown?.kind === "markdown" && markdown.source).toContain(
      "&lt;*>",
    );
  });

  test("parses known MDX components", async () => {
    const ir = await mdxToDocIr("<Info>\nHello\n</Info>");
    const component = ir.children.find((child) => child.kind === "component");
    expect(component?.kind).toBe("component");
    if (component?.kind === "component") {
      expect(component.name).toBe("Info");
    }
  });

  test("keeps inline links in a single markdown leaf inside components", async () => {
    const ir = await mdxToDocIr(
      "<Info>Supports all [Melos filtering](/filters) flags.</Info>",
    );
    const component = ir.children.find((child) => child.kind === "component");
    expect(component?.kind).toBe("component");
    if (component?.kind === "component") {
      expect(component.children).toHaveLength(1);
      const leaf = component.children[0];
      expect(leaf?.kind).toBe("markdown");
      if (leaf?.kind === "markdown") {
        expect(leaf.source).toBe(
          "Supports all [Melos filtering](/filters) flags.",
        );
      }
    }
  });

  test("renders lowercase HTML tags as html IR nodes", async () => {
    const ir = await mdxToDocIr('<p align="center">badges</p>');
    const html = ir.children.find((child) => child.kind === "html");
    expect(html?.kind).toBe("html");
    if (html?.kind === "html") {
      expect(html.source).toContain("<p");
    }
  });

  test("falls back to markdown-only parse when MDX still fails", async () => {
    const ir = await mdxToDocIr("## Still works\n\nPlain text.");
    expect(ir.kind).toBe("root");
    expect(ir.children.some((child) => child.kind === "markdown")).toBe(true);
  });

  test("parses inline TabItem siblings inside Tabs as components", async () => {
    const ir = await mdxToDocIr(`<Tabs>
  <TabItem label="First Tab" value="first">👋 This is the content for the first tab.</TabItem>
  <TabItem label="Second Tab" value="second">...and this is the content for the second tab!</TabItem>
</Tabs>`);

    const tabs = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Tabs",
    );
    expect(tabs).toBeDefined();
    expect(tabs?.children).toHaveLength(2);
    expect(tabs?.children.every((child) => child.kind === "component")).toBe(
      true,
    );
    if (tabs?.children[0]?.kind === "component") {
      expect(tabs.children[0].name).toBe("TabItem");
      expect(tabs.children[0].props.label).toBe("First Tab");
      expect(tabs.children[0].props.value).toBe("first");
    }
  });
});
