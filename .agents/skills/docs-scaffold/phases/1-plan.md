# Phase 1: Plan structure

## Resuming from cold context

Read before starting:

- `.docs/docs-spec.md` — persona, journeys, first success, policy, notes
- `.docs/docs-inventory.json` — capabilities (do not mirror 1:1 into pages)
- [references/topic-buckets.md](../references/topic-buckets.md)
- [references/merge-rules.md](../references/merge-rules.md)
- [scaffold-plan.template.md](../scaffold-plan.template.md)

If `.docs/scaffold-plan.md` exists **and** the user has approved it, Phase 1 is complete → [2-spine.md](2-spine.md).

## Goal

Produce `.docs/scaffold-plan.md` — a **human-reviewable IA plan** before writing `docs.json` or stubs.

The plan answers: *what pages exist, what got merged, what's deferred, what tabs we need* — not *every capability gets a page*.

## Step 1a. Ingest spec

Extract from `.docs/docs-spec.md`:

| Section | Record |
| --- | --- |
| Positioning | One-line product purpose |
| Audience | `primaryPersona`, secondaries |
| First success | Outcome + hints |
| Journeys | Ordered `userGoal` spine |
| Policy → Omit | Themes/ids to exclude from `capabilityIds` |
| Policy → Advanced only | Defer to Core Concepts / nested Advanced |
| Notes | Editorial constraints (comparisons, tone, etc.) |

If spec is missing, stop → run [docs-spec](../../docs-spec/SKILL.md).

## Step 1b. Scan inventory (do not page yet)

Read `.docs/docs-inventory.json`. For each capability, note `id`, `kind`, `title`, `audience` — **do not create a page list yet**.

Group mentally by **reader task**, not `kind`:

- What does a contributor need to publish?
- What does an integrator need to connect?
- What is lookup-only machinery?

## Step 1c. Inventory topics and tag buckets

Enumerate **topics** the docs could cover (fewer than capabilities). Tag each:

| Tag | Meaning | Typical `docType` |
| --- | --- | --- |
| `spine` | Phase 2 — journey starters | `tutorial`, `how-to`, `explanation` |
| `depth` | Phase 3 — customize, comparisons, concepts | `how-to`, `explanation` |
| `reference` | Phase 4 — lookup surfaces | `reference` |
| `omit` | Spec policy — no page | — |
| `defer` | Valid later; not in initial scaffold | — |

Read [references/topic-buckets.md](../references/topic-buckets.md) before tagging.

Apply [references/audience-check.md](../references/audience-check.md) with spec's **primary persona**.

## Step 1d. Propose merged page clusters

**Default: merge.** Apply [references/merge-rules.md](../references/merge-rules.md).

For each proposed page, define a **cluster**:

```markdown
### Quickstart: Publish from GitHub
- **Bucket:** spine
- **docType:** tutorial
- **userGoal:** first-success
- **audience:** contributor
- **Merges:** github-hosting, docs-json-config, cli-init, public-repos-only
- **Why merged:** Single first-success path per spec outcome
```

**Targets for this repo shape:**

| Area | Merge target | Anti-pattern |
| --- | --- | --- |
| Configuration | 3–5 customize how-tos + 1 `docs.json` reference hub | 1 page per config schema section |
| API | 3–5 grouped reference pages | 1 page per HTTP route |
| CLI | 1 commands overview + 1 programmatic page | 1 page per subcommand (unless distinct workflows) |
| Components | Category groups + per-component pages (exception) | Single mega-page |
| Integrate | How-tos in Guides paired with API reference groups | Duplicate leaves in Guides and API with no link |

Name clusters using [references/headline-style.md](../references/headline-style.md) — reader action, not bare nouns.

## Step 1e. Tab strategy

Derive tabs from **approved clusters**, not inventory kinds alone:

| Signal | Tab |
| --- | --- |
| `reference` clusters for HTTP/agent routes | API |
| `reference` clusters for CLI | CLI |
| `kind: component` pages (always split) | Components |
| Everything else | Documentation (root) |

Record tab list in plan. Tab `href` must be section roots — see [sidebar-ia.md](../sidebar-ia.md).

## Step 1f. Write scaffold-plan.md

Write `.docs/scaffold-plan.md` from [scaffold-plan.template.md](../scaffold-plan.template.md).

Include:

- Audiences (from spec)
- First success outcome
- Journey spine (ordered goals)
- **Page clusters** grouped by phase (spine / depth / reference)
- Tab strategy
- Omit and defer lists with capability ids
- Page budget: spine (~8–15), depth (~5–12), reference (variable)

## CHECKPOINT

Save `.docs/scaffold-plan.md`, show path, and ask the user to review:

- Are merges right? (too many pages vs too few)
- Is the spine short enough for a new contributor?
- Which `defer` topics should move to spine?
- Tab strategy OK?

**Do not write `docs.json` or stubs until approved.**

Suggest clearing context before Phase 2 if the conversation is long.
