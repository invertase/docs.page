# User goal ids

Shared vocabulary for `docs-spec.md` journeys and `docs.json` `outline.pages[].userGoal`.

Pick the **single** goal a page primarily serves. Order journeys in `docs-spec.md` using these ids.

| `userGoal` | Reader intent | Typical `docType` | Typical placement |
| --- | --- | --- | --- |
| `orient` | Understand what the product is | `explanation` | Overview (landing) |
| `first-success` | Complete one end-to-end win | `tutorial` | Getting Started |
| `author-content` | Write, format, and organize pages | `how-to` | Getting Started or Guides |
| `customize` | Change theme, nav, branding, config | `how-to` + `reference` | Configuration |
| `integrate` | Connect via API, SDK, webhooks, CLI | `how-to` + `reference` | API, CLI, Integrations |
| `operate` | Deploy, monitor, scale, troubleshoot | `how-to` | Guides (operations) |
| `understand` | Learn architecture, concepts, tradeoffs | `explanation` | Core Concepts |
| `lookup` | Find exact field, flag, prop, signature | `reference` | Reference groups / tabs |

## Audience pairing

| Audience | Usually cares about |
| --- | --- |
| `end-user` | `orient`, `first-success` |
| `contributor` | `author-content`, `first-success` |
| `integrator` | `integrate`, `customize`, `lookup` |
| `operator` | `operate`, `integrate` |

`docs-spec.md` sets `primaryPersona`; pages may list multiple `audience` values in the outline.

## Journey spine defaults

When the interview does not specify a custom order, suggest this spine for the primary persona:

**Contributor-led (documentation products):**
`orient` → `first-success` → `author-content` → `customize` → `integrate` → `operate` → `understand`

**Integrator-led (APIs, SDKs):**
`orient` → `first-success` → `integrate` → `lookup` → `customize` → `operate` → `understand`

**Operator-led (infra, self-hosted):**
`orient` → `first-success` → `operate` → `integrate` → `lookup` → `understand`

Adjust order in `docs-spec.md`; [docs-scaffold](../docs-scaffold/SKILL.md) treats the spec as authoritative over inferred defaults.
