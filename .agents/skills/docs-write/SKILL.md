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

**Existing sites:** When `docs.json` with an `outline` block already exists, use `outline.pages` for page metadata alongside the approved outline. When `outline.pages` is absent, read `.docs/docs-outline.md` and match entries by `href` (derive `file` from the path, e.g. `/authoring/write` → `docs/authoring/write.mdx`).

**Output:** `.mdx` files at paths defined in `outline.pages[].file`, or derived from the outline `href` when no `file` field exists.

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
- [ ] 2. Load — read outline entries (`outline.pages` or `.docs/docs-outline.md` by `href`) + capabilityIds from docs-inventory.json
- [ ] 3. Template — read templates.md; pick skeleton for docType
- [ ] 3b. Components — read components.md; for each MDX component you plan to use, read the matching page at https://use.docs.page/components/… before drafting syntax
- [ ] 4. Draft — write .mdx with tone and formatting rules
- [ ] 5. Lint — read style-lint.md; run self-correction pass (description voice, intro duplication, fence tags, step why-first, hub scope)
- [ ] 6. Deliver — write files; summarize changes
```

**Mandatory reads:** `templates.md` at step 3, `components.md` at step 3b, `style-lint.md` at step 5.

## Step 1: Confirm scope

Accept work only when:

- User has reviewed `docs.json` `outline` or `.docs/docs-outline.md`, or
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

Resolve page metadata from `outline.pages` when present; otherwise parse `.docs/docs-outline.md` tables by `href` and infer `docType` from the Diátaxis Type column.

For each target entry:

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

Also read `.docs/docs-outline.md` for page purpose, Diátaxis type, content sections to include, and cross-link context (especially "do not include" / "link out" boundaries between sibling pages).

### Section-aware prerequisites

When drafting multiple pages in the same sidebar group, **do not copy-paste the same `## Before you begin` block on every page**.

- **First page in a section** (or a standalone page): full project prerequisites — `docs.json`, `docs/` layout, links to upstream tasks.
- **Later pages in the same section**: delta prerequisites only — what this task adds beyond siblings (e.g. "Pages already in the sidebar" on Organise, not re-stating the whole project setup).
- **Cross-link instead of repeat:** link to the sibling that establishes shared setup (e.g. [Write](/authoring/write), [Preview](/authoring/preview)).

### Hub how-to scope

Some how-tos are **section hubs** (e.g. Write) that cover several subtopics in one page. Keep hub pages task-oriented:

- **One** decision table or comparison per subtopic; **one** short inline example max.
- Link out for field lookup (Reference), component props (Components tab), and feature mechanics (Features tab) — do not reproduce those pages.
- Target **~120 lines** body content. If a draft exceeds that, move detail to a linked page and leave a one-sentence pointer.

## Clean up stubs

Before delivering final content:

1. Replace all `_TBD_` placeholders with real content or delete empty sections
2. **Legacy stubs only:** if `{/* docs-scaffold-plan-start */}` markers exist, delete that block and any "Documentation plan" / "Section index" `<Info>` callouts
3. **Legacy stubs only:** remove **Pages in this section** traceability tables on section landings

## Step 3–5: Write and lint

### Writing rules

- **Imperative & active voice:** *"Click **Submit**"* not *"The user should click submit"*
- **Cognitive load:** Paragraphs ≤ 3 lines; use bullets
- **Why before how:** State outcome before each setting change. In numbered steps, the **first bold phrase** should carry the why or outcome, not only the verb (*"**Declare navigation explicitly** — open `docs.json`…"* not *"**Open `docs.json**"*)
- **Reader-first descriptions:** Frontmatter `description` answers *why would I open this page?* — task, outcome, or common use case. Use second person or imperative (*"Use … to …"*, *"When you need …"*). Do not list props, implementation details, or copy `summary` text from inventory. Rewrite outline `description` / purpose; never paste capability summaries verbatim.
- **Description vs opening paragraph:** These are **different fields with different jobs** — never paraphrase one from the other. `description` = discoverability (search, nav, previews). Opening paragraph = scope, workflow position, or first action — see [templates.md — Description vs opening paragraph](templates.md#description-vs-opening-paragraph). **How-to and reference:** omit the opening paragraph when the first section (`## Before you begin` or first `##` group) already orients the reader.
- **Semantic UI formatting:** Bold UI labels; backtick code, paths, env vars
- **International English:** American spelling in body prose (`behavior`, `color`, `synchronize`). **Exception:** keep British spelling in nav labels and frontmatter `title` when the product sidebar uses it (e.g. `Organise`). See style-lint **Locale** checks.
- **Truthfulness:** Match `docs-inventory.json` and code; flag `beta` / `deprecated` / `schema-only`

### docs.page conventions

- Frontmatter: `title` from outline; `description` written per Writing rules
- MDX components are global — no imports required
- Component selection: [components.md](components.md); syntax from [use.docs.page/components](https://use.docs.page/components)
- Fenced code blocks need language tags — see style-lint **Fence language tags** (`text` for URL patterns and directory trees, never bare ` ``` `)

### Steps component vs ordered list

For how-tos and tutorials:

- **3+ sequential steps** that each include code blocks, screenshots, or sub-bullets → prefer `<Steps>` / `<Step>` (read [components/steps](https://use.docs.page/components/steps) before drafting).
- **≤5 short steps** with one line each → plain ordered list is fine.

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
