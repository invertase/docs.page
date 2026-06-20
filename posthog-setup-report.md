# PostHog post-wizard report

The wizard has completed a server-side PostHog integration for docs.page. A shared `PostHog` singleton was created in `src/lib/posthog.ts` and imported into six server-side files spanning the App Router API routes, the Pages Router `getServerSideProps` handler, and a GitHub webhook handler. Twelve events covering documentation delivery, AI agent activity, MCP adoption, and GitHub PR previews were instrumented. All events use `$process_person_profile: false` since this platform serves anonymous documentation readers rather than identified users, avoiding unwanted person profile creation.

| Event name | Description | File |
|---|---|---|
| `docs bundle loaded` | A documentation bundle was successfully fetched for an owner/repo/path combination. | `app/src/app/api/bundle/route.ts` |
| `docs bundle failed` | A documentation bundle request encountered a bundler error and could not be returned. | `app/src/app/api/bundle/route.ts` |
| `doc page viewed` | A documentation page was server-rendered and returned to the user. | `app/src/pages/[[...path]].tsx` |
| `doc page error` | A documentation page failed to load and an error was returned to the user. | `app/src/pages/[[...path]].tsx` |
| `agent session created` | An AI agent session was initialized for a repository's documentation page. | `app/src/pages/[[...path]].tsx` |
| `agent message sent` | A user sent a message to the AI documentation agent for a repository. | `app/src/app/api/agent/route.ts` |
| `agent rate limited` | An agent request was rejected because the IP or repository hourly rate limit was exceeded. | `app/src/app/api/agent/route.ts` |
| `agent registered` | A new AI agent API key was registered for a GitHub repository. | `app/src/app/api/agent/create/route.ts` |
| `agent removed` | An AI agent was deleted and its API key removed from a repository. | `app/src/app/api/agent/route.ts` |
| `mcp server accessed` | An MCP client fetched the server descriptor for a repository's documentation. | `app/src/app/api/[owner]/[repo]/mcp/route.ts` |
| `mcp tool called` | An MCP client issued a POST tool call against the docs MCP server. | `app/src/app/api/[owner]/[repo]/mcp/route.ts` |
| `pr preview comment posted` | A docs.page preview URL was posted as a GitHub comment on a newly opened pull request. | `app/src/app/api/webhooks/github/pull_request.opened.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/94938/dashboard/1739092)
- [Doc pages viewed (wizard)](https://us.posthog.com/project/94938/insights/06H40puG)
- [AI agent usage (wizard)](https://us.posthog.com/project/94938/insights/P9O0vu58)
- [MCP adoption (wizard)](https://us.posthog.com/project/94938/insights/5poFd20D)
- [Bundle errors (wizard)](https://us.posthog.com/project/94938/insights/4t59xAkO)
- [Agent lifecycle (wizard)](https://us.posthog.com/project/94938/insights/LK3U0OrR)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
