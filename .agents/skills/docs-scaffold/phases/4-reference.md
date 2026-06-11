# Phase 4: Reference tabs + validate

## Resuming from cold context

Read before starting:

- `.docs/scaffold-plan.md` — **approved** clusters tagged `reference`
- `docs.json` — spine + depth from Phases 2–3
- `.docs/docs-inventory.json`
- [sidebar-ia.md](../sidebar-ia.md)
- [stub-templates.md](../stub-templates.md)
- [cli.md](../cli.md)

## Goal

Add **grouped reference** tabs, complete stubs, pass `docs check`.

## Step 4a. Add tabs

From plan tab strategy. Minimum viable:

| Tab | `href` | Landing stub required |
| --- | --- | --- |
| CLI | `/cli` | `docs/cli/index.mdx` |
| API | `/api` | `docs/api/index.mdx` |
| Components | `/components` | `docs/components/index.mdx` |

Section root `href` only — never `/cli/init` as tab href.

## Step 4b. Grouped reference (not 1:1 inventory)

Apply [references/merge-rules.md](../references/merge-rules.md):

### API tab

| Group | Example pages | Merges |
| --- | --- | --- |
| Documents | Bundle API, Raw markdown | bundle + raw routes |
| Agent & MCP | Agent APIs, MCP server | agent chat/create/delete + mcp |
| LLM exports | llms.txt, llms-full.txt | export endpoints |
| Discovery | search.json, schema, sitemap, robots | discovery routes |

**Pair with Guides:** each integrate how-to links to its reference group in plan blocks.

### CLI tab

| Group | Pages |
| --- | --- |
| Commands | Overview + init, check (grouped or per-command only when workflows differ) |
| Programmatic | CLI API URL config |

### Components tab

**Exception:** one page per component — always split.

- Nest under category sub-groups when ≥3 components
- Section index at `/components` with traceability table

## Step 4c. Complete outline + stubs

- Every sidebar leaf → `outline.pages` + `.mdx` stub
- `status: existing` pages untouched unless user requested overwrite
- Section landing pages use **section index** template
- Ban generic plan text — see [stub-templates.md](../stub-templates.md)

## Step 4d. Coverage

`outline.coverage.unmappedCapabilityIds`:

- Spec omit policy ids
- Deferred clusters (tag `defer` in plan)
- Report unmapped with recommended action in user summary

## Step 4e. Validate

### IA rules (errors unless noted)

| Rule | Check |
| --- | --- |
| `forbidden-outline-fields` | No `_rationale`, `rationale`, `splits`, etc. |
| `generic-stub-plan` | warning if plan block contains only "Scaffold stub" |
| `inventory-mirror` | warning if API/CLI leaf count ≈ capability count (likely 1:1) |
| `max-groups-per-tab` | ≤7 top-level groups per tab |
| `tab-href-not-section-root` | Tab href = section root |
| `tab-missing-landing` | Page at each tab `href` |
| `missing-mdx` | Every sidebar href has file |
| `sidebar-outline-sync` | Bi-directional sync |
| `component-flat-list` | ≥3 components need category sub-groups |

Set `outline.validation.passed: true` only when IA errors resolved **and** `cliCheck.passed`.

### CLI

```bash
docs check . --external-links off
```

See [cli.md](../cli.md). Record `cliCheck` in `outline.validation`.

## CHECKPOINT

Final review:

- Full sidebar tree (all tabs)
- Page count by phase (spine / depth / reference)
- Warnings (`inventory-mirror`, `generic-stub-plan`)
- `unmappedCapabilityIds`
- `docs check` result

Next step: preview site → **docs-write**.
