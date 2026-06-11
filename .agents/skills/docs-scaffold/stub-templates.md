# MDX stub templates

Preview-ready `.mdx` stubs. Planning context is **rendered on the page**, not in `docs.json`. [docs-write](../docs-write/SKILL.md) removes scaffold blocks when writing final content.

## Rules

- Copy `title` and `description` from `outline.pages` frontmatter
- **Always include** the documentation plan block on new stubs
- Section landing pages (`href` = tab `href`) use the **section index** template
- Never overwrite `status: existing` unless user requests
- Skip `status: retire`
- Resolve capability titles from `.docs/docs-inventory.json`
- **Ban generic rationale** — see below

## Plan block quality (required)

`$RATIONALE` must be a **specific** sentence covering:

1. Why this page exists in the journey
2. What was merged (if multiple `capabilityIds`)
3. Where it pairs (for guide ↔ reference pairs)

| Banned | Example of good |
| --- | --- |
| "Scaffold stub — replace with final prose" | "First-success tutorial merging GitHub hosting and docs.json setup per scaffold-plan Quickstart cluster." |
| "TBD" | "Customize how-to merging theme, logo, and favicon config keys." |

Flag `generic-stub-plan` warning if banned text appears.

---

## Documentation plan block

```mdx
{/* docs-scaffold-plan-start */}

<Info>
**Documentation plan** — remove this block when writing final content.

| | |
| --- | --- |
| **Doc type** | $DOC_TYPE |
| **User goal** | $USER_GOAL |
| **Audience** | $AUDIENCE |

$RATIONALE

**Capabilities covered**

$CAPABILITY_LIST

$RELATED_LINKS
</Info>

{/* docs-scaffold-plan-end */}
```

| Token | Source |
| --- | --- |
| `$RATIONALE` | Compose at stub time from scaffold-plan cluster — **never** store in `docs.json` |
| `$CAPABILITY_LIST` | Bullet per `capabilityId` with title from inventory |
| `$RELATED_LINKS` | Optional paired guide/reference links |

---

## Section index template

For `href` equal to tab `href` (`/cli`, `/api`, `/components`):

```mdx
{/* docs-scaffold-plan-start */}

<Info>
**Section index** — remove when writing final content. Grouped reference for this tab per scaffold-plan.
</Info>

{/* docs-scaffold-plan-end */}

## Pages in this section

| Page | Capabilities |
| --- | --- |
| $ROW | $IDS |
```

---

## docType body placeholders

After the plan block, add minimal structure:

| docType | Sections |
| --- | --- |
| `tutorial` | Prerequisites, Steps, Next steps |
| `how-to` | Before you begin, Steps, Verify |
| `reference` | Overview, Reference |
| `explanation` | Summary, Details |

Use `_TBD_` in body sections only — not in plan rationale.
