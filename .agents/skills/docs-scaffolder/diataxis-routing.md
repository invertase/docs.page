# Diátaxis routing

Assign exactly one `docType` per `outline.pages` entry in `docs.json`. Routing happens at scaffold time so the user can validate structure before any prose is written.

---

## Classification matrix

| Doc type | Orientation | Goal | Scaffold focus |
| --- | --- | --- | --- |
| **tutorial** | Learning-oriented | Beginner achieves one small outcome | "Show, don't explain." Steps only; no field tables |
| **how-to** | Task-oriented | Experienced user solves a specific problem | Problem → recipe → verify |
| **reference** | Information-oriented | Describe machinery (APIs, schemas, props) | Completeness; tables and signatures |
| **explanation** | Understanding-oriented | Clarify why / architecture / concepts | Discursive; no install steps |

---

## Decision tree

1. User or capability implies first-time learning → `tutorial`
2. Task, config, migration, troubleshooting → `how-to`
3. Schemas, endpoints, flags, props, env keys → `reference`
4. Architecture, design, mental models → `explanation`
5. Ambiguous → default from `kind` table in SKILL.md; note assumption in `rationale`

---

## Guardrails

**System guardrail:** If input contains API payloads, route to `reference`. If it describes a multi-step user workflow, route to `how-to`. Never assign `tutorial` to a page whose primary content is a lookup table.

### Mixed-input → split pages

| Signal | Action |
| --- | --- |
| API payload + workflow steps | Two pages: `reference` + `how-to`; link via `relatedHrefs` |
| Architecture + setup steps | Two pages: `explanation` + `tutorial` or `how-to` |
| CLI command + worked example | `reference` for flags; optional `how-to` for common task |
| Single capability, multiple audiences | One primary `docType`; secondary type gets a separate page |

Record splits in the page's `splits` array (href values).

---

## docType → outline implications

| docType | `title` pattern | `description` pattern | Placement hint |
| --- | --- | --- | --- |
| tutorial | Outcome noun phrase | "Build/complete X" | Getting Started |
| how-to | "How to {task}" | Problem + result | Guides, CLI |
| reference | "{Surface} reference" or noun | "Complete list of…" | Configuration, Components |
| explanation | Concept name | "How/why X works" | Concepts, Architecture |

---

## Validation warnings

Flag in `outline.validation.issues` when:

- `reference` page is top-level in Getting Started (`doc-type-mismatch`)
- `tutorial` page has >7 `capabilityIds` (likely should split)
- `explanation` page maps only to `kind: api` (likely should be `reference`)
- Page has no `capabilityIds` and `status: new` (editorial — note in `rationale`)
