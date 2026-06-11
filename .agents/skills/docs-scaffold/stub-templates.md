# MDX stub templates

Minimal preview stubs. **Planning lives in `.docs/scaffold-plan.md` and `docs.json` `outline` — not in MDX.**

[docs-write](../docs-write/SKILL.md) replaces `_TBD_` placeholders with final prose.

## Rules

- Copy `title` and `description` into frontmatter from `outline.pages`
- **Do not** add documentation plan blocks, `<Info>` planning callouts, or `{/* docs-scaffold-plan-* */}` markers
- Never overwrite `status: existing` unless user requests
- Skip `status: retire`
- Keep valid MDX; link only to `href`s that exist in the outline

## Page stub

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

$BODY_PLACEHOLDER
```

`$BODY_PLACEHOLDER` from docType:

| docType | Sections |
| --- | --- |
| `tutorial` | Prerequisites, Steps, Next steps |
| `how-to` | Before you begin, Steps, Verify |
| `reference` | Overview, Reference |
| `explanation` | Summary, Details |

Use `_TBD_` under each heading until docs-write fills content.

## Section landing (`href` = tab `href`)

Same minimal shape — overview prose only, no traceability tables:

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

## Overview

_TBD_
```

Child pages are listed in the sidebar; capability mapping is in `outline.pages[].capabilityIds` and `.docs/scaffold-plan.md` merge map.
