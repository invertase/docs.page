# Phase 3 — Diving Deeper

For each topic the user selected in Phase 1d, build a file at `diving-deeper/<topic>.md`. Two passes per topic.

## Resuming from cold context

To start or resume this phase, read:

- `overall-structure.md` — for the selected DD topic list and the audience section at the top
- `references/audience-check.md` — the three questions to apply throughout this phase
- `getting-started.md` — so you don't repeat material covered there
- Any existing files under `diving-deeper/` — you may be resuming mid-topic

**The primary audience must stay front of mind throughout.** Apply the three audience-check questions to structural decisions (Pass A) and to prose (Pass B).

## Structure (fixed for every topic)

Diving Deeper is **not narrative**. The structure is:

1. **Intent**: what this topic is for, what problem it solves, when a reader needs it.
2. **Design decisions and reasons**: the choices that shape how this works, and why each was made. Use comments, naming, and code structure as evidence.
3. **API walkthrough**: the relevant interfaces, **organized by the intent of each object** (group by what the object is for, not alphabetically). Under each: list the interface, then describe what happens behind the scenes well enough to form a working mental model. Stop short of explaining every line.

## Pass A: Outline

Write the file with:

- The intent paragraph (a sentence or two of placeholder is fine)
- A list of design decisions (one line each, not yet justified)
- The API entries grouped by intent (signatures and one-line purposes only)

**Brevity discipline for every "one line" item above:** the four rules from Phase 2 Pass B apply (≤20 words, single subject–verb–object, no clause-joining punctuation, name the topic not the content). Run the same mandatory self-check after writing each line. If any check fails, delete and rewrite — don't edit. See `phases/2-getting-started.md` Pass B for the worked example. Without this discipline the user ends up reviewing the finished design decision rather than the *structure* of it.

**When you name the API-walkthrough groupings, read `references/headline-style.md`.** Name each group by the action it serves, not the bare noun. This applies to the intent-based groupings you create, not to the fixed section labels (Intent, Design decisions, API walkthrough).

**CHECKPOINT.** User reviews structure, grouping, and which design decisions are surfaced.

## Pass B: Fill in

**Before writing any prose, read `references/prose-style.md` AND `references/audience-check.md` and apply both as you draft.** Required.

Expand the design decisions with their reasons. Expand each API entry with the behind-the-scenes mental model. Apply the three audience-check questions to every paragraph — especially question 3, naming benefits in terms the primary audience cares about.

**CHECKPOINT.** User reviews.

## Loop

Process all selected topics. If new topics surface during writing, add them to `overall-structure.md` and ask the user whether to write them up.

If the user selected many topics (e.g., 12+), suggest tackling them in batches and let the user prioritize. Between batches is a natural place to clear context. Each topic file is self-contained, so resuming on the next batch only needs `overall-structure.md` and the codebase.
