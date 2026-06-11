# Phase 4: Reference tabs + validate

## Resuming from cold context

Read before starting:

- `.docs/scaffold-plan.md` — **approved**; implement `[ref]` leaves from **Nav** + **Merge map**
- `docs.json` from Phase 3
- `.docs/docs-inventory.json`
- [sidebar-ia.md](../sidebar-ia.md)
- [stub-templates.md](../stub-templates.md)
- [cli.md](../cli.md)

## Goal

Add **`[ref]` tabs and pages**, complete stubs, pass `docs check`.

## Steps

### 4a. Tabs + sidebar

Add tabs from plan nav roots (`/api`, `/cli`, `/components`). Section landing at each tab `href`.

### 4b. Reference pages

- `capabilityIds` from **Merge map**
- Components: one leaf per row in merge map (may use grouped table in plan for sub-groups)
- Minimal overview stubs at tab roots (no traceability tables)

### 4c. Coverage

`unmappedCapabilityIds` from **Omit** + **Defer** tables in plan.

### 4d. Validate + CLI

IA rules in [SKILL.md](../SKILL.md). Run `docs check . --external-links off`.

## CHECKPOINT

Full nav tree summary, page count, `cliCheck`, next: **docs-write**.
