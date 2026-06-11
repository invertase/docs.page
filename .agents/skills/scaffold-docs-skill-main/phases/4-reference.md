# Phase 4 — Reference

For each module in `reference/<module>.md`, produce close-to-pure API spec.

## Resuming from cold context

To start or resume this phase, read:

- `overall-structure.md` — for the reference module list
- The codebase modules being documented
- Any existing files under `reference/`

You don't need Getting Started or Diving Deeper content for this phase — Reference doesn't draw from them.

## Per-module structure

For each module:

- One-line purpose for the module
- Each public class/function/symbol: signature, parameters with types and meanings, return value, exceptions/errors, brief purpose statement

Reference does not need the three-pass treatment. Draft each module in one pass, then user reviews.

## The kickback rule

If you find yourself wanting more than one or two sentences of *intent* for any symbol, stop. That symbol probably belongs in a Diving Deeper topic instead.

When this happens:

- Flag the symbol for the user
- Consult `references/diving-deeper-heuristics.md` if needed to confirm
- Add to `overall-structure.md` as a new DD candidate
- Do not bloat the Reference entry. Keep it minimal!

**CHECKPOINT.** User reviews each module file.
