# Audience check

The **primary persona** lives in `.docs/docs-spec.md` — do not re-interview. Secondary audiences are tie-breakers only.

Apply during Phase 1 clustering and Phase 2 spine placement.

## Three questions (primary persona)

1. **Does this make sense without extra unexplained context?**

   Prerequisites must be familiar to the primary persona or introduced earlier in the spine.

2. **Is the progression incremental?**

   No step should require three concepts the reader hasn't seen. Quickstart → author-content → customize → integrate.

3. **Are benefits framed for what this audience cares about?**

   Contributors care about time-to-publish and authoring ergonomics. Integrators care about endpoints and config. Name benefits accordingly.

## Secondary audiences

When primary-serving choices are ambiguous, prefer phrasing that also helps secondaries — but **never compromise the primary**.

Topics outside the primary's needs belong in depth or reference, not Getting Started.

## Spec mapping

| Spec field | Scaffold use |
| --- | --- |
| `primaryPersona: contributor` | Short Getting Started; author-content early |
| `primaryPersona: integrator` | Shorter GS; integrate guides earlier |
| `First success` | Exactly one `first-success` tutorial |
| `Journeys` order | Sidebar group priority on root tab |
