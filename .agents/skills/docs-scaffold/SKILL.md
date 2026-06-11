---
name: docs-scaffold
description: >-
  Builds a previewable documentation site from docs-spec.md and docs-inventory.json.
  Produces slim docs.json, grouped component nav, stub MDX with on-page planning
  blocks, and docs.page CLI check. Use after docs-spec and docs-inventory when
  planning doc structure, scaffolding a docs site, or when the user mentions
  docs-scaffold, docs-scaffolder, doc outline, or IA.
---

# Docs Scaffold

Plan **where** documentation lives around **user goals**, scaffold **stub pages** with **visible planning context**, and **validate** the site compiles.

**Upstream (required):** `.docs/docs-spec.md` from [docs-spec](../docs-spec/SKILL.md) and `.docs/docs-inventory.json` from [docs-inventory](../docs-inventory/SKILL.md). Read existing `docs.json` and `docs/**/*.mdx` when updating.

**Output:** slim `docs.json` + stub `.mdx` files + passing `docs check`.

**Out of scope:** Full documentation prose (use [docs-write](../docs-write/SKILL.md)) or re-scanning source code.

## Pipeline position

```
docs-spec        →  .docs/docs-spec.md
docs-inventory   →  .docs/docs-inventory.json
docs-scaffold    →  docs.json + stub .mdx + docs check   ← you are here
docs-write       →  full .mdx content
```

## Project layout

Default layout at the **project root** (directory containing `docs.json`):

```
project-root/
  docs.json                      # site config + outline (docs.page requirement)
  docs/                          # published MDX pages only
    index.mdx
    ...
  .docs/                         # pipeline inputs (not published)
    docs-spec.md
    docs-inventory.json
```

### Path resolution

When any pipeline skill needs `docs-spec.md` or `docs-inventory.json`, resolve in order:

1. **User-specified path** — if the user names a file or directory
2. **`.docs/` default** — `.docs/docs-spec.md` or `.docs/docs-inventory.json`
3. **Repo-root legacy** — `docs-spec.md` or `docs-inventory.json` at project root (backward compat)

Create `.docs/` when writing new artifacts. Set `outline.sourceInventory` in `docs.json` to the resolved inventory path (typically `.docs/docs-inventory.json`).

## Output location

1. If the user specifies a path, use it as the project root (where `docs.json` lives).
2. Else use the repo root.

`docs.json` stays at the project root (docs.page requirement). Pipeline inputs live in `.docs/`.

When updating, **merge** into existing `docs.json` — preserve `name`, `logo`, `theme`, `agent`, `social`, and other non-nav keys.

## Slim `docs.json` principle

`outline` is a **machine index** for agents and validation — not a prose document. Traceability and rationale are **rendered on stub pages** (see [stub-templates.md](stub-templates.md)), not stored in JSON.

**Do not persist:** `rationale`, `relatedHrefs`, `splits`, `mappedCapabilityIds`, `mergedInto`, or per-capability traceability arrays.

**Do persist:** `version`, `updatedAt`, `sourceInventory`, `pages[]`, `coverage.unmappedCapabilityIds`, and `validation`.

### `outline` top-level

| Field | Required | Notes |
| --- | --- | --- |
| `version` | yes | Outline schema version (e.g. `2.0.0`) |
| `updatedAt` | yes | ISO date when scaffold last ran |
| `sourceInventory` | yes | Path to inventory used for this scaffold (typically `.docs/docs-inventory.json`) |

### `outline.pages` entry

| Field | Required | Notes |
| --- | --- | --- |
| `href` | yes | Same as sidebar leaf; unique |
| `title` | yes | Sidebar / page title |
| `description` | yes | Frontmatter description |
| `icon` | yes | Same as sidebar leaf `icon` |
| `docType` | yes | `tutorial`, `how-to`, `reference`, or `explanation` |
| `userGoal` | yes | See [user-journeys.md](user-journeys.md) |
| `status` | yes | `existing`, `new`, `stub`, or `retire` |
| `file` | yes | `docs/navigation.mdx` (`/` → `docs/index.mdx`) |
| `capabilityIds` | yes | `docs-inventory.json` ids (`[]` for editorial) |
| `audience` | yes | `end-user`, `integrator`, `operator`, `contributor` |

