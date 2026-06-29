---
name: docs-sitemap-architect
description: >-
  Generates a comprehensive documentation sitemap and page outline based on the
  coverage scope and target audience, utilizing the Diátaxis framework, plain
  language principles, and competitor analysis. Use when planning documentation
  IA, structuring a docs sitemap, or when the user mentions
  docs-sitemap-architect, docs outline, or sitemap architecture.
---

# docs-sitemap-architect

Generate a documentation sitemap and page outline from **coverage scope** and **primary audience**. Output is `.docs/docs-outline.md` only — do not create or modify `docs.json`, `.mdx` files, or other site artifacts.

## Pipeline position

```
docs-spec              →  .docs/docs-spec.md
docs-inventory         →  .docs/docs-inventory.json
docs-sitemap-architect →  .docs/docs-outline.md   ← you are here
docs-write             →  full .mdx content
```

**Downstream:** [docs-write](../docs-write/SKILL.md) — only after the author approves the outline.

## Inputs

Read when available; incorporate without re-interviewing for intent already in the spec.

| Input | Use |
| --- | --- |
| `.docs/docs-spec.md` | Audience, journeys, omit/defer policy — [docs-spec](../docs-spec/SKILL.md) |
| `.docs/docs-inventory.json` | Capability surface for coverage scope — [docs-inventory](../docs-inventory/SKILL.md) |

User-provided scope and audience override missing files.

## Project layout

```
project-root/
  .docs/
    docs-spec.md
    docs-inventory.json
    docs-outline.md          # written by this skill
```

Resolve `.docs/` paths:

1. User-specified path
2. `.docs/docs-outline.md` (create `.docs/` if needed)
3. Repo-root `docs-outline.md` (legacy fallback)

## Principles

**Audience** — One primary audience governs every choice. Build a mental model (intent and why); exhaustive detail belongs in reference pages and inventory.

**Architecture** — Organize by user goals, not source tree. Review competitor or equivalent doc structures before finalizing. Tag every page with a Diátaxis type: Tutorial, How-to, Reference, or Explanation.

**Style** — Plain language; warm, clear, bias-free tone. Titles and headings name **one focus** — no `and`, `&`, or commas joining concepts (`Theme and branding` → `Site branding`; `Agents & AI` → `AI agents`). Purpose sentences in the sitemap table may use normal prose.

## Write `.docs/docs-outline.md`

1. **Audience mental model** — Who this serves and the core mental model to build.
2. **Competitor analysis** — Structural patterns in similar docs; how this outline adapts or simplifies.
3. **The sitemap** — Journey-ordered section groups. Per page, provide **Page Title**, **Diátaxis Type**, **MoSCoW priority** (Must have | Should have | Could have | Won't have), and a **Purpose** (1–2 sentences).
4. **Self-review** — Answer: *Does this give the audience everything they need whilst keeping the docs simple?* Fix coverage gaps and any title/heading violations.
5. **Author review prompt** — Pause for human approval; do not proceed to page content until the sitemap is approved.

Show the output path when saving.
