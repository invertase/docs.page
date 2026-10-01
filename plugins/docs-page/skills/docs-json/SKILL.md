---
name: docs-json
description: Edit or debug docs.json for a docs.page site. Use when the user mentions docs.json, the docs sidebar, tabs, anchors, theme or colours, the header/nav bar, logo or favicon, redirects, SEO/noindex, analytics scripts, or says a docs.page config change "did nothing", or asks to set up or configure Ask AI (out of scope here: the skill points them to the guide).
---

# docs.json

The whole site config. Keep `$schema` first so editors validate:

```json
{ "$schema": "https://docs.page/schema.json" }
```

Full key tables and nested shapes: `references/config-keys.md`.

## Nothing is required, and nothing errors

Every field is `.catch()`-wrapped. An invalid value is **silently replaced by the
default**, and an unknown key is **dropped**. A typo does nothing visible.

`docs check` does **not** validate `docs.json` against the schema — it only checks
the file parses. So after every config change, verify by eye:

```bash
npx @docs.page/cli preview
```

## Three traps that lose content silently

1. **The v1 trap.** Writing `"logo": "/logo.svg"` (a string) or a string `"theme"`
   flips the whole file into legacy v1 parsing and **every v2 key is discarded**.
   `logo` must be an object: `{"light": "/logo.svg", "dark": "/logo-dark.svg"}`.
2. **One malformed sidebar group blanks the ENTIRE sidebar.** The outer catch drops
   everything, not just the bad entry. `pages` is required on a group; `title` and
   `href` are required on a page item. These are the only genuinely required fields
   in the whole schema — get them right.
3. **`footer` and `navbar` do not exist.** `header` is the nav bar. Writing
   `"footer": {...}` is simply dropped.

## Key placement people get wrong

- `name`, `description`, `socialPreview` are **top-level**, not under `seo`.
- `seo` holds only `noindex`.
- `scripts` accepts exactly: `googleTagManager`, `googleAnalytics`,
  `googleSiteVerification`, `plausible`.
- `redirects` is a **top-level** `string -> string` map. It is consulted only on the
  404 branch, so it never shadows a page that still exists.
- `check` holds exactly `ignoreExternalHosts` (there is no `errorExternalHosts`),
  and only the CLI reads it — the hosted site ignores the block.

## Theme

- `theme.preset` is an **opaque shadcn create-page code**, not an enum. Get one from
  <https://ui.shadcn.com/create>. An undecodable value silently falls back to the
  default palette.
- Colours (`primary`, `primaryLight`, `primaryDark`, `backgroundLight`,
  `backgroundDark`) are 6-digit hex.
- In the schema but **NOT applied** — do not promise behaviour from them:
  `theme.defaultTheme`, `header.showThemeToggle`, `header.showGitHubCard`,
  `header.links[].locale`.

## Don't use

- `search.docsearch` — still in the schema, but dead and undocumented. Nothing
  reads it.

## Multi-locale sidebar

Use the record form; the keys become the site's locales, and `default` is excluded
from that list:

```json
"sidebar": {
  "default": [ { "group": "Guides", "pages": [ { "title": "Intro", "href": "/" } ] } ],
  "fr":      [ { "group": "Guides", "pages": [ { "title": "Intro", "href": "/fr" } ] } ]
}
```

## Ask AI

**Ask AI is out of scope.** If the user asks about it, point them to the Ask AI setup guide at
<https://use.docs.page/ai-agents/ask-ai>. Never run `docs agent create` or handle their AI
provider key. Leave any existing `agent` block in `docs.json` untouched — it is valid
config, not a mistake to fix.
