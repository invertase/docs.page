---
name: docs-page-setup
description: >-
  Turns a public GitHub repo into a live docs.page site, following Quickstart.
  Use when installing docs.page for the first time. Optional branding and agent feature set up included.
---

# Install docs.page

Fetch each linked page and follow it. This file is only the agent delta.

## First install

Follow <https://use.docs.page/quickstart.md>. For non-interactive `init`, use flags from <https://use.docs.page/reference/cli.md#docs-init> instead of prompts; ask for `--name` if it isn't obvious, and do not `--overwrite` unless they confirm.

`init` only writes files locally. Commit, then ask before pushing — only as a structured confirmation prompt if the host supports one. Otherwise ask the same question in chat and wait. Push to the default branch only if they approve. Do not offer a preview branch.

Prompt: `Pushing to the default branch of this public repo publishes your docs immediately at https://docs.page/{owner}/{repo}. Push now?`

After the push, wait until the default branch serves `docs.json` (retry if docs.page says the config is missing). Then open `https://docs.page/{owner}/{repo}` in the host IDE or default browser if the environment can open a URL. Paste it only if it cannot.

First install ends there.

## Optional extra features setup

After the live URL is open (or when they ask to continue setup), offer these only as a structured multiple-choice prompt if the host supports one (allow multiple). Otherwise ask the same question in chat and wait. Do not start any flow until they answer. `not-now` ends the skill.

Prompt: `Your docs.page site is live. Would you like help setting up the following features?`

- `branding` — Branding — <https://use.docs.page/customize/branding.md>
- `ask-ai` — Ask AI — <https://use.docs.page/ai-agents/ask-ai.md>
- `seo` — SEO — <https://use.docs.page/customize/seo.md>
- `analytics` — Analytics — <https://use.docs.page/customize/analytics.md>
- `other` — Other
- `not-now` — Not now

If they already named a flow in chat, skip the prompt and follow that page. For each pick except `not-now`, fetch the page first and follow only it (and other `use.docs.page` pages it links). For `other`, ask what they want, then find the matching page on use.docs.page. Ask for any value it needs; do not invent keys, colors, or credentials. After file changes, commit and push to the default branch as that page (and Quickstart) show.

