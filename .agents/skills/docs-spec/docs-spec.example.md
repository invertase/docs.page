---
version: "1.0.0"
updatedAt: 2026-06-11
---

# Documentation spec

Fictional **Taskflow** product — example only; do not copy into real projects.

## Positioning

Taskflow is async job orchestration for product teams who need reliable background work without running their own queue infrastructure.

## Audience

- **Primary persona:** integrator
- **Secondary:** operator, contributor

## First success

- **Outcome:** Create a project, enqueue a job from the CLI, and see it complete in the dashboard.
- **Hints:** `cli-init`, `cli-run`, `dashboard-jobs-view`

## Journeys

1. **orient** — product overview for evaluators
2. **first-success** — quickstart: CLI init + first job
3. **integrate** — webhooks, SDK calls, API auth
4. **operate** — deploy, retries, monitoring
5. **lookup** — API reference, config keys
6. **understand** — job lifecycle, delivery guarantees

## Policy

### Omit

- internal-metrics
- marketing-homepage

### Advanced only

- multi-region-failover
- custom-worker-images

## Notes

Lead with integrator quickstart; operators join after first API success. Do not document alpha dashboard experiments.

## Scan focus

- `packages/cli/`
- `packages/api/src/routes/`
- `packages/dashboard/components/`
