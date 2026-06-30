# Contributing

Thank you for helping improve docs.page. This guide covers how to contribute to this repository.

Using a coding agent? Jump to [Contributing with an agent](#contributing-with-an-agent).

## Get involved

- **[Discussions](https://github.com/invertase/docs.page/discussions)** — questions, ideas, roadmap, and general feedback. Start here when you're not sure.
- **[Issues](https://github.com/invertase/docs.page/issues/new/choose)** — bugs and feature requests. Use the [issue templates](.github/ISSUE_TEMPLATE/); one problem per issue.
- **[Pull requests](https://github.com/invertase/docs.page/compare)** — code, docs, or any change to the repo. Use the [PR template](.github/pull_request_template.md).

## Development

```bash
git clone https://github.com/invertase/docs.page.git
cd docs.page
bun install
bun dev
```

The site runs at [http://localhost:3000](http://localhost:3000).

| Path | Purpose |
| --- | --- |
| `app/` | Next.js app — rendering, MCP, Ask AI, preview |
| `packages/cli/` | `@docs.page/cli` — init, check, preview |
| `packages/mdx-bundler/` | Shared markdown pipeline |
| `docs/` | Product documentation (MDX) |

> **GitHub tokens:** Not required for most work. Set `GITHUB_PAT` in `app/.env.local` only if you need the app to fetch live GitHub content.

Run `bun run check` before opening a PR. Update `docs/` when behavior is user-facing.

## Contributing with an agent

Copy this into a new agent session, then describe your task:

```
You are contributing to docs.page (github.com/invertase/docs.page).

Read before making changes:
1. CONTRIBUTING.md — workflow (this file)
2. AGENTS.md — repo layout, commands, and code conventions
3. .github/pull_request_template.md — follow when opening a PR
4. .github/ISSUE_TEMPLATE/ — use when filing a bug or feature request

Task: [e.g. "fix #123", "add docs for preview command"]

Deliver:
- Focused diff; do not edit legacy folders (api/, website/, og/)
- Run `bun run check` before finishing
- Update docs/ if behavior is user-facing
- Fill out the PR template; link related issues (Fixes #…)
- Ideas or large features → suggest a Discussion first, not a drive-by PR
```

Code-level detail lives in [AGENTS.md](AGENTS.md).

## License

By contributing, you agree your contributions are licensed under [Apache-2.0](LICENSE).
