# Merge rules

**Default: merge.** Split only when `userGoal` or `docType` genuinely differ.

Inventory describes machinery. Pages describe reader tasks.

## Merge into one page

| Signal | Example |
| --- | --- |
| Same `userGoal` and workflow | local preview + file watcher → "Local preview" how-to |
| Config keys in same customize task | theme + logo + favicon → "Customize theme and branding" |
| API endpoints in same resource group | agent create/delete/chat → "Agent & MCP APIs" reference |
| CLI flags for one command | `check` flags on one reference page |
| Steps of one tutorial | GitHub hosting + docs.json + first push → Quickstart |

## Split into separate pages

| Signal | Example |
| --- | --- |
| Different `userGoal` | customize how-to vs docs.json field reference |
| Tutorial vs reference for same feature | "Enable AI chat" how-to vs Agent API reference |
| Distinct CLI subcommands with different workflows | `init` vs `agent create` (if not one workflow) |
| UI components | **always** one page per `surface.ui` entry |

## Configuration (critical)

| Do | Don't |
| --- | --- |
| 3–5 customize **how-tos** by task theme | 1 page per Zod schema section |
| 1 **reference** hub for `docs.json` fields | 10+ top-level Configuration leaves |
| Nest reference fields under hub or accordion on one page | Flat list of 12 config pages |

## API (critical)

| Do | Don't |
| --- | --- |
| 4–6 **grouped** reference pages by domain | 1 page per `kind: api` capability |
| Section index at `/api` listing groups | 12 sibling leaves under flat API group |

## CLI

| Do | Don't |
| --- | --- |
| Commands group + Programmatic group | Flat list of every subcommand as top-level sibling |
| Overview at `/cli` | Tab `href` pointing at `/cli/init` |

## Components (exception)

Always split — one page per component. Nest under category sub-groups when ≥3.

## Page budget (initial scaffold)

| Phase | Target count | If exceeded |
| --- | --- | --- |
| Spine | 8–15 | Merge harder; defer to depth/reference |
| Depth | 5–12 | Merge config; defer comparisons |
| Reference | Variable | Group API/CLI; components are per-widget |

## Validation signals

Flag `inventory-mirror` warning when:

- API leaf count ≥ 80% of `kind: api` capability count
- Configuration leaf count ≥ 80% of `configuration`-tagged capabilities
- Average `capabilityIds` per page < 1.2 outside Components tab
