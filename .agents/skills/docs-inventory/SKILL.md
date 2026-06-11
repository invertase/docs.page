---
name: docs-inventory
description: >-
  Discovers product capabilities from source code and creates or updates
  docs-inventory.json. Use after docs-spec when building a feature inventory,
  cataloging APIs/CLI/config surface area, refreshing docs-inventory.json, or when the
  user mentions docs-inventory, docs-inventory.json, feature-finder, features.json,
  feature inventory, or code-derived documentation metadata.
---

# Docs Inventory

Catalog **what the product does** by reading source code. Output is `docs-inventory.json` — a code-derived inventory for downstream tools (e.g. docs-scaffold). It does **not** decide where capabilities appear in documentation.

## Pipeline position

```
docs-spec        →  .docs/docs-spec.md
docs-inventory   →  .docs/docs-inventory.json       ← you are here
docs-scaffold    →  docs.json + stub .mdx + docs check
docs-write       →  full .mdx content
```

**Optional upstream:** `.docs/docs-spec.md` from [docs-spec](../docs-spec/SKILL.md). When present, read `## Scan focus` and journey hints to **prioritize scanning** — do not copy editorial content into `docs-inventory.json`.

## Project layout

Write to `.docs/docs-inventory.json` at the project root. Path resolution: [docs-scaffold — Project layout](../docs-scaffold/SKILL.md#project-layout).

## Scope

**In scope**
- Discover capabilities from implementation code
- Create or incrementally update `docs-inventory.json`
- Trace every entry to verifiable `sources`
- Mark implementation status honestly (`stable`, `beta`, `schema-only`, `deprecated`)

**Out of scope**
- Writing documentation prose
- Mapping capabilities to doc pages, nav, or slugs
- Using existing docs/README/marketing copy as evidence of behavior
- Inventing capabilities not grounded in code

## Output location

Resolve path per [docs-scaffold — Project layout](../docs-scaffold/SKILL.md#project-layout):

1. User-specified path
2. `.docs/docs-inventory.json` (create `.docs/` if needed)
3. Repo-root `docs-inventory.json` (legacy fallback — update in place)

## Output schema

```json
{
  "version": "2.0.0",
  "updatedAt": "YYYY-MM-DD",
  "capabilities": []
}
```

One top-level array. Each capability is self-contained; use `kind` to classify — not separate arrays per type.

### Capability entry

| Field | Required | Notes |
|-------|----------|-------|
| `id` | yes | Stable kebab-case slug; never rename without reason |
| `kind` | yes | Classifier string (see kinds below) |
| `title` | yes | Short human name |
| `summary` | yes | 1–2 sentences describing behavior |
| `status` | yes | `stable`, `beta`, `schema-only`, or `deprecated` |
| `audience` | no | Free-form tags, e.g. `integrator`, `end-user`, `operator`, `contributor` |
| `sources` | yes | Code pointers (see below) |
| `configuration` | no | How the capability is configured, if applicable |
| `surface` | no | How it's exposed to consumers (free-form) |
| `related` | no | Other capability `id`s |
| `writingNotes` | no | Non-obvious behavior, gotchas, or gaps for downstream consumers |

### `kind` values

Use the closest match. Prefer these standard kinds; add a new kind only when none fit.

| kind | Use for |
|------|---------|
| `feature` | Product behavior, domain logic, user-visible functionality |
| `api` | HTTP/RPC/GraphQL endpoints, webhooks, public service interfaces |
| `cli` | CLI commands, subcommands, global flags |
| `export` | Public library/SDK exports, published modules |
| `component` | UI widgets, shortcodes, reusable building blocks |
| `integration` | Third-party adapters (auth providers, storage, payments) |
| `job` | Background jobs, cron tasks, queue workers, pipelines |
| `hook` | Extension points, callbacks, middleware, lifecycle hooks |
| `plugin` | Plugin types, registries, extension mechanisms |
| `resource` | Infra resources (Terraform, K8s CRDs, cloud entities) |
| `workflow` | Multi-step flows, state machines, orchestrations |

### `sources` entry

```json
{ "path": "relative/from/repo/root", "symbol": "OptionalExport", "role": "optional label" }
```

Every claim in `summary` must be verifiable from at least one `sources` path.

### `configuration` entry (when applicable)

```json
{
  "type": "file",
  "path": "database.url",
  "model": "src/config/schema.ts"
}
```

| `type` | Meaning | `path` examples |
|--------|---------|-----------------|
| `file` | Config file or key in a schema | `agent.limits`, `docs.json` |
| `env` | Environment variable(s) | `RATE_LIMIT`, `DATABASE_URL` |
| `remote` | Remote/DB-backed settings | feature-flag key, admin setting name |

Omit `configuration` when the capability is not user- or operator-configurable.

### `surface` entry (when applicable)

Free-form object describing how consumers reach the capability. Use keys that match the stack; none are required.

| Key | Typical use |
|-----|-------------|
| `http` | REST paths, methods |
| `graphql` | Operation names, types |
| `grpc` | Service/method names |
| `cli` | Command strings |
| `sdk` | Public function/class names |
| `events` | Event or topic names |
| `ui` | Routes, screens, panels |
| `cron` | Schedule expressions |
| `queue` | Queue/topic names |

Example:

```json
{
  "http": ["GET /api/v1/users"],
  "sdk": ["createUser()"]
}
```

### Examples

**API middleware (web service)**

```json
{
  "id": "rate-limiting",
  "kind": "feature",
  "title": "API rate limiting",
  "summary": "Limits requests per client IP using a sliding window stored in Redis.",
  "status": "stable",
  "audience": ["integrator", "operator"],
  "sources": [
    { "path": "src/middleware/rate-limit.ts", "role": "middleware" },
    { "path": "src/lib/redis.ts", "role": "storage" }
  ],
  "configuration": {
    "type": "env",
    "path": "RATE_LIMIT",
    "model": "src/config/env.ts"
  },
  "surface": { "http": ["all /api/* routes"] },
  "related": [],
  "writingNotes": [
    "Default limit is 100 req/min when RATE_LIMIT is unset."
  ]
}
```

**Library export**

```json
{
  "id": "parse-csv",
  "kind": "export",
  "title": "parseCsv",
  "summary": "Parses CSV strings into typed row objects with header detection.",
  "status": "stable",
  "audience": ["integrator"],
  "sources": [
    { "path": "src/index.ts", "symbol": "parseCsv" },
    { "path": "src/parse-csv.ts", "role": "implementation" }
  ],
  "surface": { "sdk": ["parseCsv(input, options?)"] },
  "related": ["stream-csv"]
}
```

**Background job**

```json
{
  "id": "nightly-sync",
  "kind": "job",
  "title": "Nightly data sync",
  "summary": "Pulls changes from the upstream API and reconciles local records.",
  "status": "stable",
  "audience": ["operator"],
  "sources": [
    { "path": "src/jobs/nightly-sync.ts", "role": "worker" }
  ],
  "surface": { "cron": ["0 2 * * *"], "queue": ["sync-nightly"] },
  "related": ["upstream-api-client"]
}
```

## Discovery workflow

Copy and track progress:

```
Docs Inventory Progress:
- [ ] 0. Spec — read docs-spec.md scan focus if present
- [ ] 1. Orient — identify project type and layout
- [ ] 2. Scan — collect capability signals from code
- [ ] 3. Draft — write or merge entries
- [ ] 4. Verify — every entry has sources; no doc-placement fields
- [ ] 5. Write — save docs-inventory.json; set updatedAt
```

### Step 0: Read docs-spec (optional)

If `docs-spec.md` exists (resolved per [docs-scaffold — Project layout](../docs-scaffold/SKILL.md#project-layout)):

- Read `## Scan focus` — scan those paths/packages first and thoroughly
- Read `## First success` hints — ensure matching CLI/API/config capabilities are discovered
- Read `## Policy` → `Omit` — do not skip inventory entries for omitted themes unless the user asks; omit policy applies to **documentation**, not the inventory. Still catalog capabilities; docs-scaffold will unmap them.

If `docs-spec.md` is missing and the user is starting a full documentation pipeline, suggest running [docs-spec](../docs-spec/SKILL.md) first — but continue if they only want a code inventory refresh.

### Step 1: Orient

Determine project shape before scanning. Inspect root manifests (`package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, etc.) and top-level directories.

Classify the codebase (one or more):

| Type | Typical signals |
|------|-----------------|
| Web app / API | `routes/`, `controllers/`, `app/api/`, `src/pages/api/` |
| CLI | `bin/`, `cmd/`, `commands/`, `cli.ts`, Commander/Click/Cobra |
| Library / SDK | `src/index.ts`, `lib/`, public exports, `__all__` |
| Config-driven | Zod/Joi/json-schema, `config/`, `settings.*` |
| Monorepo | `packages/`, `apps/`, workspaces in root manifest |
| Plugin / extension | registries, component maps, hook lists |
| Data / jobs | `jobs/`, `workers/`, `pipelines/`, Airflow/Dagster defs |
| Infra | `terraform/`, `charts/`, CRD manifests, operator code |

Note the primary language, test framework, and whether docs live in-repo (ignore them as sources).

### Step 2: Scan — where to look

Search systematically. Adapt paths to the stack; do not assume a specific framework.

**Configuration & types**
- Schema files (Zod, JSON Schema, OpenAPI, protobuf, GraphQL SDL)
- Env validation (`env.ts`, `settings.py`, `.env.example`)
- Feature flags or toggles

**Public API surface**
- HTTP route definitions (REST, GraphQL resolvers, RPC handlers)
- OpenAPI/Swagger specs if present
- WebSocket/event endpoints
- Public package exports (`exports` in package.json, `__init__.py`, `mod.rs` pub items)

**CLI**
- Command registration (Commander, yargs, cobra, argparse)
- Subcommand files and `--help` strings
- Shell completion definitions

**UI & extension surface**
- Component registries or plugin maps
- Shortcodes, macros, or template tags
- Screens, routes, form definitions tied to product behavior

**Core domain**
- Service modules, use-case handlers, background jobs
- Integration adapters (auth providers, storage backends, webhooks)

**Behavioral specs**
- Tests that enumerate cases (prefer over comments)
- Error code constants and typed error enums
- Validation rules in linters/check commands

**Infrastructure hooks**
- Middleware, proxies, CDN/cache rules
- Health/readiness endpoints
- CRDs, Terraform resources, reconciler loops

**Do not use as primary sources**
- `docs/`, `*.md` guides, wiki, marketing site copy
- Comments without matching implementation
- Dead code with no callers (mark `deprecated` or omit)

### Step 3: Draft entries

**Granularity:** One entry per distinct user-facing, integrator-facing, or operator-facing capability. Split when behavior, audience, or configuration differ meaningfully. Merge when differences are implementation detail.

**Component registries:** When a product exposes many named UI widgets, shortcodes, or MDX components from a registry, prefer **one `kind: component` entry per named component** — not one umbrella catalog entry. Populate `surface.ui` with the single component name. Link siblings via `related`. If the registry is large and homogeneous, a parent entry plus per-component children is acceptable only when each child has its own `sources` file; downstream [docs-scaffold](../docs-scaffold/SKILL.md) expects one doc page per component.

Example split:

```json
{
  "id": "component-steps",
  "kind": "component",
  "title": "Steps",
  "summary": "Renders a numbered sequence of procedural steps in documentation.",
  "surface": { "ui": ["Steps"] },
  "sources": [{ "path": "src/components/mdx/steps.tsx" }],
  "related": ["component-tabs"]
}
```

**ID rules**
- kebab-case, descriptive, stable: `branch-ref-routing`, not `feature-12`
- Reuse existing IDs on update; never delete IDs without confirming removal from codebase

**Status rules**

| Status | When |
|--------|------|
| `stable` | Implemented, wired, and used in production paths |
| `beta` | Behind flag, incomplete, or explicitly experimental in code |
| `schema-only` | Defined in types/config but no implementation found |
| `deprecated` | Marked deprecated or superseded; still present |

For `schema-only`, add a `writingNotes` line explaining what implementation was searched for.

**Kind selection:** Pick the kind that best describes how consumers interact with the capability. A REST endpoint is `api`; the business logic behind it may be a separate `feature` entry if substantial enough to document independently.

### Step 4: Verify

Before writing the file:

- [ ] Every entry has at least one `sources` path that exists
- [ ] No entry contains doc-placement fields (`doc`, `slug`, `sectionId`, `priority`, `pageType`)
- [ ] `summary` text is supported by cited sources (re-read if unsure)
- [ ] `related` IDs reference entries in the same `capabilities` array
- [ ] `schema-only` entries have a note on what was searched
- [ ] Removed capabilities: delete entry only if code is gone; otherwise mark `deprecated`
- [ ] `id` values are unique across `capabilities`

### Step 5: Write

- Set `updatedAt` to today's date (ISO `YYYY-MM-DD`)
- Bump `version` only on breaking schema changes to the inventory format
- Pretty-print JSON with 2-space indent
- Preserve unrelated entries when updating

## Create vs update

**Creating:** Run full discovery workflow; start with high-signal areas (config schema, route tables, CLI registration, public exports).

**Updating:**
1. Read existing `docs-inventory.json`
2. Re-scan areas affected by recent changes or user scope
3. Merge: update changed entries in place, add new, deprecate or remove stale
4. Do not reorder entries gratuitously; keep stable diffs

When the user scopes the task ("only CLI", "only APIs"), touch only matching `kind` entries unless cross-cutting `related` links need updates.

If migrating from schema `1.x` (separate `features`/`components`/`apis`/`cliCommands` arrays), flatten all entries into `capabilities`, preserve `id` and fields, set `version` to `2.0.0`.

## Stack-specific hints

Use as starting points; always confirm in code.

| Stack | High-signal locations |
|-------|----------------------|
| Node / TypeScript | `package.json` exports, route handlers, `src/server/`, Commander CLI |
| Python | `pyproject.toml` entry points, `cli.py`, FastAPI/Flask routers, Pydantic models |
| Go | `cmd/`, `internal/`, OpenAPI embeds, cobra commands |
| Rust | `src/lib.rs` pub exports, `clap` derives, `api/` modules |
| Ruby | `lib/`, Rails routes, Thor/Rake tasks |
| Java / Kotlin | `@RestController`, `module-info`, Gradle source sets |

For monorepos, scan each package/app independently; prefix `id` with package name only when IDs would collide.

## Quality bar

A good inventory entry answers:
1. **What** does it do? (`summary`)
2. **Where** is it implemented? (`sources`)
3. **How** is it exposed? (`surface`, `configuration`)
4. **What else** is it connected to? (`related`)
5. **What** might trip up a downstream consumer? (`writingNotes`)

A poor entry cites README text, guesses behavior, or duplicates documentation structure.

## Additional resources

- Editorial spec (optional upstream): [docs-spec](../docs-spec/SKILL.md)
- Project layout: [docs-scaffold](../docs-scaffold/SKILL.md#project-layout)

## Reporting to the user

After completing the task, briefly summarize:
- Output path
- Total capability count, broken down by `kind`
- New, updated, deprecated, or removed entries
- Any `schema-only` items worth follow-up
- Areas not scanned (if scope was limited)