### `outline.coverage`

```json
{
  "unmappedCapabilityIds": ["internal-metrics"]
}
```

Compute mapped coverage at report time from `pages[].capabilityIds`. List unmapped ids in the **user report** with suggested action. Do not store reverse maps in JSON.

### `status` values

| Status | Scaffold action |
| --- | --- |
| `existing` | Do not overwrite `.mdx` |
| `new` | Create stub → set `stub` |
| `stub` | Skip unless file missing |
| `retire` | Do not create stub |

Set `outline.validation.passed: true` only when IA errors are resolved **and** `cliCheck.passed` is true.

## Execution protocol

```
Docs Scaffold Progress:
- [ ] 0. Spec — read `.docs/docs-spec.md` (or run docs-spec interview first)
- [ ] 1. Ingest — read `.docs/docs-inventory.json`, `docs.json`, scan `docs/**/*.mdx`
- [ ] 2. Journeys — apply spec spine + user-journeys.md
- [ ] 3. Inventory — list existing pages and hrefs
- [ ] 4. Cluster — group/split capabilities by user goal (not kind alone)
- [ ] 5. Components — split + categorize (read component-grouping.md)
- [ ] 6. Route — assign docType (read diataxis-routing.md)
- [ ] 7. Place — tabs + sidebar with icons (read sidebar-ia.md)
- [ ] 7b. Nest — semantic sub-groups per section (read semantic-grouping.md)
- [ ] 8. Sync — slim outline.pages (no rationale in JSON)
- [ ] 9. Validate IA — populate validation.issues
- [ ] 10. Write — save docs.json
- [ ] 11. Stub — MDX with plan blocks (read stub-templates.md)
- [ ] 12. CLI — docs check (read cli.md); fix until pass
- [ ] 13. Report — unmapped capabilities + preview reminder
```

## Step 0: Docs spec

Before clustering:

1. Resolve and read `docs-spec.md` per **Project layout** above.
2. If **missing** at both `.docs/` and repo root, stop and run [docs-spec](../docs-spec/SKILL.md) — conduct the interview, write `.docs/docs-spec.md`, then resume docs-scaffold. Do not infer persona or journey order from `docs-inventory.json` alone.
3. If **present**, treat these sections as authoritative:

| Section | Scaffold use |
| --- | --- |
| `Audience` → primary persona | Default `audience` on pages; weight Getting Started for that reader |
| `First success` | Must produce a `first-success` tutorial matching the stated outcome |
| `Journeys` | Order sidebar groups and page priority within Getting Started / Guides |
| `Policy` → Omit | Leave capability ids out of all `capabilityIds`; list in `coverage.unmappedCapabilityIds` with reason `omit` |
| `Policy` → Advanced only | Route to Core Concepts or nested Advanced; never Getting Started |
| `Notes` | Honor constraints when merging/splitting pages |

**Tabs are not in the spec.** Derive top-level tabs from `docs-inventory.json` surface area and [sidebar-ia.md](sidebar-ia.md) (step 7).

When spec and [user-journeys.md](user-journeys.md) conflict, **spec wins**.

## Step 5: Components

1. **Split** — one page per `surface.ui` entry ([sidebar-ia.md](sidebar-ia.md))
2. **Categorize** — always use category sub-groups when ≥ 3 components ([component-grouping.md](component-grouping.md))
3. Section overview at `tab.href` uses **section index** stub with child traceability table

## Step 7b: Semantic nesting

Read [semantic-grouping.md](semantic-grouping.md) after initial sidebar placement.

For **each** top-level group (Getting Started, Guides, CLI, API, Configuration, …):

1. Tag every page with a **category** (`userGoal`, task theme, or domain)
2. If ≥ 2 categories with ≥ 3 pages total → create nested `group` nodes
3. Keep journey starters (Overview, Quickstart) at the **top level** of Getting Started
4. **CLI:** nest **Commands** vs **Programmatic** when both exist
5. **Guides:** nest by theme (Publish, Integrations, Search) when ≥ 2 themes
6. Re-validate 7-leaf cap and 3-level depth after nesting

