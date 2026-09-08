---
name: docs-page-setup
description: Sets up a docs.page documentation site in a repository — scaffold docs.json and docs/, push to a public GitHub repo, and verify the live site renders. Use when adding docs.page to a project for the first time, or when asked to add documentation hosting, a docs site, or docs.page to a repo.
---

# Set up docs.page in a repository

Read <https://use.docs.page/quickstart.md> and follow it — the canonical walkthrough, served as raw markdown. Do not restate or pre-empt its steps. This file covers only what that page cannot: running the setup with no terminal to type into.

## Scaffold non-interactively

`init` prompts only when stdin and stdout are both TTYs. Headless it never prompts — it silently takes defaults, including naming the site after the current directory. Pass every value explicitly:

```bash
npx @docs.page/cli init --name "<Project Name>" --docs
```

- `--name` — written to `docs.json`. Omit it and the site is named after the folder.
- `--docs` / `--no-docs` — create or skip the starter pages. `--no-docs` writes `docs.json` alone.
- `--overwrite` — mandatory, not optional, when `docs.json` or `docs/` already exist. Without it `init` exits 1.

On Windows PowerShell, quote the package name: `npx '@docs.page/cli' init`.

## Edit docs.json

Do not write `docs.json` keys from memory, and do not validate the file against `https://docs.page/schema.json`. That schema marks 17 top-level fields `required` even though all 17 have defaults, and requires neither `name` nor `description` — so a correct minimal config is reported invalid. Look up keys, types, and defaults in <https://use.docs.page/reference/docs-json.md>.

## Verify before pushing

```bash
npx @docs.page/cli check --external-links off
```

Expect `No documentation issues found.` and exit 0. This still checks internal links, assets, MDX rendering, and metadata — the deterministic, network-free signal. Keep external links off: the starter pages `init` scaffolds ship three dead `use.docs.page` URLs, so a default `docs check` exits 1 on an untouched scaffold.

Leave external-link checking to CI. `External link returned 404` is actionable, but DNS failures, refused connections, and timeouts all print the same inconclusive `Unable to reach external link: fetch failed`.

## Done means the live site renders

Setup is finished not when the files are written, but when all three hold:

1. `docs.json` and `docs/` are committed and pushed to the repository's **default** branch.
2. The repository is **public**.
3. `https://docs.page/{owner}/{repo}` loads and shows the edit you made.

## Failures

| Message | Cause | Fix |
| --- | --- | --- |
| `docs/ already exists. Re-run with --overwrite to write starter docs files, or --no-docs to skip them.` | A `docs/` directory is already present | Re-run with `--overwrite` to add starter pages, or `--no-docs` to keep only your own |
| `docs.json already exists. Re-run with --overwrite to replace it.` | Config already present | Re-run with `--overwrite`, or leave it and edit the existing file |
| `Private repositories cannot be hosted on docs.page. The repository <owner>/<repo> is private.` | docs.page serves public repositories only | Make the repository public |
| `No configuration file was found in the repository. To get started, create a docs.json file at the root of your repository.` | `docs.json` is in a subdirectory | Move it to the repository root; a nested path is never read |
| Same message, with `docs.json` correctly at the root | The push landed on a non-default branch | Merge into the default branch, or view that branch at `https://docs.page/{owner}/{repo}~{branch}` |
