# Phase 3: Add depth

## Resuming from cold context

Read before starting:

- `.docs/scaffold-plan.md` — **approved** clusters tagged `depth`
- `docs.json` — spine from Phase 2
- `.docs/docs-inventory.json`
- [sidebar-ia.md](../sidebar-ia.md)
- [stub-templates.md](../stub-templates.md)

## Goal

Add **customize**, **comparisons**, and **concepts** clusters without reference-tab bulk.

Typical output: **5–12 additional pages** on root tab.

## Scope (in)

Clusters tagged `depth`:

- **Configuration** — merged customize how-tos (theme + logo, sidebar + tabs, etc.) + optional single `docs.json` reference hub
- **Comparisons & migrations** — from spec Notes (editorial; `capabilityIds: []`)
- **Core Concepts** — spec `advancedOnly` / `understand` topics only

## Scope (out)

- API / CLI / Components reference tabs → Phase 4
- Per-endpoint or per-config-key explosion

## Step 3a. Configuration merges

Apply [references/merge-rules.md](../references/merge-rules.md):

| Prefer | Avoid |
| --- | --- |
| "Customize theme and branding" how-to (`customize`) | Separate theme, logo, header pages |
| "Configure navigation and tabs" how-to | Separate sidebar, tabs, locales pages |
| One `docs.json` reference hub (`lookup`) | 10+ field-level pages in Getting Started |

`docType` split within a topic is OK: one `how-to` + one `reference` when goals differ.

## Step 3b. Place on root tab

Order groups per spec journey after integrate spine:

1. Getting Started (unchanged from Phase 2)
2. Guides (unchanged or extended)
3. **Configuration** — depth customize clusters
4. **Comparisons & migrations** — if in plan (editorial)
5. **Core Concepts** — advanced-only; never before Quickstart

Nest sub-groups when ≥2 categories with ≥3 pages — see [sidebar-ia.md](../sidebar-ia.md).

## Step 3c. Extend outline + stubs

Same rules as Phase 2:

- Sync `outline.pages` for every new leaf
- Rich plan blocks with merge rationale
- No `_rationale` in JSON

## Step 3d. Validate (light)

- `architecture-before-action` — warning if Core Concepts precedes Guides without tutorial
- `doc-type-mismatch` — warning if `reference` top-level in Getting Started
- `max-groups-per-tab` — ≤7 top-level groups on root tab

## CHECKPOINT

Show:

- New groups added (Configuration, Comparisons, Concepts)
- Merge summary (e.g. "13 config capabilities → 4 pages")
- Updated page count

Ask: *Approve depth before reference tabs?*

**Do not proceed to Phase 4 until approved.**
