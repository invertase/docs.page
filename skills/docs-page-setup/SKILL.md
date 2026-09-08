---
name: docs-page-setup
description: Scaffolds a docs.page site with the CLI (docs.json and docs/), pushes to a public GitHub default branch, and verifies https://docs.page/{owner}/{repo} renders. Use when adding docs.page to a project for the first time, or when asked to add docs.page hosting. Do not use for auditing an existing docs.page site, link checks, Docusaurus, VitePress, GitBook, or writing documentation copy.
---

# Set up docs.page in a repository

Read <https://use.docs.page/quickstart.md> and follow it — the canonical walkthrough, served as raw markdown. Do not restate or pre-empt its steps. This file covers only what that page cannot: running the setup with no terminal to type into.

## Out of scope

- Mechanical QA of a docs.page site that already exists — link sweeps, broken assets, metadata checks. That is a review job on published docs, not first-time setup.
- Any other documentation host: Docusaurus, VitePress, GitBook, MkDocs.
- Writing documentation copy, beyond the one identifiable edit the quickstart asks for.

## Scaffold non-interactively

`init` prompts only when stdin and stdout are both TTYs. Headless it never prompts — it silently takes defaults, including naming the site after the current directory. Pass every value explicitly:

```bash
npx --yes @docs.page/cli init --name "<Project Name>" --docs
```

Keep `--yes` even though headless `init` will not prompt: npx prompts on its own before installing a package it has not already cached.

- `--name` — written to `docs.json` as `name`, and also as `description`, in the form `"{name} documentation"`. Omit it and both are derived from `package.json`, `pubspec.yaml`, or the folder name.
- `--docs` — starter pages are created by default, headless and interactive alike; passing `--docs` only makes that intent explicit. `--no-docs` is the flag that changes the outcome: it writes `docs.json` alone.
- `--overwrite` — mandatory, not optional, when `docs.json` or `docs/` already exist. Without it `init` exits 1.

On Windows PowerShell, quote the package name: `npx --yes '@docs.page/cli' init`.

## Edit docs.json

`init` writes `"$schema": "https://docs.page/schema.json"` as the first key. Leave it there — it powers editor autocomplete. It is not a validation gate: that schema marks 17 top-level fields `required` even though all 17 have defaults, and requires neither `name` nor `description`, so a correct minimal config is reported invalid. Do not validate the file against it, do not add fields to satisfy it, and do not delete the key to quiet an editor. Look up keys, types, and defaults in <https://use.docs.page/reference/docs-json.md> rather than writing them from memory.

Then make the identifiable content edit the quickstart asks for — change the title or add a sentence in `docs/index.mdx` — so the last done check has something to confirm.

## Verify before pushing

```bash
npx --yes @docs.page/cli check --external-links off
```

Expect `No documentation issues found.` and exit 0. This still checks internal links, assets, MDX rendering, and metadata — the deterministic, network-free signal. Keep external links off: the starter pages `init` scaffolds ship dead `use.docs.page` URLs, so a default `docs check` exits 1 on an untouched scaffold.

Leave external-link checking to CI. `External link returned 404` is actionable, but DNS failures, refused connections, and timeouts all print the same inconclusive `Unable to reach external link: fetch failed`.

## Confirm before pushing

Commit locally, then stop. Never run `git push` on your own initiative, and never push to the default branch unless you are told to.

First show the human the files the commit would push (`git show --stat HEAD`), the target remote and branch, and the consequence: docs.page serves public repositories only, so a push to the default branch publishes these docs at `https://docs.page/{owner}/{repo}` straight away — no build and no review step in between. Push only once they have said to; if they would rather not publish yet, offer a non-default branch, previewable at `https://docs.page/{owner}/{repo}~{branch}`.

## Done means the live site renders

Setup is finished not when the files are written, but when all three hold — and the first only after the human has approved the push:

1. You have committed `docs.json` and `docs/` and, on their explicit go-ahead, pushed them to the repository's **default** branch.
2. The repository is **public**.
3. `https://docs.page/{owner}/{repo}` loads and shows the edit you made.

Confirm the third by opening the URL yourself. It is a manual check by design — the page is built from the pushed public repository, so nothing runnable in the working tree can stand in for it.

## Failures

| Message | Cause | Fix |
| --- | --- | --- |
| `docs/ already exists. Re-run with --overwrite to write starter docs files, or --no-docs to skip them.` | A `docs/` directory is already present | Re-run with `--overwrite` to add starter pages, or `--no-docs` to keep only your own |
| `docs.json already exists. Re-run with --overwrite to replace it.` | Config already present | Re-run with `--overwrite`, or leave it and edit the existing file |
| `Private repositories cannot be hosted on docs.page. The repository <owner>/<repo> is private.` | docs.page serves public repositories only | Make the repository public |
| `No configuration file was found in the repository. To get started, create a docs.json file at the root of your repository.` | `docs.json` is in a subdirectory | Move it to the repository root; a nested path is never read |
| Same message, with `docs.json` correctly at the root | The push landed on a non-default branch | Merge into the default branch, or view that branch at `https://docs.page/{owner}/{repo}~{branch}` |
