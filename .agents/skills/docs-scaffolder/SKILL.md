---
name: docs-scaffolder
description: >-
  Builds a previewable documentation site from features.json. Produces docs.json
  with an outline block, scaffolds stub MDX pages, and runs docs.page CLI check
  to validate the site compiles. Use when planning doc structure, scaffolding a
  docs site, or when the user mentions docs-scaffolder, doc outline, or IA.
---

# Docs Scaffolder

Plan **where** documentation lives, scaffold **stub pages** for preview, and **validate** the site compiles.

**Upstream:** `features.json` from [feature-finder](../feature-finder/SKILL.md). Read existing `docs.json` and `docs/**/*.mdx` when updating.

**Output:** `docs.json` + stub `.mdx` files + passing `docs check`.

**Out of scope:** Full documentation prose (use [docs-writer](../docs-writer/SKILL.md)) or re-scanning source code.

## Pipeline position

```
feature-finder  →  features.json
docs-scaffolder →  docs.json + stub .mdx + docs check   ← you are here
docs-writer     →  full .mdx content
```

## Output location

1. If the user specifies a path, use it as the project root (where `docs.json` lives).
2. Else use the repo root.

When updating, **merge** into existing `docs.json` — preserve `name`, `logo`, `theme`, `agent`, `social`, and other non-nav keys.

## Output shape

`docs.json` is two layers in one file:

| Layer | Keys | Purpose |
| --- | --- | --- |
| **Site config** | `$schema`, `name`, `description`, `tabs`, `sidebar`, … | Valid docs.page config; drives navigation |
| **Planning** | `outline` | Agent metadata; ignored by docs.page at runtime |

```json
{
  "$schema": "https://docs.page/schema.json",
  "name": "my-product",
  "description": "Short site description",
  "tabs": [],
  "sidebar": [],
  "outline": {
    "version": "1.0.0",
    "updatedAt": "YYYY-MM-DD",
    "sourceFeatures": "path/to/features.json",
    "pages": [],
    "coverage": {},
    "validation": {}
  }
}
```

### `outline.pages` entry

| Field | Required | Notes |
| --- | --- | --- |
| `href` | yes | Same as sidebar leaf; unique |
| `title` | yes | Sidebar / page title |
| `description` | yes | Frontmatter description |
| `docType` | yes | `tutorial`, `how-to`, `reference`, or `explanation` |
| `status` | yes | `existing`, `new`, `stub`, or `retire` |
| `file` | yes | `docs/navigation.mdx` (`/` → `docs/index.mdx`) |
| `capabilityIds` | yes | `features.json` ids (`[]` for editorial) |
| `audience` | no | Persona tags |
| `rationale` | yes | Why this doc type and placement |
| `relatedHrefs` | no | Cross-links by `href` |
| `splits` | no | Other `href`s from same capability cluster |

### `status` values

| Status | Meaning | Scaffolder action |
| --- | --- | --- |
| `existing` | `.mdx` exists with content | Do not overwrite |
| `new` | Planned; no file yet | Create stub → set `stub` |
| `stub` | Placeholder `.mdx` exists | Skip unless file missing |
| `retire` | Mark for removal | Do not create stub |

### `outline.validation`

Includes IA checks **and** CLI result:

```json
{
  "passed": true,
  "issues": [],
  "cliCheck": {
    "passed": true,
    "command": "npx @docs.page/cli check . --external-links off",
    "ranAt": "YYYY-MM-DD",
    "errors": 0,
    "warnings": 0
  },
  "stats": { "pageCount": 42, "stubPages": 12 }
}
```

Set `passed: true` only when IA errors are resolved **and** `cliCheck.passed` is true.

## Execution protocol

```
Docs Scaffolder Progress:
- [ ] 1. Ingest — read features.json, docs.json, scan docs/**/*.mdx
- [ ] 2. Inventory — list existing pages and hrefs
- [ ] 3. Cluster — group capabilities into pages (merge/split)
- [ ] 4. Route — assign docType (read diataxis-routing.md)
- [ ] 5. Place — build tabs + sidebar (read sidebar-ia.md)
- [ ] 6. Sync — build outline.pages; populate coverage
- [ ] 7. Validate IA — run IA checks; populate validation.issues
- [ ] 8. Write — save docs.json
- [ ] 9. Stub — create missing .mdx files (read stub-templates.md)
- [ ] 10. CLI — resolve CLI, run docs check (read cli.md); fix until pass
- [ ] 11. Report — summarize; remind user to preview and run docs-writer
```

## Step 9: Scaffold stub MDX

Read [stub-templates.md](stub-templates.md) before creating files.

For each `outline.pages` entry with `status: new` (or `stub` when file is missing):

1. Resolve `file` path; create parent directories
2. Write stub using matching `docType` template
3. Set `status: stub` in `outline.pages`
4. Re-save `docs.json`

**Never overwrite** files for `status: existing`. Skip `retire`.

Also validate every sidebar leaf `href` resolves to an on-disk `.mdx` file. If a sidebar entry lacks a file, create a stub and add/update its `outline.pages` entry.

## Step 10: CLI validation

Read [cli.md](cli.md). Resolve and run:

```bash
docs check . --external-links off
```

Use the monorepo or `npx` fallback from `cli.md` when `docs` is not on PATH.

If check fails:

1. Read error output
2. Fix JSON syntax, MDX parse errors, or broken internal links in stubs
3. Re-run until exit code `0` or report unfixable blockers

Record result in `outline.validation.cliCheck`. IA `passed` requires CLI pass.

## IA validation rules

| Rule | Severity | Check |
| --- | --- | --- |
| `max-groups-per-tab` | error | ≤ 7 top-level sidebar groups per tab |
| `max-depth` | error | Nesting ≤ 3 levels |
| `unique-href` | error | No duplicate `href` in `outline.pages` |
| `sidebar-outline-sync` | error | Every sidebar leaf has `outline.pages` entry |
| `outline-sidebar-sync` | error | Every non-`retire` page appears in sidebar |
| `missing-mdx` | error | Every sidebar `href` has on-disk `.mdx` after step 9 |
| `orphan-mdx` | warning | `.mdx` not in sidebar |
| `unmapped-capability` | warning | Capability not in coverage |
| `doc-type-mismatch` | warning | e.g. `reference` top-level in Getting Started |

## Reporting to the user

Summarize:

- `docs.json` path
- Stubs created (list `file` paths)
- Pages skipped (`existing`) and not created (`retire`)
- `outline.validation.issues` and `cliCheck` result
- CLI command used
- Preview: open [docs.page/preview](https://docs.page/preview) and select project directory
- Next step: run **docs-writer** for pages with `status: stub`

## Downstream

[docs-writer](../docs-writer/SKILL.md) replaces stub content for `status: stub` pages. `tabs` and `sidebar` are already in place.

## Additional resources

- Example artifact: [docs.example.json](docs.example.json) — fictional **Taskflow** product; illustrates schema shape only, not a template to copy
- Stub MDX templates: [stub-templates.md](stub-templates.md)
- CLI install & check: [cli.md](cli.md)
- Diátaxis routing: [diataxis-routing.md](diataxis-routing.md)
- Sidebar IA: [sidebar-ia.md](sidebar-ia.md)
- Capability inventory: [feature-finder](../feature-finder/SKILL.md)
