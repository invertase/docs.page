# MDX stub templates

Minimal `.mdx` files so the scaffolded site can be previewed. Stubs are **not** final documentation — [docs-writer](../docs-writer/SKILL.md) replaces placeholder content later.

## Rules

- Copy `title` and `description` from `outline.pages` frontmatter exactly
- Never overwrite an existing file unless `status: new` and the user explicitly requests `--overwrite`
- Skip pages with `status: existing` or `retire`
- Create parent directories for nested paths (e.g. `docs/guides/foo.mdx`)
- Keep stubs valid MDX — no unclosed JSX, no invalid frontmatter
- Do not add links to pages that do not exist yet

## href → file

| href | file |
| --- | --- |
| `/` | `docs/index.mdx` |
| `/navigation` | `docs/navigation.mdx` |
| `/guides/search` | `docs/guides/search.mdx` |

Must match `outline.pages[].file`.

---

## Base stub (any docType)

Use when docType-specific template is unnecessary:

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

$TITLE — content coming soon.
```

---

## tutorial

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

## Prerequisites

_TBD_

## Steps

_TBD_

## Next steps

_TBD_
```

---

## how-to

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

## Before you begin

_TBD_

## Steps

_TBD_

## Verify

_TBD_
```

---

## reference

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

## Overview

_TBD_

## Reference

_TBD_
```

---

## explanation

```mdx
---
title: $TITLE
description: $DESCRIPTION
---

## Overview

_TBD_

## How it works

_TBD_

## Related

_TBD_
```

---

## After writing stubs

1. Set `outline.pages[].status` from `new` → `stub` for every created file
2. Re-save `docs.json`
3. Run `docs check` (see [cli.md](cli.md))
