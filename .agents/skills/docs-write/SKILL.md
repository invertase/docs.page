---
name: docs-write
description: >-
  Writes or revises MDX documentation pages from an approved docs.json outline.
  Applies Diátaxis templates, tone rules, style linting, and docs.page MDX
  components via published reference. Use when drafting doc page content,
  writing .mdx files, or when the user mentions docs-write, docs-writer, after
  approving a docs outline. Does not build docs-inventory.json or site IA.
---

# Docs Write

Write **prose** for pages that are already planned in `docs.json`. Routing and navigation belong to upstream skills.

## Pipeline position

```
docs-spec        →  .docs/docs-spec.md
docs-inventory   →  .docs/docs-inventory.json
docs-sitemap-architect →  .docs/docs-outline.md
docs-write       →  full .mdx content   ← you are here
```

**Upstream (required for new documentation efforts):** Approved `.docs/docs-outline.md` from [docs-sitemap-architect](../docs-sitemap-architect/SKILL.md). Stop and run docs-sitemap-architect first if missing — unless the user explicitly scopes a single page edit.

**Secondary input:** `.docs/docs-inventory.json` for capability detail; `.docs/docs-spec.md` for positioning and tone when drafting overview or tutorial pages. Resolve paths per [docs-sitemap-architect — Project layout](../docs-sitemap-architect/SKILL.md#project-layout). Read `sources` in code when `writingNotes` or `summary` is insufficient.

**Existing sites:** When `docs.json` with an `outline` block already exists, use `outline.pages` for page metadata alongside the approved outline.

**Output:** `.mdx` files at paths defined in `outline.pages[].file`.

## Scope

**In scope**
- Draft or revise `.mdx` for pages listed in `docs.json` `outline.pages`
- Match `docType` and `title` from the outline entry; write a reader-oriented `description` (rewrite outline purpose — do not copy inventory `summary`)
- Run style self-correction before delivering

**Out of scope**
- Editorial spec / persona interviews → [docs-spec](../docs-spec/SKILL.md)
- Building `docs-inventory.json` → [docs-inventory](../docs-inventory/SKILL.md)
- Planning site structure → [docs-sitemap-architect](../docs-sitemap-architect/SKILL.md)
- Marketing copy, changelogs, or release notes unless explicitly requested

## Reading the outline

Page metadata lives in `docs.json`:

```json
{
  "sidebar": [ "..." ],
  "outline": {
    "pages": [
      {
        "href": "/navigation",
        "title": "Navigation",
        "description": "...",
        "docType": "how-to",
        "status": "new",
        "file": "docs/navigation.mdx",
        "capabilityIds": ["sidebar-navigation"]
      }
    ]
  }
}
```

Find target pages by `href`, `status`, or user-specified list. The `sidebar` is already production-ready — no separate apply step.

## Execution protocol

```
Docs Writer Progress:
- [ ] 1. Confirm — outline approved; identify target hrefs or statuses
- [ ] 2. Load — read outline.pages entries + capabilityIds from docs-inventory.json
- [ ] 3. Template — read templates.md; pick skeleton for docType
- [ ] 3b. Components — read components.md; for each MDX component you plan to use, read the matching page at https://use.docs.page/components/… before drafting syntax
- [ ] 4. Draft — write .mdx with tone and formatting rules
- [ ] 5. Lint — read style-lint.md; run self-correction pass (description voice, intro duplication)
- [ ] 6. Deliver — write files; summarize changes
```

**Mandatory reads:** `templates.md` at step 3, `components.md` at step 3b, `style-lint.md` at step 5.

## Step 1: Confirm scope

Accept work only when:

- User has reviewed `docs.json` `outline`, or
- User specifies `href`s or `status: new` / `stub` pages to write, or
- User requests a targeted edit to an **existing** `.mdx` file

If the user asks to "document the product" without prior artifacts, respond in order: **docs-spec** → **docs-inventory** → **docs-sitemap-architect**, then docs-write.

Write priority:

1. `status: stub` (placeholder pages)
2. `status: new` (outline entry without a file — create full page)
3. `status: existing` (revisions)
4. Skip `status: retire` unless user asks for redirect stub

When replacing a stub, read the existing file first. Scope from `.docs/docs-outline.md`, `outline.pages` (if present), and `capabilityIds`.

## Step 2: Load page context

For each target entry in `outline.pages`:

| Field | Use for |
| --- | --- |
| `docType` | Template selection — do not override without user approval |
| `userGoal` | Scope and tone — prioritize task outcome over internal architecture |
| `title`, `description` | Frontmatter — `title` from outline; `description` rewritten for reader benefit (see Writing rules) |
| `capabilityIds` | Pull **body** detail from `docs-inventory.json` — not frontmatter voice |
| `icon` | Confirms nav entry; not used in MDX body |
| `file` | Output path |
| `audience` | Vocabulary and depth (beginner vs integrator) |
| `status` | `existing` → read current file first |

Also read `.docs/docs-outline.md` for page purpose, Diátaxis type, and cross-link context.

## Clean up stubs

Before delivering final content:

1. Replace all `_TBD_` placeholders with real content or delete empty sections
2. **Legacy stubs only:** if `{/* docs-scaffold-plan-start */}` markers exist, delete that block and any "Documentation plan" / "Section index" `<Info>` callouts
3. **Legacy stubs only:** remove **Pages in this section** traceability tables on section landings

## Step 3–5: Write and lint

### Writing rules

- **Imperative & active voice:** *"Click **Submit**"* not *"The user should click submit"*
- **Cognitive load:** Paragraphs ≤ 3 lines; use bullets
- **Why before how:** State outcome before each setting change
- **Reader-first descriptions:** Frontmatter `description` answers *why would I open this page?* — task, outcome, or common use case. Use second person or imperative (*"Use … to …"*, *"When you need …"*). Do not list props, implementation details, or copy `summary` text from inventory. Rewrite outline `description` / purpose; never paste capability summaries verbatim.
- **Description vs opening paragraph:** These are **different fields with different jobs** — never paraphrase one from the other. `description` = discoverability (search, nav, previews). Opening paragraph = scope, workflow position, or first action — see [templates.md — Description vs opening paragraph](templates.md#description-vs-opening-paragraph). **How-to and reference:** omit the opening paragraph when the first section (`## Before you begin` or first `##` group) already orients the reader.
- **Semantic UI formatting:** Bold UI labels; backtick code, paths, env vars
- **International English:** American spelling and conventions (`behavior`, `color`, `synchronize`, not British variants). See style-lint **Locale** checks.
- **Truthfulness:** Match `docs-inventory.json` and code; flag `beta` / `deprecated` / `schema-only`

### docs.page conventions

- Frontmatter: `title` from outline; `description` written per Writing rules
- MDX components are global — no imports required
- Component selection: [components.md](components.md); syntax from [use.docs.page/components](https://use.docs.page/components)
- Fenced code blocks need language tags (`bash`, `json`, `tsx`)

Honor `docType` from outline. Templates: [templates.md](templates.md). Lint: [style-lint.md](style-lint.md).

**Explanation pages:** Follow the Hook → Overview → How it works → Related skeleton. Do not add a standalone `## Design tradeoffs` section unless the outline explicitly calls for one — weave rationale into `## How it works` when needed.

## Create vs update

**New page (`status: new` | `stub`):** Write full `.mdx` from template.

**Existing page (`status: existing`):** Read current file; preserve accurate user-edited sections; align structure to `docType`.

**Batch:** For &gt; 3 pages, list queue and confirm before drafting all.

## Reporting to the user

Summarize:

- Pages written (`href`, `file`)
- `_TBD_` placeholders replaced
- `docType` followed per outline
- `capabilityIds` covered
- Lint fixes applied
- Outline pages not yet written
- Anything `schema-only` or unverified in code

## Additional resources

- Page skeletons: [templates.md](templates.md)
- MDX components: [components.md](components.md)
- Style lint: [style-lint.md](style-lint.md)
- Editorial spec (upstream): [docs-spec](../docs-spec/SKILL.md)
- Site outline (upstream): [docs-sitemap-architect](../docs-sitemap-architect/SKILL.md)
- Capability detail (upstream): [docs-inventory](../docs-inventory/SKILL.md)
