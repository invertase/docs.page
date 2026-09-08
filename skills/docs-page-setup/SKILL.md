---
name: docs-page-setup
description: Sets up a docs.page documentation site in a repository — scaffold docs.json and docs/, push to a public GitHub repo, and verify the live site renders. Use when adding docs.page to a project for the first time.
---

# Set up docs.page in a repository

Source of truth: [Quickstart](https://use.docs.page/quickstart). Follow the steps below in order; do not add steps of your own.

## Before you begin

- A GitHub account
- Git installed locally
- Node.js, to run the CLI via `npx`

## 1. Scaffold the docs files

Run this at the project root (an empty folder or an existing repository):

```bash
npx @docs.page/cli init
```

On Windows PowerShell, quote the package name: `npx '@docs.page/cli' init`.

The CLI asks for a project name and whether to create starter pages. Accept the defaults unless a `docs/` directory already exists that must be kept. See [CLI](https://use.docs.page/features/cli) for install options and flags.

When `init` finishes, the project contains:

```text
docs.json
docs/
  index.mdx
  next-steps.mdx
```

- `docs.json` — site configuration (name, description, sidebar, and theme)
- `docs/index.mdx` — the home page, served at `/`
- `docs/next-steps.mdx` — a second page, served at `/next-steps`

Open `docs/index.mdx` and change the title or add a sentence, so there is something identifiable to confirm on the live site.

## 2. Push to a public GitHub repository

docs.page only hosts **public** repositories. From the project directory:

```bash
git add docs.json docs/
git commit -m "Add docs.page site"
git push
```

If the repository is private, docs.page returns an error and does not serve the documentation. Make the repository public before opening the live URL.

## 3. Open the live site

The site is live the instant the push completes:

```text
https://docs.page/{owner}/{repo}
```

For the repository `https://github.com/acme/my-docs`, the live site is `https://docs.page/acme/my-docs`. Pushes to the default branch update this URL automatically, with no build step. See [Public GitHub hosting](https://use.docs.page/features/public-github-hosting) for how production URLs work.

## Editing docs.json

Do not write `docs.json` keys from memory, and do not validate the file against `https://docs.page/schema.json`. That schema currently marks 17 top-level fields as `required` even though every one of them has a default, and it does not require `name` or `description` — so a correct minimal config is reported as invalid. Look up keys, types, and defaults in [docs.json reference](https://use.docs.page/reference/docs-json) instead.

## Done means the site renders

Setup is not finished when the files are written. It is finished when:

1. `docs.json`, `docs/index.mdx`, and `docs/next-steps.mdx` are committed and pushed.
2. The repository is public.
3. `https://docs.page/{owner}/{repo}` loads and shows the change made to `docs/index.mdx` in step 1.

If the URL errors, re-check that the repository is public and that the push landed on the default branch.

## Next steps

- [Write](https://use.docs.page/authoring/write) — structure pages, add code examples, use built-in components
- [Organize](https://use.docs.page/authoring/organize) — order sidebar groups, tabs, and page links in `docs.json`
- [Preview](https://use.docs.page/authoring/preview) — iterate on content locally before pushing
- [Agent-ready docs](https://use.docs.page/ai-agents/overview) — llms.txt, MCP, and optional Ask AI
