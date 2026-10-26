import { defineEnvironment } from "reeval";

/**
 * Empty workspace for skill-lift compares. Control has no project skills;
 * variants add one via extendEnvironment.
 */
export const plain = defineEnvironment("plain", {
  files: { ".gitignore": "node_modules/\n" },
});

/** Planted writing issues for the review-doc skill (from skills/review-doc/evals/files). */
const plantedMechanical = `---
title: Connect a repository
description: Connect a GitHub repository so docs.page can serve it.
---

Please click here to get started: https://docs.page/invertase/docs.page

The preview flow is red, green and blue.

Use a long aside -- like this -- between clauses.

\`\`\`
npx docs.page
\`\`\`

![screenshot](/assets/shot.png)

Please note that you should utilize the CLI.
`;

/** Empty workspace plus a page with planted writing issues. */
export const reviewPage = defineEnvironment("review-page", {
  files: {
    ".gitignore": "node_modules/\n",
    "page.mdx": plantedMechanical,
  },
});

/** Same page, with this repo's review-doc skill. */
export const withReviewDoc = reviewPage.extendEnvironment(
  "with-review-doc",
  ({ skill }) => ({
    skills: [skill.local("../skills/review-doc")],
  }),
);

/** Same empty workspace, with this repo's install-docs-page skill. */
export const withInstallDocsPage = plain.extendEnvironment(
  "with-install-docs-page",
  ({ skill }) => ({
    skills: [skill.local("../skills/install-docs-page")],
  }),
);
