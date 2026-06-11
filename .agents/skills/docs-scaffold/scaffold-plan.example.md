---
version: "2.0.0"
updatedAt: 2026-06-11
sourceSpec: .docs/docs-spec.md
sourceInventory: .docs/docs-inventory.json
---

# Scaffold plan

Fictional **Taskflow** — example shape only.

Persona, journeys: `.docs/docs-spec.md`

## Nav

```
Documentation (/)
├── Getting Started [spine]
│   ├── Overview  /
│   └── Run your first job  /quickstart
├── Guides [depth]
│   ├── Deploy to production  /guides/deploy
│   └── Webhook retries  /guides/webhook-retries
└── Core Concepts [depth]
    └── Job lifecycle  /concepts/job-lifecycle

API (/api) [ref]
├── Overview  /api
└── REST reference  /api/rest

CLI (/cli) [ref]
├── Overview  /cli
└── Commands  /cli/commands

UI SDK (/ui) [ref]
├── Overview  /ui
└── Status widgets  /ui/status-widgets
```

## Budget

| Phase | Pages |
| --- | --- |
| Spine | 2 |
| Depth | 3 |
| Reference | 6 |
| **Total** | **11** |

## Merge map

| href | capabilities |
| --- | --- |
| `/` | _(editorial)_ |
| `/quickstart` | `cli-init`, `cli-run`, `dashboard-jobs-view` |
| `/guides/deploy` | `deploy-production`, `env-config` |
| `/guides/webhook-retries` | `webhook-retries` |
| `/concepts/job-lifecycle` | `job-lifecycle` |
| `/api/rest` | `api-jobs`, `api-webhooks`, `api-auth` |
| `/cli/commands` | `cli-init`, `cli-run`, `cli-status` |
| `/ui/status-widgets` | `component-status-widget` |

## Decisions

- Quickstart merges CLI init + first job + dashboard view (one tutorial).
- Three API resources → one REST reference page.

## Pairs

| guide | reference |
| --- | --- |
| `/quickstart` | `/cli/commands` |
| `/guides/webhook-retries` | `/api/rest` |

## Omit

| id | reason |
| --- | --- |
| `internal-metrics` | spec omit |

## Defer

| id | reason |
| --- | --- |
| `multi-region-failover` | advanced-only; later scaffold |
