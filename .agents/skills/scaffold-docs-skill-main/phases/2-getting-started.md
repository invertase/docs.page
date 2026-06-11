# Phase 2 — Getting Started

Three passes. Stop for review after each.

## Resuming from cold context

To start or resume this phase, read:

- `overall-structure.md` — the approved structure from Phase 1, including the audience section at the top
- `references/audience-check.md` — the three questions to apply throughout this phase
- `getting-started.md` if it exists — you may be resuming mid-pass; the file's depth tells you which pass is in progress
- `deferred-topics.md` if it exists

**The primary audience must stay front of mind throughout all three passes.** Apply the three audience-check questions during structural decisions (Pass A and Pass B) and during prose drafting (Pass C), not just at the end.

## Sidecar: deferred topics

Maintain `deferred-topics.md` throughout this phase. Whenever you're tempted to digress in Getting Started, write the digression idea to this file and continue without including it in the tutorial. After Pass C, these are reviewed as Diving Deeper candidates.

## Pass A — Section headers, learning bullets, and code

Write `getting-started.md` containing, for each section:

- The section header, in narrative order
- A bulleted list of what the reader will learn in that section
- The code block(s) the reader will encounter and run in that section

**Before writing the section headers, read `references/headline-style.md`.** Name each section by the action the reader takes, not the bare noun. Show the benefit through the action. Never assert it with value-words, and never position against other tools.

**The code is part of the structure, not filler added later.** A tutorial's real skeleton is the sequence of code samples; the prose is scaffolding around them. Setting the code arc before the prose ensures the prose serves the code, not the other way around.

Draw code from the codebase's existing examples and tests where possible. Compose minimal new examples from the real API surface where needed. If you aren't confident in a snippet, leave a `// DRAFT` or `# TODO` comment so the user catches it at the checkpoint.

No prose between bullets and code. No paragraph drafts. Structure plus code only.

**CHECKPOINT.** User reviews and edits: header order, learning bullets, and, most importantly, the code arc. The full tutorial path is now visible end-to-end.

## Pass B — Sub-headers + paragraph topic sentences

Update `getting-started.md`. For each section:

- Add sub-headers as needed
- Under each sub-header, write *only the topic sentence* of each paragraph that will eventually exist there

**A topic sentence is a label for the paragraph, not a summary of it.** The point of this pass is to verify that the paragraph is in the right place and about the right thing. Pass C delivers the actual explanation. Topic sentences here will feel short and incomplete — that's correct.

### Four hard rules

The failure mode is the topic sentence turning into "the whole paragraph stuffed into one sentence." Without strict rules, every relaxed constraint becomes a smuggling channel.

1. **≤ 20 words.** Count if you have to.
2. **Single subject–verb–object.** One subject, one main verb, one object or complement. **No compound predicates** ("does X, Y, and Z"). No second independent clause.
3. **No clause-joining punctuation anywhere in the sentence.** Banned: `;`, `:`, `—`, `–`, `()`. These are how extra content gets smuggled in. Commas are fine for ordinary use but not for stitching on extra material.
4. **Name the topic, not the contents.** The sentence answers *what is this paragraph about?* — not *what does this paragraph say?*

### Mandatory self-check after every topic sentence

Before moving to the next sentence, answer all four:

- Word count ≤ 20?
- Banned punctuation count = 0?
- One subject, one main verb, one object — no compound predicate?
- After this sentence, does the body paragraph still have something to deliver?

If any answer is no: **delete the sentence and rewrite from scratch.** Do not edit the long version. Editing produces a slightly shorter long sentence. Starting over produces a short sentence.

### A failure caught in the wild

❌ *"ReAct is a test-time loop: the model is given a set of tools, reasons about which one to call next, observes the result, and either calls another tool or finishes with a response — repeating that thought-act-observe cycle until it has what it needs."*

50 words. A colon. An em-dash. Nine verbs. The entire concept of ReAct compressed into one sentence — and nothing left to say in the body paragraph.

✓ *"ReAct is a test-time loop."*

Six words. One subject, one verb, one complement. The body paragraph at Pass C covers the details: tools, the thought-act-observe cycle, when it terminates.

**CHECKPOINT.** User reviews. They are checking: is this the paragraph I want? in the right place?

## Pass C — Full paragraphs

**Before writing any prose, read `references/prose-style.md` AND `references/audience-check.md` and apply both as you draft.** Required, not optional.

Expand each approved topic sentence into a complete paragraph. Allow the *why* of design decisions to surface here when it strengthens the reader's mental model. Do not over-explain. Getting Started should remain approachable.

Apply the three audience-check questions to every paragraph as you write. Question 3 (tying benefits to what the primary audience cares about) is where prose earns its keep. Ensure each design decision or feature names its benefit in terms the audience values.

**CHECKPOINT.** User reviews the full Getting Started.

## Wrap-up

After the final checkpoint, review `deferred-topics.md`. Propose any new entries as Diving Deeper candidates and add them to `overall-structure.md` if the user approves.

The next phase will read `overall-structure.md` and `getting-started.md` fresh — suggest the user clear context if the conversation has grown long.
