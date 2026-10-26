import { evaluate, expect } from "reeval";
import { plain, withInstallDocsPage } from "./environments.ts";

/**
 * Agent-ready docs: does install-docs-page scaffold via Quickstart
 * (docs.json + docs/index.mdx + docs/next-steps.mdx) instead of inventing a layout?
 */
evaluate(
  "scaffolds docs.page via Quickstart with the install skill",
  {
    compare: { baseline: plain, variants: [withInstallDocsPage] },
    runs: 2,
  },
  async (c) => {
    await c.send(
      "Set up docs.page in this repository so we can publish documentation from a public GitHub repo.",
    );

    await expect.soft(c, "creates docs.json").toHaveFile("docs.json");
    await expect.soft(c, "creates docs/index.mdx").toHaveFile("docs/index.mdx");
    await expect
      .soft(c, "creates docs/next-steps.mdx")
      .toHaveFile("docs/next-steps.mdx");

    const config = ((await c.readFile("docs.json")) ?? "").toLowerCase();
    expect.soft(config, "docs.json has a sidebar").toMatch(/"sidebar"\s*:/);
  },
);
