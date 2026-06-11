---
name: docs-scaffold
description: >-
  Builds a previewable docs.page site from docs-spec.md and docs-inventory.json
  through a phased, review-gated workflow. Produces slim docs.json, grouped nav,
  and stub MDX with planning blocks. Use after docs-spec and docs-inventory when
  scaffolding documentation IA, or when the user mentions docs-scaffold.
---

# Docs Scaffold

Plan **where** documentation lives around **reader goals**, not code layout. Scaffold **stub pages** with **visible planning context**, and **validate** the site compiles.

Build iteratively with **user review between phases**. Do not one-shot 60+ pages.

## Core principles

Hold these over every checklist item.

1. **Spec is supreme for editorial intent.** `.docs/docs-spec.md` sets persona, journeys, first success, omit/defer policy. [docs-spec](../docs-spec/SKILL.md) already ran — do not re-interview. When spec and heuristics conflict, spec wins.
2. **Reader mental model over inventory layout.** Group by what the reader is trying to do. `docs-inventory.json` describes machinery; navigation describes tasks. **Default is merge; split only when `userGoal` or `docType` differ.**
3. **Progressive disclosure.** Spine first (Getting Started + core Guides), then depth (Configuration, comparisons), then reference tabs (API, CLI, Components). The contributor should have a short path to first success before wading through lookup pages.
4. **Iterate with checkpoints.** Each phase ends in user review. Do not proceed until the user approves. Artifacts on disk are the durable handoff.
5. **Slim `docs.json`, rich stubs.** Traceability and merge rationale live in **stub plan blocks** — never in `outline.pages` as `_rationale`, `splits`, or similar.
6. **Guide + reference pairing.** Integrator features get a **how-to in Guides** and **grouped reference** in API/CLI — not duplicate one-page-per-endpoint trees with no relationship.

## Pipeline position

```
docs-spec        →  .docs/docs-spec.md
docs-inventory   →  .docs/docs-inventory.json
docs-scaffold    →  docs.json + stub .mdx + docs check   ← you are here
docs-write       →  full .mdx content
```

**Upstream (required):** `.docs/docs-spec.md`, `.docs/docs-inventory.json`. Path resolution: [Project layout](#project-layout).

**Downstream:** [docs-write](../docs-write/SKILL.md) strips `{/* docs-scaffold-plan-* */}` blocks.

## Project layout

```
project-root/
  docs.json
  docs/**/*.mdx
  .docs/
    docs-spec.md
    docs-inventory.json
    scaffold-plan.md          # written in Phase 1; durable handoff
```

Resolve `.docs/` paths per: user override → `.docs/` → repo-root legacy.

## Output artifacts

| Artifact | When | Purpose |
| --- | --- | --- |
| `.docs/scaffold-plan.md` | Phase 1 | Topic inventory, merges, deferrals, tab strategy — **user approves before nav** |
| `docs.json` | Phases 2–4 | Site config + slim `outline` |
| `docs/**/*.mdx` | Phases 2–4 | Preview stubs with plan blocks |

### Slim `outline` (required fields only)

**Top-level:** `version`, `updatedAt`, `sourceInventory`, `pages[]`, `coverage.unmappedCapabilityIds`, `validation`

**Per page:** `href`, `title`, `description`, `icon`, `docType`, `userGoal`, `status`, `file`, `capabilityIds`, `audience`

**Never persist:** `_rationale`, `rationale`, `relatedHrefs`, `splits`, `mappedCapabilityIds`, `mergedInto`

## Workflow overview

```
Phase 1: Plan structure           → phases/1-plan.md           → .docs/scaffold-plan.md     [USER REVIEW]
Phase 2: Build spine              → phases/2-spine.md           → docs.json (spine pages)    [USER REVIEW]
Phase 3: Add depth                → phases/3-depth.md           → docs.json (+ depth pages)  [USER REVIEW]
Phase 4: Add reference + validate → phases/4-reference.md      → docs.json + stubs + check  [USER REVIEW]
```

**Load only the phase file you are working on.** Each phase lists files to read when resuming from cold context.

## Reference files (load when signaled)

| File | Use |
| --- | --- |
| [references/topic-buckets.md](references/topic-buckets.md) | Tag topics spine / depth / reference / omit / defer |
| [references/merge-rules.md](references/merge-rules.md) | Merge-first clustering; anti-patterns |
| [references/audience-check.md](references/audience-check.md) | Primary persona from spec; spine decisions |
| [references/headline-style.md](references/headline-style.md) | Name pages by reader action |
| [stub-templates.md](stub-templates.md) | MDX plan blocks and section indexes |
| [sidebar-ia.md](sidebar-ia.md) | Tabs, href roots, icons, nesting |
| [cli.md](cli.md) | `docs check` validation |

## Execution rules

- **Show file paths** when saving artifacts.
- **Do not skip checkpoints** — even if the user seems eager.
- **Do not advance phases on your own** after a checkpoint. Wait for explicit approval.
- **Do not one-shot all pages.** Phase 2 typically yields 8–15 spine pages; Phase 4 adds reference bulk.
- **Ban generic stub plans.** Every plan block needs a concrete merge/split sentence (see [stub-templates.md](stub-templates.md)).
- **Preserve** existing `docs.json` keys (`name`, `logo`, `theme`, `agent`, `social`) when updating.
- **Do not overwrite** `status: existing` MDX unless the user requests it.

## Phase summary

### Phase 1 — Plan

Read spec + inventory. Inventory topics, tag buckets, propose **merged page clusters**. Write `.docs/scaffold-plan.md`. **Stop for review.**

### Phase 2 — Spine

Implement approved **spine** and **guide** clusters only: Overview, Quickstart (`first-success`), author-content, core integrate how-tos. Write `docs.json` sidebar + `outline.pages` + stubs. **Stop for review.**

### Phase 3 — Depth

Add **depth** clusters: Configuration (merged customize pages), comparisons from spec Notes, Core Concepts (advanced-only). Extend `docs.json` + stubs. **Stop for review.**

### Phase 4 — Reference

Add **reference** tabs (API, CLI, Components) as **grouped** pages — not one leaf per inventory entry. Run `docs check`. **Stop for final review.**

## Reporting

After each phase, summarize:

- Artifacts written (paths)
- Page count added this phase vs deferred
- Merge decisions (clusters, not inventory ids)
- `unmappedCapabilityIds` and why (omit policy vs defer)
- Open questions for the user

After Phase 4, also report `validation.issues`, `cliCheck`, and next step: **docs-write**.

## Additional resources

- Phase 1: [phases/1-plan.md](phases/1-plan.md)
- Phase 2: [phases/2-spine.md](phases/2-spine.md)
- Phase 3: [phases/3-depth.md](phases/3-depth.md)
- Phase 4: [phases/4-reference.md](phases/4-reference.md)
- Plan template: [scaffold-plan.template.md](scaffold-plan.template.md)
- Example plan shape: [docs.example.json](docs.example.json) (Taskflow — schema only)
- Upstream: [docs-spec](../docs-spec/SKILL.md), [docs-inventory](../docs-inventory/SKILL.md)
