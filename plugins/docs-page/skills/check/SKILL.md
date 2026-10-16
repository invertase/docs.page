---
name: check
description: Validate a docs.page site before publishing. Use when the user wants to check, validate or lint their docs, mentions "docs check", broken links or missing images in docs.page, or is debugging a CI failure from the docs.page check command.
---

# `docs check`

```bash
npx @docs.page/cli check [path]          # path defaults to "."
```

## Severity flags

Five flags, each `off | warn | error`, **each defaulting to `error`**:

| Flag | Covers |
|---|---|
| `--external-links <level>` | http/https URLs are fetched |
| `--internal-links <level>` | Markdown links + frontmatter `redirect`/`next`/`previous` resolve to a known route |
| `--assets <level>` | Local images exist (Markdown images, plus `src` on `<Image>`/`<img>`) |
| `--render <level>` | Every MDX page renders through the real bundler |
| `--metadata <level>` | `title`/`description` and config `name`/`description` are strings and Latin-1-safe — only when the auto-generated OG image is in use |

Plus `--ignore-external-hosts <csv>`, which is **unioned** with
`check.ignoreExternalHosts` from `docs.json` — never replaced.

Plus `--severity-override-hosts <host=warn|error,...>`, **unioned** with
`check.severityOverrideHosts` from `docs.json`; the flag wins for the same host.
Entries cover subdomains and the longest matching host wins. `off` is not
accepted, so an override can never turn a check off.

Plus `--debug` (CLI only, no `docs.json` key), which prints one line per HTTP
attempt and a per-host summary after the external-link checks.

It also checks that `docs.json`/`docs.yaml` **parses**, and that at least one
`docs/**/*.mdx` file exists.

## Exit codes and how results are graded

- Exit **1** only if there is at least one **error**-level issue. Warnings and
  skips never fail the run.
- HTTP **401, 403, 405 and 429 are downgraded to warn unless the host has a
  severity override**. A host listed in `check.severityOverrideHosts` (or the
  flag) takes the mapped severity for every failure, bot gates included — that
  is how a team makes a specific host's failures fail CI. Otherwise 404, 5xx, DNS
  failures and timeouts keep the configured severity.
- Each HEAD/GET is tried up to **3 times, only on 429 or a dropped connection**
  (`ECONNRESET` and similar). Waits are 200ms then 400ms, or `Retry-After`,
  capped at 2s. A HEAD that stays 429 skips the GET. 404, 5xx, DNS failures and
  the 10-second timeout are **not retried** — re-run before believing a one-off
  404/5xx/timeout.
- External fetches run at most 8 at once, and at most 2 per hostname.
- Inside a locked-down network every external host may 403 and be downgraded to
  warn. A green external-link result there **proves nothing**.

## CI line (the docs.page repo's own)

```bash
npx @docs.page/cli check --external-links warn --internal-links error --assets error
```

## What it does NOT check — sweep these by hand

1. **Anchors and URL fragments.** Any target starting with `#` is ignored, and the
   fragment is stripped from internal paths. `#missing-heading` is never verified.
2. **`href` on any component.** Only `src` on `Image`/`img` is read out of JSX.
   `<Card href>`, `header.links[].href`, `anchors[].href`, `tabs[].href` and every
   sidebar `href` are invisible to the checker.
3. **`docs.json` against the JSON Schema.** Only that it parses — no key or type
   validation, no unknown-key warning. Verify config changes with
   `npx @docs.page/cli preview`.
4. Non-http(s) schemes (`mailto:`, `tel:` …) are ignored.

Manual sweep:

```bash
grep -rn '](#'            docs/    # markdown links to anchors
grep -rn 'href="#'        docs/    # component/HTML anchors
grep -rn '<Card[^>]*href=' docs/   # unchecked Card links
```

For each hit, open the target page and confirm the heading exists. Also eyeball
every `href` in `docs.json` (sidebar, tabs, anchors, header links) — none of them
are checked.
