# Phase 1: Plan structure

## Resuming from cold context

Read before starting:

- `.docs/docs-spec.md` — persona, journeys, first success, policy (link only in plan)
- `.docs/docs-inventory.json` — capabilities (merge, do not mirror 1:1)
- [references/topic-buckets.md](../references/topic-buckets.md)
- [references/merge-rules.md](../references/merge-rules.md)
- [scaffold-plan.template.md](../scaffold-plan.template.md)

If `.docs/scaffold-plan.md` exists **and** the user has approved it, Phase 1 is complete → [2-spine.md](2-spine.md).

## Goal

Produce a **lean** `.docs/scaffold-plan.md` — nav preview + merge map — before writing `docs.json` or stubs.

**Target length:** ~80–150 lines. If the plan exceeds ~200 lines, you are writing too much.

## What belongs in the plan

| Section | Purpose |
| --- | --- |
| **Nav** | Indented tree — primary human review surface |
| **Budget** | Page counts by phase |
| **Merge map** | `href` → capability ids (machine handoff) |
| **Decisions** | Non-obvious merges/splits only (~10 bullets max) |
| **Pairs** | Guide/concept → reference links for stubs |
| **Omit / Defer** | Compact tables |

## What does NOT belong

Do **not** include in `scaffold-plan.md`:

- Audiences, journeys, first-success prose (already in `docs-spec.md`)
- Per-page `docType`, `userGoal`, `audience`, `description` (→ `outline.pages` in Phase 2+)
- Per-page "Why merged" paragraphs (→ **Decisions** bullets in scaffold-plan only)
- Feature classification audits, archetype essays, IA principle essays
- "Resolved from review" changelogs (→ chat / PR comment)
- Editorial briefs for docs-write (→ spec Notes or stub plans)

Keep agent reasoning in the conversation; keep the artifact scannable.

## Steps

### 1a. Ingest spec

Read `.docs/docs-spec.md`. If missing, stop → [docs-spec](../../docs-spec/SKILL.md).

Use spec for clustering decisions only — **do not copy** into the plan.

### 1b. Scan inventory

Read `.docs/docs-inventory.json`. Group by **reader task**, not `kind`.

### 1c. Tag topics

Tag each topic: `spine` | `depth` | `reference` | `omit` | `defer`. See [topic-buckets.md](../references/topic-buckets.md).

### 1d. Merge clusters

Apply [merge-rules.md](../references/merge-rules.md). Name pages with [headline-style.md](../references/headline-style.md).

Build:

1. **Nav tree** with phase tags `[spine]`, `[depth]`, `[ref]`
2. **Merge map** rows — one per leaf `href`
3. **Decisions** — only surprises (e.g. "13 config keys → 1 reference hub")
4. **Pairs** — integrate guide ↔ API group

### 1e. Tabs

Record in nav tree roots only: `/`, `/api`, `/cli`, `/components`. Section-root `href` — see [sidebar-ia.md](../sidebar-ia.md).

### 1f. Write scaffold-plan.md

Use [scaffold-plan.template.md](../scaffold-plan.template.md) exactly. No extra sections.

## CHECKPOINT

Save `.docs/scaffold-plan.md`. Ask the user to review **only the nav tree** and **decisions** bullets.

- Too many pages?
- Spine short enough?
- Merges right?

**Do not write `docs.json` until approved.**
