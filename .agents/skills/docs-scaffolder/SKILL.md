---
name: docs-scaffolder
description: >-
  Builds a previewable documentation site from features.json. Produces slim
  docs.json, grouped component nav, stub MDX with on-page planning blocks, and
  docs.page CLI check. Use when planning doc structure, scaffolding a docs site,
  or when the user mentions docs-scaffolder, doc outline, or IA.
---

# Docs Scaffolder

Plan **where** documentation lives around **user goals**, scaffold **stub pages** with **visible planning context**, and **validate** the site compiles.

**Upstream:** `features.json` from [feature-finder](../feature-finder/SKILL.md). Read existing `docs.json` and `docs/**/*.mdx` when updating.

**Output:** slim `docs.json` + stub `.mdx` files + passing `docs check`.

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

## Slim `docs.json` principle

`outline` is a **machine index** for agents and validation — not a prose document. Traceability and rationale are **rendered on stub pages** (see [stub-templates.md](stub-templates.md)), not stored in JSON.

**Do not persist:** `rationale`, `relatedHrefs`, `splits`, `mappedCapabilityIds`, `mergedInto`, or per-capability traceability arrays.

**Do persist:** `pages[]` with fields below, `coverage.unmappedCapabilityIds` only, and `validation`.

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
| `capabilityIds` | yes | `features.json` ids (`[]` for editorial) |
| `audience` | yes | `end-user`, `integrator`, `operator`, `contributor` |

### `outline.coverage`

```json
{
  "unmappedCapabilityIds": ["internal-metrics"]
}
```

Compute mapped coverage at report time from `pages[].capabilityIds`. List unmapped ids in the **user report** with suggested action. Do not store reverse maps in JSON.

### `status` values

| Status | Scaffolder action |
| --- | --- |
| `existing` | Do not overwrite `.mdx` |
| `new` | Create stub → set `stub` |
| `stub` | Skip unless file missing |
| `retire` | Do not create stub |

Set `outline.validation.passed: true` only when IA errors are resolved **and** `cliCheck.passed` is true.

## Execution protocol

```
Docs Scaffolder Progress:
- [ ] 1. Ingest — read features.json, docs.json, scan docs/**/*.mdx
- [ ] 2. Journeys — map user goals (read user-journeys.md)
- [ ] 3. Inventory — list existing pages and hrefs
- [ ] 4. Cluster — group/split capabilities by user goal (not kind alone)
- [ ] 5. Components — split + categorize (read component-grouping.md)
- [ ] 6. Route — assign docType (read diataxis-routing.md)
- [ ] 7. Place — tabs + sidebar with icons (read sidebar-ia.md)
- [ ] 8. Sync — slim outline.pages (no rationale in JSON)
- [ ] 9. Validate IA — populate validation.issues
- [ ] 10. Write — save docs.json
- [ ] 11. Stub — MDX with plan blocks (read stub-templates.md)
- [ ] 12. CLI — docs check (read cli.md); fix until pass
- [ ] 13. Report — unmapped capabilities + preview reminder
```

## Step 5: Components

1. **Split** — one page per `surface.ui` entry ([sidebar-ia.md](sidebar-ia.md))
2. **Categorize** — nest into sub-groups when > 7 component leaves ([component-grouping.md](component-grouping.md))
3. Section overview at `tab.href` uses **section index** stub with child traceability table

## Step 7: Tab bar

Section root `href` on every tab; landing page + section index stub. See [sidebar-ia.md](sidebar-ia.md).

## Step 11: Stub MDX

Read [stub-templates.md](stub-templates.md).

| Page type | Template |
| --- | --- |
| Section landing (`href` = tab `href`) | Section index + traceability table |
| All other stubs | Documentation plan `<Info>` block + docType body |

Compose rationale and related links **in the plan block only**. Pull capability titles from `features.json`.

When re-stubbing `status: stub` pages, replace entire file (plan block + placeholders).

## IA validation rules

| Rule | Severity | Check |
| --- | --- | --- |
| `max-groups-per-tab` | error | ≤ 7 top-level sidebar groups per tab |
| `max-siblings-per-group` | error | ≤ 7 leaf pages per group; nest if more |
| `component-flat-list` | warning | > 7 component leaves in one flat group |
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
| `unmapped-capability` | warning | Capability not in any `capabilityIds` |
| `doc-type-mismatch` | warning | e.g. `reference` top-level in Getting Started |

## Reporting to the user

Summarize:

- `docs.json` path (note slim outline — plan blocks are on pages)
- Journey spine and component sub-groups
- Stubs created; point to **section index pages** for traceability tables
- **`unmappedCapabilityIds`** with recommended action
- `validation.issues` and `cliCheck` result
- Next: preview site, then **docs-writer** (strips plan blocks)

## Additional resources

- User journeys: [user-journeys.md](user-journeys.md)
- Component grouping: [component-grouping.md](component-grouping.md)
- Example: [docs.example.json](docs.example.json) — fictional Taskflow; schema only
- Stub MDX: [stub-templates.md](stub-templates.md)
- CLI: [cli.md](cli.md)
- Diátaxis: [diataxis-routing.md](diataxis-routing.md)
- Sidebar IA: [sidebar-ia.md](sidebar-ia.md)
- Capability inventory: [feature-finder](../feature-finder/SKILL.md)
