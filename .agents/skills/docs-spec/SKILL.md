---
name: docs-spec
description: >-
  Gathers editorial documentation intent through a short interactive interview
  and writes docs-spec.md. Use before docs-scaffold, when planning doc IA,
  defining personas and journeys, or when the user mentions docs-spec, doc brief,
  or documentation strategy. Does not scan source code or build docs-inventory.json.
---

# Docs Spec

Capture **who documentation is for** and **what story it should tell** before inventory or IA work. Output is `docs-spec.md` — a human-reviewable editorial contract for downstream skills.

## Pipeline position

```
docs-spec        →  .docs/docs-spec.md        ← you are here
docs-inventory   →  .docs/docs-inventory.json
docs-scaffold    →  docs.json + stub .mdx + docs check
docs-write       →  full .mdx content
```

`docs-spec` runs **first** when starting a new documentation effort. Re-run only when positioning, persona, or journey priorities change — not on every code change.

## Project layout

Write to `.docs/docs-spec.md` at the project root. Path resolution: [docs-scaffold — Project layout](../docs-scaffold/SKILL.md#project-layout).

## Scope

**In scope**
- Interactive interview (4–6 questions)
- Write or update `docs-spec.md` from confirmed answers
- Optional: suggest `scanFocus` areas for [docs-inventory](../docs-inventory/SKILL.md)

**Out of scope**
- Scanning source code or writing `docs-inventory.json`
- Building `docs.json`, tabs, sidebar, or stub pages
- Writing documentation prose

## Output location

Resolve path per [docs-scaffold — Project layout](../docs-scaffold/SKILL.md#project-layout):

1. User-specified path
2. `.docs/docs-spec.md` (create `.docs/` if needed)
3. Repo-root `docs-spec.md` (legacy fallback — update in place)

## When to skip the interview

If `docs-spec.md` exists and the user did not ask to refresh it:

- Read the file and confirm it still matches intent (one sentence to the user).
- Proceed only with explicit confirmation or a scoped update request.

If the file is missing or the user asks to re-spec:

- Run the full interview below.

## Interview protocol

Ask **one question at a time**. Offer 2–4 concrete options derived from the repo when possible (README one-liner, package name, obvious CLI vs library). Allow custom answers.

Copy and track progress:

```
Docs Spec Progress:
- [ ] 1. Positioning — one-sentence product purpose
- [ ] 2. Primary persona — who docs lead with
- [ ] 3. First success — end-to-end win readers should achieve first
- [ ] 4. Journey spine — ordered goals for Getting Started → Guides
- [ ] 5. Policy — omit and defer-advanced
- [ ] 6. Confirm — show draft spec; write on approval
```

### Question 1: Positioning

> In one sentence, what is this product for?

Use the answer verbatim in `## Positioning`.

### Question 2: Primary persona

> Who is the **primary** documentation reader?

| Option | When |
| --- | --- |
| `contributor` | Authors or maintainers of content in the product |
| `integrator` | Developers wiring the product into another system |
| `operator` | People deploying, running, or monitoring it |
| `end-user` | Non-technical users of the product UI |

Set `primaryPersona` to one value. Note secondary personas in `## Audience`.

### Question 3: First success

> What should a new reader **complete end-to-end** before anything else?

Examples: “Publish a docs site from a GitHub repo”, “Send first API request”, “Run the CLI init command and see output”.

Record:
- `firstSuccess.outcome` — plain-language result
- `firstSuccess.hints` — optional capability id guesses or surface areas (CLI command, config file, API path); downstream skills refine against `docs-inventory.json`

### Question 4: Journey spine

> After first success, what goals matter most — in order?

Present 3–6 `userGoal` ids from [user-goals.md](user-goals.md). Pre-check boxes that fit the product (e.g. `author-content` for docs/Markdown products, `integrate` for API-first SDKs).

Build `## Journeys` as an **ordered** list. First journey should align with `first-success`.

### Question 5: Policy

> What should documentation **omit** or **defer to advanced**?

Capture two lists:

| List | Meaning |
| --- | --- |
| `omit` | Capability themes or ids not worth documenting (internal-only, marketing, redundant) |
| `advancedOnly` | Document only in Core Concepts or nested Advanced — not Getting Started |

If unsure, default `omit` to empty and `advancedOnly` to architecture/internals themes.

Do **not** ask about tabs, sidebar groups, or page slugs — those are [docs-scaffold](../docs-scaffold/SKILL.md) decisions, informed by `docs-inventory.json` and [sidebar-ia.md](../docs-scaffold/sidebar-ia.md).

### Question 6: Confirm

Show the full draft `docs-spec.md` (from [docs-spec.template.md](docs-spec.template.md)). On approval:

- Set `updatedAt` to today (`YYYY-MM-DD`)
- Write the file
- Tell the user the next step: run [docs-inventory](../docs-inventory/SKILL.md) if `docs-inventory.json` is missing or stale, then [docs-scaffold](../docs-scaffold/SKILL.md)

## Output format

Follow [docs-spec.template.md](docs-spec.template.md). Required sections:

| Section | Purpose |
| --- | --- |
| `Positioning` | One-sentence product purpose |
| `Audience` | `primaryPersona` + optional secondary tags |
| `First success` | Outcome + optional hints |
| `Journeys` | Ordered `userGoal` spine |
| `Policy` | `omit`, `advancedOnly` |
| `Notes` | Freeform constraints (tone, competitors, legal) |
| `Scan focus` | Optional paths/themes for docs-inventory |

Do **not** duplicate `docs-inventory.json` capability lists. Hints and themes only.

## Create vs update

**Creating:** Run full interview; write new file from template.

**Updating:** Read existing spec; ask which sections changed; merge; bump `updatedAt`. Preserve stable journey ids unless the user reorders priorities.

## Quality bar

A good spec answers:

1. **Who** reads first? (`primaryPersona`)
2. **What** do they achieve on day one? (`firstSuccess`)
3. **In what order** do goals appear? (`Journeys`)
4. **What** is intentionally out of scope? (`Policy.omit`)

A poor spec lists every feature, copies README marketing fluff without decisions, or mirrors `docs-inventory.json` structure.

## Reporting to the user

After writing:

- Output path
- `primaryPersona` and `firstSuccess.outcome`
- Journey spine (ordered goal ids)
- Omit/advanced counts
- Next steps: docs-inventory → docs-scaffold

## Additional resources

- Template: [docs-spec.template.md](docs-spec.template.md)
- Example (fictional Taskflow): [docs-spec.example.md](docs-spec.example.md)
- User goal ids (shared with docs-scaffold): [user-goals.md](user-goals.md)
- Downstream IA: [docs-scaffold](../docs-scaffold/SKILL.md)
