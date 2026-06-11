---
name: docs-writer
description: >-
  Transforms raw product inputs into structured user-facing documentation using
  the Diátaxis framework. Routes requests to Tutorial, How-To, Reference, or
  Explanation; places pages in the sidebar IA; applies writing and style
  guardrails. Use when writing docs, creating doc pages, updating docs.json
  navigation, outlining documentation, or when the user mentions docs-writer,
  Diátaxis, technical writing, or documentation architecture.
---

# Documentation Writer

Transform raw engineering inputs into pristine, user-facing documentation. This skill decides **what kind** of doc to write, **where** it lives in navigation, and **how** to write it.

**Upstream input:** Prefer `features.json` from [feature-finder](../feature-finder/SKILL.md). Read cited `sources` in code when behavior is unclear. Do not invent capabilities not grounded in code or user-provided notes.

**Downstream output:** `.mdx` pages, `docs.json` sidebar updates, and placement recommendations.

## Scope

**In scope**

- Classify doc type (Diátaxis router)
- Propose or update sidebar placement (`docs.json`)
- Write or revise `.mdx` content with correct tone and structure
- Run a self-correction pass before delivering

**Out of scope**

- Building `features.json` (use feature-finder)
- Marketing copy, changelogs, or release notes unless explicitly requested
- Translating entire doc sets (handle one locale at a time)

## Execution protocol

Copy and track progress:

```
Docs Writer Progress:
- [ ] 1. Ingest — gather inputs (features.json, user notes, existing docs)
- [ ] 2. Route — classify Diátaxis doc type; reject mixed modes
- [ ] 3. Place — read sidebar-ia.md now; Global IA Sync against docs.json sidebar
- [ ] 4. Outline — read templates.md now; generate page skeleton for the doc type
- [ ] 5. Draft — write content with tone and formatting rules
- [ ] 6. Lint — read style-lint.md now; run self-correction pass
- [ ] 7. Deliver — write files; summarize changes to user
```

**Mandatory sub-module reads:** At steps 3, 4, and 6, read the linked file before continuing. Do not skip or substitute from memory.

---

## 1. Diátaxis routing engine

**System guardrail:** Analyze incoming raw feature notes. If the notes contain API payloads, route to **Reference**. If they describe a multi-step user workflow, route to **How-To**. Never mix reference material into a tutorial.

### Intent classification matrix

| Doc type        | Orientation            | Goal                                                         | Agent focus                                                                                |
| --------------- | ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| **Tutorial**    | Learning-oriented      | Help a beginner achieve a small, successful outcome          | "Show, don't explain." Strict step-by-step, safe sandbox, zero conceptual deep-dives       |
| **How-To**      | Task-oriented          | Help an experienced user solve a specific real-world problem | "Problem-solution." Practical, assumes basic product knowledge, focuses on the recipe      |
| **Reference**   | Information-oriented   | Describe the machinery (APIs, schemas, UI elements)          | "Truth and completeness." Austere, highly structured (tables, exact types), zero narrative |
| **Explanation** | Understanding-oriented | Clarify background, architecture, or philosophy              | "Context and clarity." Discursive, uses analogies, answers _why_                           |

### Routing decision tree

1. **User says "learn", "first time", "onboarding", "try it"** → Tutorial
2. **User says "how do I", "configure", "fix", "migrate", "set up X for Y"** → How-To
3. **Input is schemas, endpoints, config keys, CLI flags, component props** → Reference
4. **User asks "why", "how does it work", "architecture", "concepts"** → Explanation
5. **Ambiguous** → Ask once: learning path, task recipe, lookup table, or conceptual overview?

### Mixed-input rules

| Signal in input                                | Action                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| API payload + workflow steps                   | Split: Reference page + How-To page (or link Reference from How-To) |
| Architecture + setup steps                     | Split: Explanation page + Tutorial/How-To                           |
| Single capability, multiple audiences          | One primary doc type; link others in **Next Steps**                 |
| `kind: api` or `kind: export` in features.json | Default to Reference unless user requests How-To                    |
| `kind: workflow` or `kind: cli` with steps     | Default to How-To unless audience is first-time                     |

### Router output (state before writing)

Emit internally (or show user when unclear):

```yaml
docType: how-to # tutorial | how-to | reference | explanation
audience: integrator # from features.json audience tags or user context
capabilityIds: [rate-limiting]
rationale: "Multi-step config task for experienced operators"
splits: [] # other doc types needed as separate pages
```

---

## 2. Information architecture engine

Goal: **answers in under 30 seconds** — users find the right page fast.

### 30-second sidebar heuristics

- **Rule of 7±2:** Top-level sidebar groups per tab must not exceed 7 items
- **Three-click max:** No document deeper than 3 levels (`Category → Sub-category → Article`)
- **Progressive disclosure:** Hide advanced config behind nested groups or link to Reference pages so beginners are not overwhelmed

### Global IA Sync workflow

**Read [sidebar-ia.md](sidebar-ia.md) now** before placing or updating any page.

When placing a new or updated page:

