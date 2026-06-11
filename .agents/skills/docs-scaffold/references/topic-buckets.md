# Topic buckets

Tag every **topic** (not every capability) in Phase 1 before creating pages.

Shared `userGoal` ids (from [docs-spec](../../docs-spec/user-goals.md)):

| `userGoal` | Reader intent |
| --- | --- |
| `orient` | Understand what the product is |
| `first-success` | Complete one end-to-end win |
| `author-content` | Write and organize pages |
| `customize` | Change theme, nav, branding |
| `integrate` | Connect via API, SDK, MCP, CLI |
| `operate` | Deploy, monitor, troubleshoot |
| `understand` | Architecture and design tradeoffs |
| `lookup` | Exact fields, flags, props, signatures |

## Bucket tags

| Tag | Phase | When to use |
| --- | --- | --- |
| `spine` | 2 | Journey starters: orient, first-success, author-content, core integrate how-tos |
| `depth` | 3 | Customize clusters, comparisons (editorial), Core Concepts |
| `reference` | 4 | Grouped lookup: API, CLI, component props |
| `omit` | — | Spec policy; no `capabilityIds` |
| `defer` | — | Valid but not in initial scaffold; list in coverage |

## Diátaxis → `docType`

| Doc type | Orientation | Pair with |
| --- | --- | --- |
| `tutorial` | Learning | `first-success`, `orient` |
| `how-to` | Task | `author-content`, `customize`, `integrate`, `operate` |
| `reference` | Lookup | `lookup` |
| `explanation` | Understanding | `understand`, `orient` |

## Bucket heuristics

### Spine (`spine`)

- First-time learning path for primary persona
- Spec `Journeys` items before `customize` and heavy `lookup`
- Quickstart must match spec **First success** outcome

### Depth (`depth`)

- **Aside test:** you'd digress on it in Quickstart but cut for flow → depth how-to or explanation
- **Customization test:** reader tunes behavior after first publish → merged customize how-to
- **Comparisons:** editorial from spec Notes → depth (not reference)
- **Mental-model test:** architecture / internals → depth `understand`, spec `advancedOnly` only

### Reference (`reference`)

- Signature + one sentence covers it → reference **group**, not necessarily its own page
- HTTP routes, CLI flags, component props → grouped reference pages
- **Exception:** UI components → one page per component (always)

### Omit / defer

- `omit`: spec Policy → Omit
- `defer`: low-priority capabilities; record ids in `unmappedCapabilityIds` with note

## Guide + reference pairing

When a topic serves `integrate` **and** `lookup`:

| Bucket | Placement | Example |
| --- | --- | --- |
| `spine` or `depth` | Guides how-to | "Enable AI chat" |
| `reference` | API grouped page | "Agent & MCP APIs" |

Link in stub plan blocks — do not duplicate unlinked leaves.

## Anti-patterns

- Tagging every `kind: api` capability as its own `reference` page
- `reference` pages in Getting Started top-level
- `tutorial` with only lookup tables
- `understand` in Getting Started before `first-success`
