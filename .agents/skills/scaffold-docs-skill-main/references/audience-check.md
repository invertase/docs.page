# Audience check

Great documentation is written for specific people. The primary audience (selected in Phase 1b, recorded at the top of `overall-structure.md`) governs every writing choice. Secondary audiences are tie-breakers and review prompts.

Apply these three questions during structural decisions (Pass A and Pass B of Phase 2; Pass A of Phase 3), during prose drafting (Pass C of Phase 2; Pass B of Phase 3), and during user review of any pass.

## The three questions (primary audience)

1. **Does this make sense to the primary audience, or does it require additional explanation?**

   Check that prerequisite concepts are either familiar to this audience or explicitly introduced. If a paragraph assumes knowledge the primary audience doesn't reliably have, scaffold the missing concept first or link to existing scaffolding. The bar is *reliably has* — not *might have if they're sharp*.

2. **Have we sufficiently scaffolded the topic for the primary audience to learn incrementally, with low difficulty and high engagement?**

   The reader should never face a step that requires three things they haven't seen yet. Each new concept should rest on concepts already introduced. The progression should feel achievable, not overwhelming. If a section drops the reader off a cliff, restructure — even if it costs an extra paragraph upstream.

3. **Have we explicitly tied the benefits this technology offers to matters the primary audience cares about?**

   The audience has motivations: performance, safety, productivity, learnability, control, cost, time-to-first-output. When introducing a feature or design decision, name the benefit in terms the audience values. *"This avoids allocating in the hot path"* lands for a systems engineer; *"this means your notebooks stay responsive"* lands for a data scientist. Same feature, different framing.

## Secondary audiences

When primary-audience choices leave ambiguity, several framings may serve the primary equally. Check whether one of them also serves the secondaries. That breaks the tie.

When reviewing drafted prose, scan once for the primary, then a lighter pass with the secondaries:

- Does anything in this paragraph actively *exclude* a secondary audience?
- If yes, is the exclusion necessary, or is there a phrasing that still serves the primary and includes the secondaries?

**Never compromise the primary to serve a secondary.** A doc that serves three audiences poorly is worse than one that serves one audience well.

## When the primary doesn't apply

A topic outside the primary audience's needs belongs in Diving Deeper, not Getting Started. Low-level internals belong there, for example, when the docs' primary audience is application users. If the topic must appear, write it with the audience it *does* serve in mind, and label it clearly so the primary audience can skip it without fear of missing something.

## Applying the questions

These questions are not a one-time check. They run continuously:

- **Pass A (Phase 2):** When choosing code examples, ask question 1 (will the primary audience understand this code?) and question 2 (does the sequence of examples scaffold incrementally?).
- **Pass B (Phase 2) and Pass A (Phase 3):** When labeling paragraphs, ask question 1 (is this topic recognizable to the primary audience?) and question 2 (does the order build up rather than dropping the reader in mid-air?).
- **Pass C (Phase 2) and Pass B (Phase 3):** All three questions apply to every paragraph. Question 3 matters most. Naming the benefit in audience-relevant terms is where prose earns its keep.
- **User review:** The user can apply these questions too. If the user is the primary audience, their gut reaction is the answer. If not, they should read with the primary audience's eyes.
