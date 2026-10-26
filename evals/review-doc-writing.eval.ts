import { evaluate, expect } from "reeval";
import { reviewPage, withReviewDoc } from "./environments.ts";

/**
 * Doc quality: does review-doc lift writing fixes on a planted page?
 * Prompt matches the skill's publisher example and does not name the checks.
 */
evaluate(
  "applies review-doc writing fixes on a planted page",
  { compare: { baseline: reviewPage, variants: [withReviewDoc] }, runs: 2 },
  async (c) => {
    await c.send("use review-doc on page.mdx");

    const page = ((await c.readFile("page.mdx")) ?? "").toLowerCase();
    expect.soft(page, "removes click here").not.toMatch(/click here/);
    expect
      .soft(page, "uses the serial comma")
      .toMatch(/red,\s*green,\s*and\s*blue/);
    expect.soft(page, "drops please-note padding").not.toMatch(/please note/);
    expect.soft(page, "avoids utilize").not.toMatch(/\butilize\b/);
  },
);