## Step 7: Tab bar

Section root `href` on every tab; landing page + section index stub. See [sidebar-ia.md](sidebar-ia.md).

## Step 11: Stub MDX

Read [stub-templates.md](stub-templates.md).

| Page type | Template |
| --- | --- |
| Section landing (`href` = tab `href`) | Section index + traceability table |
| All other stubs | Documentation plan `<Info>` block + docType body |

Compose rationale and related links **in the plan block only**. Pull capability titles from `docs-inventory.json`.

When re-stubbing `status: stub` pages, replace entire file (plan block + placeholders).

## IA validation rules

| Rule | Severity | Check |
| --- | --- | --- |
| `max-groups-per-tab` | error | ≤ 7 top-level sidebar groups per tab |
| `missing-semantic-nest` | error | ≥ 2 categories, ≥ 3 pages, no sub-groups |
| `max-siblings-per-group` | error | > 7 leaf pages per group or sub-group |
| `component-flat-list` | error | ≥ 3 component leaves without category sub-groups |
| `single-child-subgroup` | warning | Sub-group with only one leaf — merge up |
| `max-depth` | error | Nesting ≤ 3 levels |
| `unique-href` | error | No duplicate `href` in `outline.pages` |
| `sidebar-outline-sync` | error | Every sidebar leaf has `outline.pages` entry |
| `outline-sidebar-sync` | error | Every non-`retire` page appears in sidebar |
| `missing-icon` | error | Every sidebar leaf and `outline.pages` entry has `icon` |
| `icon-sync` | error | `outline.pages.icon` matches sidebar leaf |
| `missing-user-goal` | error | Every page has `userGoal` |
| `missing-audience` | error | Every page has `audience` |
| `missing-first-success` | error | Getting Started includes a `first-success` tutorial |
| `tab-href-not-section-root` | error | Tab `href` must be section root |
| `tab-missing-landing` | error | Non-root tab has page at `tab.href` |
| `missing-mdx` | error | Every sidebar `href` has `.mdx` after stub step |
| `missing-plan-block` | warning | Stub `.mdx` lacks `docs-scaffold-plan` markers |
| `component-merged` | error | Multiple UI components on one page |
| `architecture-before-action` | warning | Core Concepts before Guides with no tutorial |
| `missing-author-content` | warning | Authoring capabilities but no `author-content` page |
| `orphan-mdx` | warning | `.mdx` not in sidebar |
| `unmapped-capability` | warning | Capability not in any `capabilityIds` (expected when in spec `Policy.omit`) |
| `missing-docs-spec` | error | `docs-spec.md` not found in `.docs/` or repo root at scaffold start |
| `first-success-mismatch` | warning | Getting Started tutorial does not reflect spec `First success` outcome |
| `doc-type-mismatch` | warning | e.g. `reference` top-level in Getting Started |

## Reporting to the user

Summarize:

- `docs.json` path (note slim outline — plan blocks are on pages)
- Journey spine and **nested sub-groups** per section (list structure)
- Stubs created; point to **section index pages** for traceability tables
- **`unmappedCapabilityIds`** with recommended action
- `validation.issues` and `cliCheck` result
- Next: preview site, then **docs-write** (strips plan blocks)

## Additional resources

- Editorial spec: [docs-spec](../docs-spec/SKILL.md)
- User journeys: [user-journeys.md](user-journeys.md)
- Semantic nesting: [semantic-grouping.md](semantic-grouping.md)
- Component grouping: [component-grouping.md](component-grouping.md)
- Example: [docs.example.json](docs.example.json) — fictional Taskflow; schema only
- Stub MDX: [stub-templates.md](stub-templates.md)
- CLI: [cli.md](cli.md)
- Diátaxis: [diataxis-routing.md](diataxis-routing.md)
- Sidebar IA: [sidebar-ia.md](sidebar-ia.md)
- Capability inventory: [docs-inventory](../docs-inventory/SKILL.md)
