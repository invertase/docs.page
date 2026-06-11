# Phase 2: Build spine

## Resuming from cold context

Read before starting:

- `.docs/scaffold-plan.md` — **approved** page clusters tagged `spine`
- `.docs/docs-spec.md` — first success, journeys
- `.docs/docs-inventory.json` — capability detail for clusters
- Existing `docs.json` and `docs/**/*.mdx` (preserve `status: existing`)
- [sidebar-ia.md](../sidebar-ia.md)
- [stub-templates.md](../stub-templates.md)

## Goal

Implement **spine + core guide** clusters from the approved plan. Typical output: **8–15 pages**.

## Scope (in)

Clusters tagged `spine` in scaffold-plan, usually:

- Overview (`orient`)
- Quickstart (`first-success`) — **must match spec outcome**
- Author-content how-tos (writing, navigation, preview, GitHub bot)
- Core integrate how-tos (AI chat, llms.txt, MCP) when in spine section of plan

## Scope (out)

- Configuration reference bulk → Phase 3
- Comparisons, Core Concepts → Phase 3
- API / CLI / Components tabs → Phase 4

## Step 2a. Build sidebar (root tab only)

For spine pages only:

1. **Getting Started** group — Overview + Quickstart first; nest author-content sub-group if ≥3 pages
2. **Guides** group — integrate how-tos from spine clusters; nest by theme if ≥2 categories with ≥3 pages

Read [sidebar-ia.md](../sidebar-ia.md) for icons, href slugs, nesting.

Do **not** add API/CLI/Components tabs yet.

## Step 2b. Sync outline.pages

For each sidebar leaf, add `outline.pages` entry:

| Field | Source |
| --- | --- |
| `docType`, `userGoal`, `audience` | From cluster in scaffold-plan |
| `capabilityIds` | Merged ids from cluster |
| `status` | `existing` if MDX exists and user didn't request overwrite; else `stub` |
| `icon` | Match sidebar leaf exactly |

**Never add `_rationale` or other forbidden fields.**

## Step 2c. Write docs.json

- Merge into existing `docs.json` — preserve branding keys
- Set `outline.sourceInventory` to `.docs/docs-inventory.json`
- Set `outline.version`, `outline.updatedAt`
- `tabs`: root tab only for now (unless plan puts a spine page elsewhere)
- `outline.coverage.unmappedCapabilityIds`: ids from omit policy + not-yet-scaffolded phases

## Step 2d. Write stubs

Create/update stubs for new `status: stub` pages only.

Every plan block **must** include:

- Concrete `$RATIONALE` — why merged, where in journey (not "Scaffold stub — replace…")
- Full `capabilityIds` list with titles from inventory

See [stub-templates.md](../stub-templates.md).

## Step 2e. Validate (light)

Check locally — do not require full `docs check` yet if reference tabs are missing:

- `missing-first-success` — error if no tutorial in Getting Started
- `missing-user-goal`, `missing-audience`, `missing-icon` — errors
- `sidebar-outline-sync` — errors
- No `_rationale` in outline

Record issues in `outline.validation.issues`; `passed` may be `false` until Phase 4.

## CHECKPOINT

Show:

- Sidebar tree (spine only)
- Page count
- Quickstart cluster ↔ spec first-success mapping
- Sample plan block from Quickstart stub

Ask: *Approve spine before adding Configuration and reference tabs?*

**Do not proceed to Phase 3 until approved.**
