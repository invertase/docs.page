# Phase 1: Discovery and overall structure

## Resuming from cold context

To start this phase, you need:

- The codebase the user wants documented (path or repo)
- Any existing docs to *reference* but not rely on

If `overall-structure.md` already exists and is approved, this phase is complete. Move to Phase 2 (`phases/2-getting-started.md`).

## 1a. Read the codebase

Read the codebase yourself to infer its purpose and shape. Existing documentation may be referenced for context, but assume it is incomplete or stale. Pay attention to:

- Public exports and entry points
- Naming choices and module boundaries
- Comments, docstrings, and TODOs (clues to developer intent)
- Tests and example code (clues to actual usage patterns)
- Code smells or rough edges (often poorly documented elsewhere)

## 1b. Identify primary and secondary audiences

Documentation is written *for* someone. Before discussing use cases or buckets, lock who.

Propose **3 candidate primary audiences**, each with:

- A short, plain-language label (e.g., *Backend engineers integrating into a production service*)
- A 1–2 sentence description: who they are, what context they bring, what they care about

Base the candidates on the codebase. A UI library's audience differs from a security tool's, a data-science library's, a CLI's. Existing READMEs and example directories often hint at intent.

Present the three. **The user picks exactly one primary.** They may also write in their own if none fit.

After the primary is locked, propose **up to 3 secondary audiences** the same way. The user picks however many apply, from zero to three.

Record the selections at the top of `overall-structure.md` (when you write it in step 1e) in this shape:

```
## Audiences

**Primary:** <label>
<1–2 sentence description>

**Secondary:**
- <label> — <description>
- ...
```

### Primary is supreme

When writing choices conflict over what to explain, what example to choose, or what to skip, the primary audience wins. Apply the three questions in `references/audience-check.md` with the primary in mind.

Secondary audiences are **tie-breakers**: useful when serving the primary leaves ambiguity, and useful during reviews to scan for unnecessary exclusion. They never outrank the primary.

## 1c. Propose candidate use cases

List 3–5 things this audience might realistically want to do with this library. For each, give:

- A one-sentence description
- **Resonance**: how likely this is to match what the primary audience wants
- **Coverage**: how many of the library's important components would be touched if this were the Getting Started tutorial
- **Pros / cons** as the Getting Started use case

Present the list to the user and ask them to pick one.

## 1d. Inventory all topics and tag them

Enumerate every topic the docs could cover. Tag each as `GS`, `DD`, or `Ref`, with a one-line justification.

**Read `references/diving-deeper-heuristics.md` before tagging.** It defines the tests for what belongs in Diving Deeper vs. Reference.

Tag with the primary audience in mind. A topic that would be Reference-only for a senior engineer might be Diving Deeper for a beginner, because the *intent* needs explaining.

## 1e. Produce overall-structure.md

Write `overall-structure.md` containing:

- **Audiences section** (primary + secondary), in the shape shown in 1b
- The selected primary use case
- Top-level outline of Getting Started: each step + which components/technologies it covers
- List of Diving Deeper topics: each with its intent and the use cases/components it covers
- Reference items: list of modules to be documented as pure API spec

**When you name Getting Started steps and Diving Deeper topics, read `references/headline-style.md` first.** Name them by the action the reader takes, not the bare noun. These names propagate into later phases, so getting them right here saves rework.

## CHECKPOINT

Save the file, show its path, and ask the user to review and edit. They should actively decide:

- Which Diving Deeper topics get written up (the user picks, and not every candidate must be written)
- The order and grouping of Getting Started steps
- Anything moved between buckets

Do not proceed until the user returns approved edits. The next phase will read this file fresh. It is the durable handoff. Suggest the user clear context before continuing if the conversation has grown long.