1. **Scan** — Read `docs.json` `sidebar` (and `tabs` if multi-tab). Build a mental tree of groups → pages → nested groups.
2. **Match persona** — Map `audience` tags to the best parent group:

   | Audience      | Typical parent groups          |
   | ------------- | ------------------------------ |
   | `end-user`    | Getting Started, Guides        |
   | `integrator`  | Configuration, API, Components |
   | `operator`    | Publishing, CLI, Advanced      |
   | `contributor` | Contributing, Development      |

3. **Propose placement** — Single best parent group + `href` slug. Prefer existing groups over creating new ones.
4. **Validate** — Check depth ≤ 3, group size ≤ 7, no duplicate `href`, tab `id` matches sibling pages.
5. **Update** — Patch `docs.json` sidebar entry; create `.mdx` file at matching path under `docs/`.

### Page outline anchors

**Read [templates.md](templates.md) now** before outlining or drafting.

After routing, pick a skeleton from `templates.md`. Every page includes frontmatter:

```yaml
---
title: Human-readable title
description: One sentence for search and social cards
---
```

Use doc-type-specific sections (e.g. Tutorial: no API tables; Reference: no "In this tutorial").

---

## 3. Content execution engine

### Role

Senior Technical Writer & Docs Architect. Transform raw engineering inputs into pristine, user-facing documentation strictly following the Diátaxis framework.

### Writing rules

- **Imperative & active voice:** Start steps with strong verbs. Write _"Click **Submit**"_ not _"The user should then click the submit button"_.
- **Cognitive load:** Break any paragraph longer than 3 lines into bullets or smaller chunks.
- **Why before how:** Never tell a user to toggle a setting without stating the outcome. _"To reduce latency, toggle **Edge Caching** to ON."_
- **Semantic UI formatting:** Bold UI elements as they appear (`Settings > Billing`). Wrap code, paths, env vars, and keys in backticks.
- **Truthfulness:** Every behavioral claim must trace to `features.json` sources or code you read. Mark `beta`/`schema-only`/`deprecated` status explicitly.

### docs.page format conventions

- Content files: `docs/**/*.mdx` (GFM + MDX)
- Config: `docs.json` at repo root (`sidebar`, `tabs`, `anchors`)
- **Tutorials / How-Tos:** Use `<Steps>` / `<Step>` for sequential procedures ([steps component](/docs/components/steps.mdx))
- **Reference:** Use `<Property>` for config fields and API params; nest `<Accordion>` for large schemas
- **Callouts:** Use `<Info>`, `<Warning>`, `<Error>`, or `<Success>` — not `<Callout>` (unsupported)
- **Code:** Fenced blocks with language tags; use `<CodeGroup>` when showing equivalent commands

### Self-correction pass

**Read [style-lint.md](style-lint.md) now** before delivering. Run every checklist item. Strip fluff phrases, fix voice, verify Diátaxis purity (no tutorial tone in reference pages).

---

## Working from features.json

For each capability (or user-selected subset):

1. Read `title`, `summary`, `kind`, `audience`, `status`, `surface`, `configuration`, `writingNotes`
2. Route by `kind` + user intent (see matrix above)
3. Pull implementation detail from `sources` paths when `writingNotes` or `summary` is insufficient
4. Cross-link `related` capabilities in **Next Steps** or **See also**

| kind          | Default doc type      | Typical placement        |
| ------------- | --------------------- | ------------------------ |
| `feature`     | How-To or Explanation | Guides                   |
| `api`         | Reference             | API / Configuration      |
| `cli`         | How-To + Reference    | CLI tab                  |
| `export`      | Reference             | API / SDK                |
| `component`   | Reference + How-To    | Components tab           |
| `integration` | How-To                | Guides                   |
| `workflow`    | How-To or Tutorial    | Getting Started / Guides |

---

## Create vs update

**New page**

1. Run full protocol (route → place → outline → draft → lint)
2. Create `docs/{slug}.mdx` and add sidebar entry in `docs.json`

**Update existing page**

1. Read current `.mdx` and sidebar entry
2. Re-route: confirm doc type still fits; if not, propose split or refactor
3. Preserve stable `href`; change `title`/`description` only when accuracy requires it
4. Lint diff mentally: no new fluff, no scope creep into wrong Diátaxis mode

**Batch (many capabilities)**

1. Group by proposed doc type and sidebar parent
2. Prefer one How-To per task and one Reference per surface area over dozens of micro-pages
3. Report a placement table before writing when &gt; 3 pages

---

## Reporting to the user

After completing the task, summarize:

- Doc type(s) chosen and routing rationale
- Files created or updated (`docs/...`, `docs.json`)
- Sidebar placement (group, tab, depth)
- Capabilities covered (`id`s from features.json)
- Intentional splits or follow-up pages recommended
- Anything left `schema-only` or unverified in code

## Additional resources

- Page skeletons by doc type: [templates.md](templates.md)
- IA and docs.json patterns: [sidebar-ia.md](sidebar-ia.md)
- Style lint and banned phrases: [style-lint.md](style-lint.md)
- Capability inventory: [feature-finder](../feature-finder/SKILL.md)
