---
version: "2.0.0"
updatedAt: YYYY-MM-DD
sourceSpec: .docs/docs-spec.md
sourceInventory: .docs/docs-inventory.json
---

# Scaffold plan

Approve the **nav tree** and **merge map** before Phases 2–4. Persona, journeys, and policy live in `docs-spec.md` — do not repeat them here.

## Nav

<!-- Primary review surface. Indent = sidebar nesting. Phase tag: [spine|depth|ref] -->

```
Documentation (/)
├── Getting Started [spine]
│   ├── Overview  /
│   └── Quickstart  /quickstart
├── Guides [depth]
│   └── …
…

API (/api) [ref]
├── …

CLI (/cli) [ref]
├── …

Components (/components) [ref]
├── …
```

## Budget

| Phase | Pages |
| --- | --- |
| Spine | |
| Depth | |
| Reference | |
| **Total** | |

## Merge map

<!-- href → capability ids. Editorial pages: _(editorial)_. Component leaves: one id each. -->

| href | capabilities |
| --- | --- |
| `/quickstart` | `id-1`, `id-2` |
| `/configuration/reference` | `config-theme`, … |

## Decisions

<!-- Non-obvious merges/splits only — max ~10 bullets. No per-page prose. -->

- Quickstart merges publish + preview + validate (spec: one first-success tutorial).
- Config: 4 how-tos + `/configuration/reference` hub — not per-schema-section pages.
- API: 5 grouped reference pages — not one page per route.

## Pairs

<!-- guide/concept href → reference href (for docs-write cross-links later) -->

| guide | reference |
| --- | --- |
| `/quickstart` | `/cli/commands` |
| `/concepts/mcp` | `/api/agent-and-mcp` |

## Omit

| id | reason |
| --- | --- |
| | spec policy |

## Defer

| id | reason |
| --- | --- |
| | optional later scaffold |
