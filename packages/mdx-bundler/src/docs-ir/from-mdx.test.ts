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

  test("preserves iframe embeds in html IR nodes", async () => {
    const ir = await mdxToDocIr(`<iframe
  src="https://preview.widgetbook.io/#/?path=knobpreview/bool-knob&panels=knobs"
  width="100%"
  height="240px"
/>`);
    const html = ir.children.find((child) => child.kind === "html");
    expect(html?.kind).toBe("html");
    if (html?.kind === "html") {
      expect(html.source).toContain("<iframe");
      expect(html.source).toContain("preview.widgetbook.io");
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

  test("keeps GFM tables with inline code and br tags in a single markdown leaf", async () => {
    const ir = await mdxToDocIr(
      `| Parameter | Required | Description |
| --- | --- | --- |
| \`name\` | ✅ | The name of the use-case. |
| \`path\` | - | Text before <br /> For example: \`foo\` |`,
    );

    const markdownLeaves = ir.children.filter(
      (child) => child.kind === "markdown",
    );
    expect(markdownLeaves).toHaveLength(1);
    const table = markdownLeaves[0];
    expect(table?.kind).toBe("markdown");
    if (table?.kind === "markdown") {
      expect(table.source).toContain("| `name` | ✅ |");
      expect(table.source).toContain("<br />");
      expect(table.source).toContain("| `path` | - |");
    }
  });

  test("parses Info and code blocks inside list items as structured IR", async () => {
    const ir = await mdxToDocIr(
      `1. Create a file inside your \`widgetbook\` app at \`widgetbook/lib/cool_button.dart\`

   <Info>
     If your widget needs some parameters, you can pass some constants for now
     for simplicity. Later you can check how to use [Knobs](/knobs/overview).
   </Info>

   \`\`\`dart
   import 'package:flutter/material.dart';
   \`\`\`
`,
    );

    expect(ir.children.some((child) => child.kind === "component")).toBe(true);
    expect(ir.children.some((child) => child.kind === "code")).toBe(true);
    expect(
      ir.children.some(
        (child) =>
          child.kind === "markdown" &&
          child.source.includes("widgetbook/lib/cool_button.dart"),
      ),
    ).toBe(true);
    expect(
      ir.children.some(
        (child) => child.kind === "component" && child.name === "Info",
      ),
    ).toBe(true);

    const info = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Info",
    );
    expect(info?.children).toHaveLength(1);
    const infoContent = info?.children[0];
    expect(infoContent?.kind).toBe("markdown");
    if (infoContent?.kind === "markdown") {
      expect(infoContent.source).toContain("[Knobs](/knobs/overview)");
    }
  });

  test("parses Info and code blocks inside Step list items", async () => {
    const ir = await mdxToDocIr(
      `<Step>
1. Create a file inside your \`widgetbook\` app

   <Info>
     Later you can check how to use [Knobs](/knobs/overview).
   </Info>

   \`\`\`dart
   import 'package:flutter/material.dart';
   \`\`\`
</Step>`,
    );

    const step = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Step",
    );
    expect(step?.children.some((child) => child.kind === "component")).toBe(
      true,
    );
    expect(step?.children.some((child) => child.kind === "code")).toBe(true);
    expect(
      step?.children.some(
        (child) =>
          child.kind === "component" &&
          child.name === "Info" &&
          child.children.some(
            (grandchild) =>
              grandchild.kind === "markdown" &&
              grandchild.source.includes("[Knobs](/knobs/overview)"),
          ),
      ),
    ).toBe(true);
  });

  test("normalizes indented GFM tables inside Step components", async () => {
    const ir = await mdxToDocIr(
      `<Step title="Create OAuth Application">
    Go to **"Group Settings"** > **"Applications"**.

    | Field          | Value                                |
    | -------------- | ------------------------------------ |
    | Name           | Widgetbook                           |
    | Redirect URI   | \`https://clerk.widgetbook.io/v1/oauth_callback\` |
</Step>`,
    );

    const step = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Step",
    );
    const table = step?.children.find(
      (child): child is Extract<typeof child, { kind: "markdown" }> =>
        child.kind === "markdown" && child.source.includes("| Field"),
    );
    expect(table).toBeDefined();
    if (table?.kind === "markdown") {
      expect(table.source).toBe(
        `| Field          | Value                                |
| -------------- | ------------------------------------ |
| Name           | Widgetbook                           |
| Redirect URI   | \`https://clerk.widgetbook.io/v1/oauth_callback\` |`,
      );
    }
  });

  test("converts GitHub NOTE alerts into Info components", async () => {
    const ir = await mdxToDocIr("> [!NOTE]\n> Useful information.");

    const component = ir.children.find((child) => child.kind === "component");
    expect(component).toMatchObject({
      kind: "component",
      name: "Info",
    });
    if (component?.kind === "component") {
      expect(component.children).toHaveLength(1);
      const body = component.children[0];
      expect(body?.kind).toBe("markdown");
      if (body?.kind === "markdown") {
        expect(body.source).toBe("Useful information.");
      }
    }
  });

  test("maps GitHub alert types to callout components", async () => {
    const cases = [
      { source: "> [!NOTE]\n> Body", name: "Info" },
      { source: "> [!TIP]\n> Body", name: "Success" },
      { source: "> [!IMPORTANT]\n> Body", name: "Warning" },
      { source: "> [!WARNING]\n> Body", name: "Warning" },
      { source: "> [!CAUTION]\n> Body", name: "Error" },
    ] as const;

    for (const { source, name } of cases) {
      const ir = await mdxToDocIr(source);
      const component = ir.children.find((child) => child.kind === "component");
      expect(component).toMatchObject({ kind: "component", name });
    }
  });

  test("preserves nested markdown inside GitHub alerts", async () => {
    const ir = await mdxToDocIr(
      "> [!WARNING]\n> **Bold** and [link](/docs) inside the alert.",
    );

    const component = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Warning",
    );
    expect(component?.children).toHaveLength(1);
    const body = component?.children[0];
    expect(body?.kind).toBe("markdown");
    if (body?.kind === "markdown") {
      expect(body.source).toBe(
        "**Bold** and [link](/docs) inside the alert.",
      );
    }
  });

  test("preserves lists and code blocks inside GitHub alerts", async () => {
    const ir = await mdxToDocIr(`> [!TIP]
> - first item
> - second item

> [!CAUTION]
>
> \`\`\`js
> console.log("nested")
> \`\`\``);

    const tip = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Success",
    );
    expect(tip?.children).toHaveLength(1);
    const tipBody = tip?.children[0];
    expect(tipBody?.kind).toBe("markdown");
    if (tipBody?.kind === "markdown") {
      expect(tipBody.source).toContain("- first item");
      expect(tipBody.source).toContain("- second item");
    }

    const caution = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Error",
    );
    expect(caution?.children).toHaveLength(1);
    expect(caution?.children[0]?.kind).toBe("code");
    if (caution?.children[0]?.kind === "code") {
      expect(caution.children[0].value).toBe('console.log("nested")');
      expect(caution.children[0].lang).toBe("js");
    }
  });

  test("leaves regular blockquotes unchanged", async () => {
    const ir = await mdxToDocIr("> Example of a blockquote.");

    expect(ir.children.some((child) => child.kind === "component")).toBe(
      false,
    );
    const markdown = ir.children.find((child) => child.kind === "markdown");
    expect(markdown?.kind).toBe("markdown");
    if (markdown?.kind === "markdown") {
      expect(markdown.source).toBe("> Example of a blockquote.");
    }
  });

  test("converts GitHub alerts nested inside list items", async () => {
    const ir = await mdxToDocIr(`1. First step

   > [!NOTE]
   > Nested in a list item.

2. Second step`);

    const info = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Info",
    );
    expect(info).toBeDefined();
    const body = info?.children[0];
    expect(body?.kind).toBe("markdown");
    if (body?.kind === "markdown") {
      expect(body.source).toBe("Nested in a list item.");
    }

    expect(
      ir.children.some(
        (child) =>
          child.kind === "markdown" && child.source.includes("First step"),
      ),
    ).toBe(true);
    expect(
      ir.children.some(
        (child) =>
          child.kind === "markdown" && child.source.includes("Second step"),
      ),
    ).toBe(true);
  });

  test("converts GitHub alerts nested inside Step components", async () => {
    const ir = await mdxToDocIr(`<Step title="Install">
> [!IMPORTANT]
> Run \`npm install\` before continuing.
</Step>`);

    const step = ir.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Step",
    );
    const warning = step?.children.find(
      (child): child is Extract<typeof child, { kind: "component" }> =>
        child.kind === "component" && child.name === "Warning",
    );
    expect(warning).toBeDefined();
    const body = warning?.children[0];
    expect(body?.kind).toBe("markdown");
    if (body?.kind === "markdown") {
      expect(body.source).toBe("Run `npm install` before continuing.");
    }
  });
});
