# Phase 2: Build spine

## Resuming from cold context

Read before starting:

- `.docs/scaffold-plan.md` — **approved**; implement `[spine]` leaves from **Nav** + **Merge map**
- `.docs/docs-spec.md` — first success outcome, primary persona
- `.docs/docs-inventory.json` — titles for stubs
- Existing `docs.json` and `docs/**/*.mdx`
- [references/topic-buckets.md](../references/topic-buckets.md)
- [sidebar-ia.md](../sidebar-ia.md)
- [stub-templates.md](../stub-templates.md)

## Goal

Implement **`[spine]` pages** from the plan nav tree only.

## Scope

**In:** Nav entries tagged `[spine]` (typically Getting Started — Overview + Quickstart).

**Out:** `[depth]` and `[ref]` entries → Phases 3–4.

If the approved plan puts only 2 pages in spine, implement only those — do not add pages not in the nav tree.

## Steps

### 2a. Sidebar (root tab)

Build sidebar for `[spine]` hrefs only. Icons and nesting per [sidebar-ia.md](../sidebar-ia.md).

### 2b. outline.pages

For each spine leaf:

| Field | Source |
| --- | --- |
| `capabilityIds` | **Merge map** row for `href` |
| `docType`, `userGoal`, `audience` | [topic-buckets.md](../references/topic-buckets.md) + `docs-spec.md` |
| `title`, `description` | Nav label; one-line from inventory/spec |
| `status` | `existing` if MDX present; else `stub` |

No `_rationale` in JSON.

### 2c. docs.json

Root tab only (unless plan shows otherwise). Set `outline.sourceInventory`.

### 2d. Stubs

Minimal stubs per [stub-templates.md](../stub-templates.md) — frontmatter + `_TBD_` section headings only. No planning blocks in MDX.

## CHECKPOINT

Show spine nav subtree and page count. Approve before Phase 3.
