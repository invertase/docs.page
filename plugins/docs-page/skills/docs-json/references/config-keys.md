# docs.json key reference

Every field is `.catch()`-wrapped: an invalid value silently becomes the default,
and an unknown key is dropped. Nothing is required at the top level.

## Top-level keys

| Key | Type | Default | Notes |
|---|---|---|---|
| `$schema` | string (url) | — | `https://docs.page/schema.json`. Accepted, then stripped before use. |
| `name` | string (min 1) | undefined | Site name; falls back to "Documentation". |
| `description` | string (min 1) | undefined | |
| `socialPreview` | string (min 1) \| `false` | undefined | `false` disables it. |
| `logo` | `{light?, dark?}` | `{}` | **Object only.** A string flips the file to v1. |
| `favicon` | string \| `{light?, dark?}` | undefined | A bare string is normalised to `{light, dark}`. |
| `theme` | object | `{}` | See below. |
| `header` | object | see below | This is the nav bar. |
| `tabs` | array | `[]` | |
| `sidebar` | array **or** locale-keyed record | `{}` | |
| `anchors` | array | `[]` | |
| `banner` | object | all undefined | |
| `content` | object | see below | |
| `seo` | object | `{noindex: false}` | Only `noindex`. |
| `variables` | `Record<string, unknown>` | `{}` | Substituted into MDX. |
| `redirects` | `Record<string, string>` | `{}` | 404-branch only. |
| `scripts` | object | all undefined | Exactly 4 keys. |
| `social` | object | all undefined | |
| `og` | `{logo?: string, github?: boolean}` | `{github: true}` | |
| `mcp` | `{enabled?: boolean}` | `{enabled: true}` | `false` turns the MCP endpoint off entirely (404). |
| `check` | object | undefined | CLI-only. |
| `search` | object | `{docsearch: undefined}` | **Dead** — nothing reads it. |

There is **no `footer`** and **no `navbar`**. A derived, non-authorable `locales`
field is added from the sidebar record's keys (excluding `default`).

## `sidebar`

```jsonc
// array form (single locale)
"sidebar": [ Group, ... ]
// record form (multi-locale); keys become locales, "default" excluded
"sidebar": { "default": [Group, ...], "fr": [Group, ...] }
```

`Group` (recursive — `pages` may hold page items or nested groups):

| Field | Type | Required |
|---|---|---|
| `group` | string | no |
| `tab` | string \| string[] | no (a 1-entry array collapses to a string) |
| `href` | string | no |
| `icon` | string | no |
| `pages` | `(PageItem \| Group)[]` | **yes** |

`PageItem`: `title: string` (**required**), `href: string` (**required**),
`icon?: string`.

These are the only genuinely required fields in the schema. A group that fails
validation is dropped by the outer catch, **which throws away the entire sidebar** —
one malformed entry silently blanks navigation.

Page icons live here, not in page frontmatter.

## `tabs`

Array of `{ id: string (req), title: string (req), href: string (req), locale?: string }`.
Invalid entries are dropped **individually**.

## `header` (the nav bar)

| Field | Type | Default | Notes |
|---|---|---|---|
| `showName` | boolean | `true` | |
| `showThemeToggle` | boolean | `true` | **Schema-only, not applied** |
| `showGitHubCard` | boolean | `true` | **Schema-only, not applied** |
| `links` | `{title (req), href (req), cta?: boolean = false, locale?: string}[]` | `[]` | `links[].locale` is **schema-only, not applied** |

## `anchors`

Array of `{ icon: string (req), title: string (req), href: string (req), locale?, tab? }`.
Invalid entries are dropped individually.

## `theme`

| Field | Type | Notes |
|---|---|---|
| `defaultTheme` | `"light" \| "dark"` | The only literal enum in the schema — **not applied** |
| `preset` | string | Opaque shadcn create-page code from <https://ui.shadcn.com/create>. Not an enum; undecodable ⇒ silent fallback |
| `primary`, `primaryLight`, `primaryDark`, `backgroundLight`, `backgroundDark` | `#RRGGBB` | Six-digit hex, leading `#` optional |

## `content`

| Field | Type | Default |
|---|---|---|
| `headerDepth` | number | `3` |
| `zoomImages` | boolean | `false` |
| `automaticallyInferNextPrevious` | boolean | `true` |
| `showPageTitle` | boolean | `true` |
| `showPageImage` | boolean | `true` |

Page frontmatter `showPageTitle` / `showPageImage` override these per page.

## `scripts` — exactly four keys

`googleTagManager?: string`, `googleAnalytics?: string`,
`googleSiteVerification?: string`, `plausible?: string | boolean`.

## `social`

All strings, all optional: `preview`, `website`, `x`, `youtube`, `facebook`,
`instagram`, `linkedin`, `github`, `slack`, `discord`.

## `banner`

All strings, all optional: `message`, `href`, `backgroundColor`, `foregroundColor`.

## `og`

`logo?: string`, `github?: boolean` (default `true`).

## `mcp`

`enabled?: boolean` (default `true`). `false` returns 404 for
`https://docs.page/{owner}/{repo}/mcp`.

## `favicon`

`string` or `{light?, dark?}`. A bare string is normalised to both.

## `check` (CLI only)

One key: `ignoreExternalHosts: string | string[]`. There is **no
`errorExternalHosts`**. The hosted app does not read this block; only
`@docs.page/cli check` does, and it **unions** it with `--ignore-external-hosts`.

## The v1 legacy trap

A config is parsed as legacy **v1** when `logo` is a *string* or `theme` is a
*string*. Every v2 key is then discarded. V1 keys include `logoDark`, `twitter`,
`noindex`, `headerDepth`, `googleTagManager`, `googleAnalytics`, `zoomImages`,
`experimentalCodehike`, `experimentalMath`, `automaticallyDisplayName`,
`plausibleAnalytics`, `plausibleAnalyticsScript`, `anchors[].link`, and a
tuple-shaped `sidebar`. If your v2 config appears to do nothing at all, check
`logo` and `theme` first.
