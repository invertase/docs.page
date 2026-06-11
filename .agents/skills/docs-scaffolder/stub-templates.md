# MDX stub templates

Preview-ready `.mdx` stubs. Planning context is **rendered on the page**, not duplicated in `docs.json`. [docs-writer](../docs-writer/SKILL.md) removes scaffold blocks when writing final content.

## Rules

- Copy `title` and `description` into frontmatter from `outline.pages`
- **Always include** the documentation plan block on new stubs (see below)
- Section landing pages (`href` equals a tab's `href`) use the **section index** template
- Never overwrite `status: existing` unless user requests `--overwrite`
- Skip `status: retire`
- Create parent directories as needed
- Keep valid MDX; link only to `href`s that exist in the outline
- Resolve capability titles from `features.json` for plan bullets

---

## Documentation plan block

Rendered on every stub except section indexes (indexes use the traceability table instead). Wrap in markers so docs-writer can strip reliably:

```mdx
{/* docs-scaffold-plan-start */}

<Info>
**Documentation plan** — remove this block when writing final content.

| | |
| --- | --- |
| **Doc type** | $DOC_TYPE |
| **User goal** | $USER_GOAL |
| **Audience** | $AUDIENCE |

$RATIONALE

**Capabilities covered**

$CAPABILITY_LIST

$RELATED_LINKS
</Info>

{/* docs-scaffold-plan-end */}
```

### Field rules

| Token | Source |
| --- | --- |
| `$DOC_TYPE` | `outline.pages.docType` |
| `$USER_GOAL` | `outline.pages.userGoal` |
| `$AUDIENCE` | `outline.pages.audience` joined with `, ` |
| `$RATIONALE` | One sentence: why this page exists and where it sits in the IA (compose at stub time; **do not** store in `docs.json`) |
| `$CAPABILITY_LIST` | Bullet per `capabilityId`: ``- `id` — title from features.json`` or `- _(editorial)_` when empty |
| `$RELATED_LINKS` | Optional `**Related pages**` bullet list linking to other outline `href`s |

Compose `$RATIONALE` from placement context, e.g. *"How-to in Getting Started for first-time authors; merges local preview and file watcher capabilities."*

---

## Section index template

Use when `outline.pages.href` equals a tab's `href` (`/cli`, `/api`, `/components`, `/ui`, …). Lists child pages in that tab as a **traceability table**.

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

{/* docs-scaffold-plan-start */}

<Info>
**Section index** — remove this block when writing final content. Maps pages in this section to product capabilities.
</Info>

{/* docs-scaffold-plan-end */}

## Pages in this section

| Page | Doc type | User goal | Capabilities |
| --- | --- | --- | --- |
| [$CHILD_TITLE]($CHILD_HREF) | $CHILD_DOC_TYPE | $CHILD_USER_GOAL | `$CHILD_CAPABILITY_IDS` |

_Add one row per child page in this tab (exclude the overview row). Use capability ids comma-separated._

## Overview

_TBD_
```

Build the table from `outline.pages` entries sharing the tab prefix (e.g. all `/ui/*` except `/ui` itself for the UI tab).

---

## href → file

| href | file |
| --- | --- |
| `/` | `docs/index.mdx` |
| `/cli` | `docs/cli/index.mdx` |
| `/api` | `docs/api/index.mdx` |
| `/components` | `docs/components/index.mdx` |
| `/components/steps` | `docs/components/steps.mdx` |

---

## Page body templates

Append after the plan block (or after section index table).

### tutorial

```mdx
## Prerequisites

_TBD_

## Steps

_TBD_

## Next steps

_TBD_
```

### how-to

```mdx
## Before you begin

_TBD_

## Steps

_TBD_

## Verify

_TBD_
```

### reference

```mdx
## Overview

_TBD_

## Reference

_TBD_
```

### explanation

```mdx
## Overview

_TBD_

## How it works

_TBD_

## Related

_TBD_
```

---

## After writing stubs

1. Set `outline.pages[].status` from `new` → `stub`
2. Re-save slim `docs.json`
3. Run `docs check` (see [cli.md](cli.md))
