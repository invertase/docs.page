# Prose style guidance

Required reading before any prose pass in this skill: Pass C of Phase 2, and Pass B of Phase 3.

Apply the rubric below while drafting. Use it as a working checklist as you write, not as a post-hoc review.

The goal is **clear but not dry**: definite, specific, concrete language with varied sentence shape, not flat declarative monotone, and not ornament either.

## How to use

**Before drafting a paragraph:**

- Identify what the paragraph is for. One topic per paragraph.
- Plan to lead with nouns and verbs that carry the meaning.

**While drafting:**

- Active voice.
- Statements in positive form.
- Definite, specific, concrete language.
- Keep related words together.
- Coordinate ideas in similar form.

**After drafting a paragraph, before moving on:**

- Cut every word that isn't pulling weight.
- Check the final clause: does the emphatic word land at the end?
- Read the sequence of sentences. Are they all the same shape? Vary.
- Strip qualifiers: *rather*, *very*, *little*, *pretty*, *quite*, *somewhat*, *fairly*.
- Scan for banned filler words (see *Always cut* below): *just*, *really*, *truly*, *genuine(ly)*, *actually*, *exactly*, *finally*, *simply*.
- Cut any sales-y closing tail — wrap-up sentences, congratulations, restatements.
- Scan for em dashes, semicolons, and colons. For each, rewrite the surrounding passage rather than substituting the mark (see *Rewrite the shape* below).

## Always cut: filler words and sales-y tails

These tics bleed authority. They're characteristic of LLM-generated prose. For an LLM writing prose, scrubbing these is higher-leverage than half the rubric below.

### Banned filler words

Default rule: **delete on sight, then check that the sentence still works.** It almost always does.

- **just** — "you just need to call..." → "call..."
- **really** — "this is really useful" → "this is useful"
- **truly** — "truly powerful" → cut
- **genuine / genuinely** — "a genuine problem" → "a problem" (or name the problem)
- **actually** — "the function actually returns..." → "the function returns..."
- **exactly** — "this is exactly what you need" → cut, or name what it is
- **finally** — banned as an intensifier ("finally, a tool that..."); fine as a real ordinal ("the final step")
- **simply** — same pattern as *just*

Exception: when the word carries real semantic load. *Just* survives in "the deadline is just before noon" (meaning *shortly before*). Test: does removing the word change the meaning? If no, delete.

### Banned closing tails

LLM prose tends to end paragraphs and sections with congratulatory or wrap-up sentences that add nothing. Forbidden patterns:

- *And that's it!*
- *That's all you need to know.*
- *Now you're ready to...*
- *This is what makes X so powerful.*
- *It's that simple.*
- Any sentence that restates what the paragraph just said in different words.
- Any sentence that congratulates the reader or talks up the library.

End paragraphs on the last substantive point. The closing slot is for real content, not a victory lap.

## Show, don't tell

Good documentation shows what the library does. It does not tell the reader how to feel about it. The same discipline that governs headlines (`references/headline-style.md`) governs prose.

- **No hype.** Cut value-adjectives that assert quality without showing it: *powerful*, *seamless*, *effortless*, *blazing-fast*, *robust*, *flexible*. Show the behavior instead. "Handles 10,000 requests per second" beats "blazing-fast." It is *definite, specific, concrete* applied to value claims.
- **No badmouthing alternatives.** Don't define the library against competitors. Drop *better than X*, *unlike clunky Y*, *the modern alternative to Z*. Superiority claims read as marketing and date fast. Neutral orientation for migrators is fine ("coming from Express, the equivalent is...").

## Rewrite the shape: em dashes, semicolons, and colons

These three marks share a failure mode. They appear when a sentence tried to carry more content than it could hold. The model wants to add an aside, an elaboration, a second clause, a list, or a definition, and reaches for one of these marks to keep stitching.

**The wrong fix is to substitute the punctuation** — em dash to comma, semicolon to period, colon to period. That keeps the underlying shape and produces the same overloaded sentence. The result usually reads clunkier than the original.

