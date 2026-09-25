---
name: setup
description: Stand up a new docs.page documentation site. Use when the user says "set up docs.page", "add docs to this repo", "docs init", asks how to publish docs from GitHub, wants a local docs preview, or wants to add branding, analytics or the docs.page MCP server to their site, or asks to set up or configure Ask AI (out of scope here: the skill points them to the guide).
---

# Setting up a docs.page site

docs.page publishes `docs/**/*.mdx` + `docs.json` straight from a public GitHub repo.
No build step, no deploy.

## 1. Scaffold

```bash
npx @docs.page/cli init [path]          # path defaults to "."
```

Flags: `--name <name>` (project name written into `docs.json`),
`--docs` / `--no-docs` (create or skip the starter MDX),
`--overwrite` (overwrite files `init` created).

It is **interactive by default**; a non-interactive run errors with
`Missing --<flag>` for anything it still needs.

It writes `docs.json` (with `$schema`, `name`, `description` and a one-group
sidebar) and, unless `--no-docs`, `docs/index.mdx` and `docs/next-steps.mdx`.

On Windows PowerShell quote the package: `npx '@docs.page/cli' init`.

## 2. Preview locally

```bash
npx @docs.page/cli preview [--port <n>] [--no-browser]
```

`--port` must be a valid TCP port (1–65535); with no port an ephemeral one is
chosen. It watches files and renders through the same bundler as production.

## 3. Publish

Push to GitHub. The site is live at:

```
https://docs.page/{owner}/{repo}
https://docs.page/{owner}/{repo}/{page-path}
https://{owner}.docs.page/{repo}            # vanity subdomain, same site
https://docs.page/{owner}/{repo}~{ref}      # a branch, tag or commit
```

## 4. Optional extras

All of these are `docs.json` keys — see the `docs-json` skill for the shapes.

- **Branding**: `theme` (preset code from <https://ui.shadcn.com/create>, plus
  6-digit hex colours), `logo` as an **object** `{light, dark}` (a string silently
  flips the file into legacy v1 parsing), `favicon`.
- **Analytics**: `scripts` — exactly `googleTagManager`, `googleAnalytics`,
  `googleSiteVerification`, `plausible`.
- **MCP server**: on by default (`mcp.enabled`, default `true`). Set it to `false`
  to return 404 for the endpoint.

**Ask AI is out of scope.** If the user asks about it, point them to the Ask AI setup guide at
<https://use.docs.page/ai-agents/ask-ai>. Never run `docs agent create` or handle their AI
provider key. Leave any existing `agent` block in `docs.json` untouched — it is valid
config, not a mistake to fix.

## 5. Point Claude at your own site's MCP server

The docs.page MCP server is **per repository**, so there is no single global URL:

```bash
claude mcp add --transport http docs-page https://docs.page/{owner}/{repo}/mcp
```

Tools it exposes: `read_doc_page` (takes a required `path`) and `list_doc_files`
(no arguments).

## 6. Validate

```bash
npx @docs.page/cli check
```

See the `check` skill for the severity flags and the gaps you must sweep by hand.

> **Caveat (reported previously, not re-measured in this build):** a freshly
> scaffolded site can fail a bare `docs check` on the template's own external
> links. On the first pass run `npx @docs.page/cli check --external-links warn`.
