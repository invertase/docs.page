# docs-page

A Claude Code plugin for people who author a [docs.page](https://docs.page) site —
docs-as-code publishing straight from a public GitHub repo, no build step.

It teaches Claude the parts of docs.page that fail quietly: the fixed component
set, the silently-`catch()`ing `docs.json` schema, and the gaps in `docs check`.

## Skills

| Skill | Use it for |
|---|---|
| `/docs-page:authoring` | Writing and editing `docs/**/*.mdx` — the 21 legal components, frontmatter keys, and the authoring mistakes that break a page |
| `/docs-page:docs-json` | Editing `docs.json` — sidebar, tabs, header, theme, redirects, SEO, analytics, and the traps that blank your navigation |
| `/docs-page:setup` | Standing a site up: `docs init`, `docs preview`, published URL forms, branding, analytics, and the per-repo MCP server |
| `/docs-page:check` | `docs check` before publishing — the five severity flags, exit codes, and what it silently does not validate |

Skills are model-invoked: describe what you are doing and the right one loads.

## Install

In Claude Code, add this repository as a plugin marketplace, then install the plugin from it:

```
/plugin marketplace add invertase/docs.page
/plugin install docs-page@docs-page
```

The marketplace is defined in [`.claude-plugin/marketplace.json`](../../.claude-plugin/marketplace.json) at the root of `invertase/docs.page`; `docs-page@docs-page` is the `docs-page` plugin from the `docs-page` marketplace.

## Local development

From the root of a `docs.page` checkout:

```
claude --plugin-dir ./plugins/docs-page
```

Then `/reload-plugins` to pick up edits without restarting.

## Evals

A deterministic eval suite (no LLM judges) lives in `evals/`. From the plugin root (`plugins/docs-page/`):

```
claude plugin eval . --ablation with-without --scaffold --allow-tools Write Edit
```

This makes real model calls on your account (3 runs per case, with and without the plugin); add `--max-cost-usd` to cap spend. `--scaffold` runs each case's `scaffold.sh` to create a tiny docs.page project, and `Write Edit` let Claude edit it. Never add `Bash` to that grant: the `ask-ai-out-of-scope` case must not be able to run `docs agent create`.

To confirm the plugin loads and its four skills register, run `claude --plugin-dir ./plugins/docs-page plugin details docs-page` from the repo root.

---

Verified against docs.page `main` @ `dd56091` and `@docs.page/cli` 2.1.0.
