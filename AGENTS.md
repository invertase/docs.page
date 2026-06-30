# docs.page — agent guidance

This file orients coding agents working in the docs.page monorepo. For human
contributors, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Project overview

docs.page serves markdown documentation from public GitHub repositories as modern,
agent-ready sites (MCP, `llms.txt`, optional Ask AI). The active codebase is a
Bun workspace centered on a Next.js app and shared packages.

## Monorepo layout

```
app/                    Next.js app — rendering, API routes, MCP, agent panel
packages/cli/           @docs.page/cli — init, check, preview
packages/mdx-bundler/   Shared markdown → doc IR pipeline
docs/                   Product documentation (MDX)
docs.json               Site navigation for this repo's docs
skills/                 Agent skills (SKILL.md per skill)
```


## Commands

| Task | Command |
| --- | --- |
| Install | `bun install` (repo root) |
| Dev server | `bun dev` or `cd app && bun dev` |
| Format + lint | `bun run check` (Biome, repo root) |
| CLI dev | `cd packages/cli && bun run dev` |
| CLI typecheck | `cd packages/cli && bun run typecheck` |

## Conventions

- **Runtime** — Bun for installs and scripts; Next.js App Router in `app/`.
- **Lint/format** — Biome (`biome.json`). Run `bun run check` before finishing.
- **UI** — shadcn/ui components live in `app/src/components/ui/`. Use existing primitives before adding dependencies.
- **Next.js** — Read `app/AGENTS.md` and `node_modules/next/dist/docs/` for Next.js 16 APIs (breaking vs training data).
- **Shared markdown pipeline** — Changes to doc rendering belong in `packages/mdx-bundler/` when they affect both app and CLI preview.
- **Scope** — Minimal diffs; match existing patterns; update `docs/` for user-visible behavior.

## Environment

Local app development against live GitHub content requires `GITHUB_PAT` in
`app/.env.local`. GitHub App credentials are only needed for webhook work.
See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup.

Do not commit secrets, `.env`, or generated artifacts (`.next/`, `dist/`).

## Pull requests

- Link issues when applicable (`Fixes #123`).
- Follow [CONTRIBUTING.md](./CONTRIBUTING.md) for workflow and [.github/pull_request_template.md](./.github/pull_request_template.md) when opening a PR.
- Ensure Biome passes (`bun run check`).
- Prefer focused PRs with a clear description.

## Skills

Repo-wide skills live under [`skills/`](./skills/). Load a skill's `SKILL.md` when one exists for your task.

## Safety

- Do not disable security checks (webhook verification, sanitization, rate limits) without explicit maintainer approval.
- Treat user-supplied markdown and repository content as untrusted input.
