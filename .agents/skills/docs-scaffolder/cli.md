# docs.page CLI

Use the CLI to validate the scaffolded site compiles and parses.

## Resolve the CLI

Try in order until one succeeds:

| Priority | Command | When |
| --- | --- | --- |
| 1 | `docs check <path>` | `docs` on PATH |
| 2 | `docs.page check <path>` | `docs.page` on PATH |
| 3 | `bun packages/cli/src/cli.ts check <path>` | Inside docs.page monorepo |
| 4 | `npx @docs.page/cli check <path>` | Any project; downloads if needed |

Run from the directory containing `docs.json` (usually repo root). Default `<path>` is `.`.

## Install when missing

If none of the above work and `npx` is unavailable:

```bash
npm install -g @docs.page/cli
```

Then re-run `docs check <path>`.

Prefer `npx @docs.page/cli` in agent/CI contexts — no global install required.

## Scaffold validation command

After writing `docs.json` and stub `.mdx` files:

```bash
docs check . --external-links off
```

| Flag | Scaffold value | Why |
| --- | --- | --- |
| `--external-links` | `off` | Stubs have no external links; avoids network |
| `--internal-links` | `error` (default) | Catches broken cross-references |
| `--assets` | `error` (default) | Catches missing images |

For a full audit after content is written:

```bash
docs check .
```

## What `check` validates

- `docs.json` (or `docs.yaml`) exists and parses as JSON/YAML
- Every `docs/**/*.mdx` file parses as MDX
- Internal links resolve to existing routes
- Local asset paths resolve (when `--assets error`)
- External URLs respond (when `--external-links error`)

**Note:** `check` does not validate sidebar `href` entries against files. The scaffolder must ensure every sidebar leaf has a matching `.mdx` stub before running `check`.

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | No errors |
| `1` | One or more errors — fix and re-run |

Record result in `outline.validation.cliCheck`:

```json
{
  "passed": true,
  "command": "npx @docs.page/cli check . --external-links off",
  "ranAt": "YYYY-MM-DD",
  "errors": 0,
  "warnings": 0
}
```

On failure, set `passed: false`, capture error summary, and fix stub/JSON issues before reporting done.

## Monorepo note

In the docs.page workspace, `packages/cli` is private. Use:

```bash
bun packages/cli/src/cli.ts check .
```

Do not assume `@docs.page/cli` is published when developing inside this repo.