**The right fix is to rewrite the whole passage, avoiding the structure that produced the mark.** Look at what the sentence was trying to do. Most often, one of these moves works:

- **Split into two sentences.** If the original used a semicolon or em dash to join related ideas, give each idea its own sentence. The relationship between them often reads cleaner without the explicit join.
- **Reverse the structure.** Often the part after the mark is the real point. Lead with it. *"The library is fast — under 200ms for typical requests"* becomes *"The library handles typical requests in under 200ms."*
- **Cut the elaboration.** If what came after the mark was bonus information, ask whether it earns its place. Often it doesn't.
- **Restructure the paragraph.** Sometimes the second half of the sentence is its own paragraph's worth of thought. Let it be.

This rule applies in two situations: when reviewing your own draft, and when asked to edit existing prose to remove these marks. In both cases, do not just replace the mark. Read the whole sentence and often the whole paragraph. Identify what the sentence was trying to do. Then rewrite from scratch in a different shape.

### Exceptions

- Colons introducing a list (one followed by bullets or comma-separated items) are fine.
- Colons in code, file paths, ratios, and times are fine.
- A single em dash for emphasis can be fine if used rarely. If you wrote one, the next ten sentences should not need one too.

## High-leverage rules

If you remember only a handful, these produce the biggest improvements:

- **Omit needless words.** Every phrase justifies itself. *In the event that* → *if*. *At this point in time* → *now*. *Due to the fact that* → *because*.
- **Use the active voice.** *The parser reads the file* beats *the file is read by the parser*.
- **Definite, specific, concrete.** *Tuesday* beats *recently*. *200 milliseconds* beats *quickly*.
- **Nouns and verbs over adjectives and adverbs.** Weak verb + adverb is almost always replaceable by a stronger verb. *Walked quickly* → *strode*.
- **Avoid qualifiers.** *Pretty good*, *rather slow*, *very important* — drop them or replace with the specific.
- **Emphatic words at the end.** Sentences carry their weight at the end. Don't fritter the closing slot.
- **Do not overwrite.** Resist ornament. The plainer sentence usually wins.

## The full rubric

### Elementary rules of usage

- Form the possessive singular with `'s` (Charles's).
- Serial comma in a series of three or more.
- Enclose parenthetic expressions in commas.
- Comma before a coordinating conjunction joining independent clauses.
- No comma splices.
- No sentence fragments (do not break sentences in two).
- Colon to introduce a list, appositive, amplification, or quotation.
- Dash to mark an abrupt break or long appositive.

### Principles of composition

- Choose a suitable design and hold to it.
- Make the paragraph the unit of composition (one topic per paragraph).
- Use the active voice.
- Put statements in positive form.
- Use definite, specific, concrete language.
- **Omit needless words.**
- Avoid a succession of loose sentences.
- Express coordinate ideas in similar form (parallelism).
- Keep related words together.
- In summaries, keep to one tense.
- Place the emphatic words of a sentence at the end.

### An approach to style

- Place yourself in the background.
- Write in a way that comes naturally.
- Work from a suitable design.
- Write with nouns and verbs, not adjectives and adverbs.
- Revise and rewrite.
- Do not overwrite.
- Do not overstate.
- Avoid qualifiers (rather, very, little, pretty).
- Do not affect a breezy manner.
- Use orthodox spelling.
- Do not explain too much.
- Do not construct awkward adverbs.
- Make sure the reader knows who is speaking.
- Avoid fancy words.
- Do not use dialect unless your ear is good.
- Be clear.
- Do not inject opinion.
- Use figures of speech sparingly.
- Do not take shortcuts at the cost of clarity.
- Avoid foreign languages.
- Prefer the standard to the offbeat.

## Tone

Apply the guidance without flattening voice. Match the document's existing register, don't turn a literary line into corporate prose, and don't turn casual instructions into formal English. Aim for brief, direct, and specific.
