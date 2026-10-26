import { defineConfig } from "reeval";
import { cursor, fakeHarness } from "reeval/harness";
import { fakeSandbox } from "reeval/sandbox";

const reviewDocFixed = `---
title: Connect a repository
description: Connect a GitHub repository so docs.page can serve it.
---

[Get started](https://docs.page/invertase/docs.page)

The preview flow is red, green, and blue.

Use a long aside—like this—between clauses.

\`\`\`bash
npx docs.page
\`\`\`

![Repository connection screenshot](/assets/shot.png)

Use the CLI.
`;

const reviewDocWrong = `---
title: Connect a repository
description: Connect a GitHub repository so docs.page can serve it.
---

Please click here to get started: https://docs.page/invertase/docs.page

The preview flow is red, green and blue.

Please note that you should utilize the CLI.
`;

export default defineConfig({
  include: ["evals/**/*.eval.ts"],
  harness: cursor({ model: "composer-2.5" }), // needs CURSOR_API_KEY
  timeout: "15m",
  // Insights explain each eval after a run, with GOOGLE_GENERATIVE_AI_API_KEY;
  // insights: false turns them off.
  analysis: { model: "google/gemini-3.8-flash" },
  defaultProfile: { ci: "pr" },
  profiles: {
    // PR runs in CI: one attempt per cell, no variants.
    pr: { limit: { runs: 1, compare: false }, budget: { attempts: 20 } },
    // Thorough: three attempts per cell, recorded every time.
    nightly: {
      defaults: { runs: 3 },
      record: "always",
      budget: { attempts: 80, duration: "2h" },
    },
    // Fake agents (no keys): canary must fail checks; oracle must pass.
    // Name the eval when running so the wrong files are not applied to the other.
    // fakeSandbox: validate checks without Docker; real Cursor runs still need docker().
    "canary-review-doc": {
      defaults: {
        sandbox: fakeSandbox(),
        harness: fakeHarness({
          files: { "page.mdx": reviewDocWrong },
          text: "Done.",
        }),
      },
    },
    "oracle-review-doc": {
      defaults: {
        sandbox: fakeSandbox(),
        harness: fakeHarness({
          files: { "page.mdx": reviewDocFixed },
          text: "Done.",
        }),
      },
    },
    "canary-install-docs": {
      defaults: {
        sandbox: fakeSandbox(),
        harness: fakeHarness({
          files: {
            "README.md": "# Docs\n\nWrite markdown here.\n",
          },
          text: "Done.",
        }),
      },
    },
    "oracle-install-docs": {
      defaults: {
        sandbox: fakeSandbox(),
        harness: fakeHarness({
          files: {
            "docs.json":
              '{\n  "name": "example",\n  "description": "Example docs",\n  "sidebar": []\n}\n',
            "docs/index.mdx":
              "---\ntitle: Home\ndescription: Start here.\n---\n\nWelcome.\n",
            "docs/next-steps.mdx":
              "---\ntitle: Next steps\ndescription: What to do next.\n---\n\nKeep going.\n",
          },
          text: "Done.",
        }),
      },
    },
  },
});
