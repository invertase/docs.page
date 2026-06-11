---
name: docs-writer
description: >-
  Writes or revises MDX documentation pages from an approved docs.json outline.
  Applies Diátaxis templates, tone rules, and style linting. Use when drafting
  doc page content, writing .mdx files, or when the user mentions docs-writer
  after approving a docs.json scaffold. Does not build features.json or site IA.
---

# Documentation Writer

Write **prose** for pages that are already planned in `docs.json`. Routing and navigation belong to upstream skills.

## Pipeline position

```
feature-finder  →  features.json
docs-scaffolder →  docs.json + stub .mdx + docs check
docs-writer     →  full .mdx content   ← you are here
```

**Upstream (required):** Approved `docs.json` with an `outline` block from [docs-scaffolder](../docs-scaffolder/SKILL.md). If no `outline.pages` exists, stop and run docs-scaffolder first — unless the user explicitly scopes a single page edit.

**Secondary input:** `features.json` for capability detail; read `sources` in code when `writingNotes` or `summary` is insufficient.

**Output:** `.mdx` files at paths defined in `outline.pages[].file`.

## Scope

**In scope**
- Draft or revise `.mdx` for pages listed in `docs.json` `outline.pages`
- Match `docType`, `title`, and `description` from the outline entry
- Run style self-correction before delivering

**Out of scope**
- Building `features.json` → [feature-finder](../feature-finder/SKILL.md)
- Planning site structure → [docs-scaffolder](../docs-scaffolder/SKILL.md)
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
- [ ] 2. Load — read outline.pages entries + capabilityIds from features.json
- [ ] 3. Template — read templates.md; pick skeleton for docType
- [ ] 4. Draft — write .mdx with tone and formatting rules
- [ ] 5. Lint — read style-lint.md; run self-correction pass
- [ ] 6. Deliver — write files; summarize changes
```

**Mandatory reads:** `templates.md` at step 3, `style-lint.md` at step 5.

## Step 1: Confirm scope

Accept work only when:

- User has reviewed `docs.json` `outline`, or
- User specifies `href`s or `status: new` / `stub` pages to write, or
- User requests a targeted edit to an **existing** `.mdx` file

If the user asks to "document the product" without an outline, respond: run **docs-scaffolder** first.

Write priority:

1. `status: stub` (placeholder from docs-scaffolder)
2. `status: new` (outline entry without a file — create full page)
3. `status: existing` (revisions)
4. Skip `status: retire` unless user asks for redirect stub

When replacing a stub, read the existing file first; preserve frontmatter `title`/`description` from the outline.

## Step 2: Load page context

For each target entry in `outline.pages`:

| Field | Use for |
| --- | --- |
| `docType` | Template selection — do not override without user approval |
| `title`, `description` | Frontmatter |
| `file` | Output path |
| `capabilityIds` | Pull detail from `features.json` |
| `relatedHrefs` | Next steps / See also links |
| `rationale` | Scope guard |
| `status` | `existing` → read current file first |

## Step 3–5: Write and lint

### Writing rules

- **Imperative & active voice:** *"Click **Submit**"* not *"The user should click submit"*
- **Cognitive load:** Paragraphs ≤ 3 lines; use bullets
- **Why before how:** State outcome before each setting change
- **Semantic UI formatting:** Bold UI labels; backtick code, paths, env vars
- **Truthfulness:** Match `features.json` and code; flag `beta` / `deprecated` / `schema-only`

### docs.page conventions

- Frontmatter: `title`, `description` from outline
- **tutorial / how-to:** `<Steps>` / `<Step>`
- **reference:** `<Property>`, nested `<Accordion>`
- **Callouts:** `<Info>`, `<Warning>`, `<Error>`, `<Success>` — not `<Callout>`
- **Code:** Fenced blocks with language tags; `<CodeGroup>` for equivalents

Honor `docType` from outline. Templates: [templates.md](templates.md). Lint: [style-lint.md](style-lint.md).

## Create vs update

**New page (`status: new` | `stub`):** Write full `.mdx` from template.

**Existing page (`status: existing`):** Read current file; preserve accurate user-edited sections; align structure to `docType`.

**Batch:** For &gt; 3 pages, list queue and confirm before drafting all.

## Reporting to the user

Summarize:

- Pages written (`href`, `file`)
- `docType` followed per outline
- `capabilityIds` covered
- Lint fixes applied
- Outline pages not yet written
- Anything `schema-only` or unverified in code

## Additional resources

- Page skeletons: [templates.md](templates.md)
- Style lint: [style-lint.md](style-lint.md)
- Site outline (upstream): [docs-scaffolder](../docs-scaffolder/SKILL.md)
- Capability detail (upstream): [feature-finder](../feature-finder/SKILL.md)
