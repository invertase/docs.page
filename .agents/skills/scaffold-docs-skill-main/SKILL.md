---
name: scaffold-docs
description: Write documentation for a code library through an iterative top-down workflow with user review at each layer. Use whenever the user asks to document a codebase, library, or package — including phrases like "write docs for…", "document this library", "write technical docs", or any request to produce sustained documentation rather than inline code comments. The skill organizes output into Getting Started, Diving Deeper, and Reference sections, builds them progressively (structure → headers → topic sentences → paragraphs), and pauses for user review between each pass. Includes embedded prose-style guidance (Strunk & White) applied during every prose pass.
---

# Scaffold Docs

Build technical documentation for a code library iteratively, top-down, with user review at each step. Doc writing is a subset of writing. Prose quality is in scope, not only structure.

## Core principles

These shape every decision. Hold to them.

1. **Write for a specific audience.** You write documentation *for* someone. The primary audience (selected in Phase 1b) governs every later choice: use case, scaffolding, benefit framing, what to explain, what to skip. Apply `references/audience-check.md` throughout. Secondary audiences are tie-breakers; they never outrank the primary.
2. **Mental model first.** Documentation gives the reader a working mental model of the library, not a transcript of the code. When deciding what to include or cut, ask: does this advance the reader's mental model?
3. **User's mental model, not package layout.** Group content by what the reader is trying to do. Source-code directory structure is rarely the right structure for the docs.
4. **Why over what.** When a design decision matters for understanding or correct usage, explain *why* it was made, not only *what* it is. Use code comments, naming choices, and code smells as evidence of intent.
5. **Surface only the dependencies a reader needs.** For any topic, identify what it depends on, then communicate only the dependencies necessary to form a working mental model for *that* topic.
6. **Progressive disclosure.** The reader should never have to understand the whole library to start using it. Layer the docs so they can stop at any depth and still have a usable mental model.
7. **Iterate, never one-shot.** Each phase ends in a user review. Do not proceed to the next pass until the user has approved the current one.
8. **Clear but not dry.** Prose quality is part of the deliverable. Apply `references/prose-style.md` during every prose pass.

## Output structure

Three buckets. Each has its own purpose, structure, and file layout.

- **Getting Started**: `getting-started.md`. One end-to-end tutorial, narrative, covering a single representative use case that touches the library's most important components. Approachable. After reading or working through it, the reader has enough mental model to explore on their own.
- **Diving Deeper**: `diving-deeper/<topic>.md`, one file per topic. Per topic: intent of the topic, design decisions and the reasons for them, then a walk through the relevant API organized by the *intent* of each object (not alphabetical).
- **Reference**: `reference/<module>.md`, one file per module. Close to pure API spec. Organized by class/function/module. Lookup-oriented, not narrative.

## Workflow overview

```
Phase 1: Discovery and overall structure          → phases/1-discovery.md         [USER REVIEW]
  (read code → audiences → use case → topic inventory → overall-structure.md)
Phase 2: Build Getting Started in three passes    → phases/2-getting-started.md   [USER REVIEW × 3]
  Pass A: headers + learning bullets + code blocks
  Pass B: sub-headers + paragraph topic sentences (≤20 words, single SVO, no `; : — – ()`)
  Pass C: full paragraphs (using references/prose-style.md)
Phase 3: Build each selected Diving Deeper topic  → phases/3-diving-deeper.md     [USER REVIEW × 2 per topic]
Phase 4: Build Reference                          → phases/4-reference.md         [USER REVIEW per module]
```

## How to use this skill

Each phase has its own file under `phases/`. **Load only the phase you're currently working on.**

**Between phases, you may clear context.** The artifacts on disk (`overall-structure.md`, `getting-started.md`, etc.) are the durable handoff. Each phase file begins with a "resuming from cold context" section listing exactly which files to read to get caught up before starting that phase. Use this when the conversation has gotten long, when crossing sessions, or whenever clearing improves focus.

**Reference files** under `references/` are loaded as needed:

- `references/audience-check.md`: required reading at the start of Phase 2 and Phase 3. The primary audience (selected in Phase 1b) governs every writing choice.
- `references/diving-deeper-heuristics.md`: used in Phase 1d for tagging topics, and in Phase 4 for kickback decisions.
- `references/headline-style.md`: required reading at the structural passes that coin section names (Phase 1e, Phase 2 Pass A, Phase 3 Pass A). Names sections by the reader's action, not the bare noun. Loaded earlier than prose-style, which loads at the prose passes.
- `references/prose-style.md`: required reading before *any* prose pass (Pass C of Phase 2; Pass B of Phase 3). Phase files signal exactly when.

## Execution rules (apply across all phases)

- **Always show file paths** when you save a file.
- **Don't skip checkpoints**, even if the user seems eager. The iterative review is the point of the skill.
- **Don't write the next pass when fixing the current one.** If the user requests changes at Pass A, fix Pass A and return for review. Don't sneak in Pass B content.
- **If a phase is large** (e.g., 12 Diving Deeper topics), suggest tackling in batches and let the user prioritize.
- **Don't paraphrase code into prose.** If an API entry is self-explanatory from its signature, say so and move on. Mental-model commentary is for what isn't obvious from reading the code.
