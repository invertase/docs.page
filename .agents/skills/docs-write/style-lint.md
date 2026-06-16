# Style lint and self-correction pass

Run this checklist **after** drafting, **before** delivering files. Fix every failing item.

---

## Stub cleanup (required for final content)

- [ ] No `_TBD_` placeholders
- [ ] No legacy `docs-scaffold-plan-start` / `docs-scaffold-plan-end` markers (if present in older stubs)
- [ ] No legacy "Documentation plan" or "Section index" planning callouts

---

## Diátaxis purity

| Check | Pass criteria |
| --- | --- |
| Single mode | Page content matches routed doc type only |
| Tutorial | No `<Property>` tables, no exhaustive flag lists |
| Reference | No `<Steps>`, no "you will learn" |
| How-To | Problem stated up front; no architecture essays |
| Explanation | No numbered install steps; links out for procedures; no standalone `## Design tradeoffs` unless outline requires it |

---

## Locale (international English)

Use **international English** (American spelling and conventions), not British English.

| British | International |
| --- | --- |
| behaviour | behavior |
| colour, coloured, colouring | color, colored, coloring |
| emphasise, emphasised | emphasize, emphasized |
| synchronise, synchronised, synchronisation | synchronize, synchronized, synchronization |
| labelled | labeled |
| initialise | initialize |
| centred | centered |
| favourites | favorites |
| unrecognised | unrecognized |
| backwards compatibility | backward compatibility |

- [ ] No British `-ise` / `-our` spellings remain (unless quoting external text verbatim)

---

## Voice and structure

- [ ] Steps start with imperative verbs (Click, Run, Set, Enable)
- [ ] No passive hedging ("It is recommended that…" → "Enable…")
- [ ] Paragraphs ≤ 3 lines; split or bulletize longer blocks
- [ ] Every setting change states **why** before **how**
- [ ] UI labels bold: **Settings**, **Save**
- [ ] Code, paths, env vars, JSON keys in `backticks`
- [ ] `status: beta` / `deprecated` called out near first mention

## Description voice (all doc types)

| Check | Pass criteria |
| --- | --- |
| Reader benefit | `description` answers *why open this page?* — imperative or *you*-focused; not a feature/prop inventory |
| Not inventory copy | Does not copy or lightly paraphrase inventory `summary` or outline technical purpose |
| Distinct from intro | Opening paragraph adds **different** information — scope, workflow position, syntax anchor, or hook. **Fail** if it restates `description` or shares the same leading verb/command |
| Optional intro honored | How-to and reference pages omit the opening paragraph when the first `##` section already orients the reader |

- [ ] Read `description` and opening paragraph together — rewrite or delete the opening if they fail the duplication test in [templates.md](templates.md#duplication-test)

---

## Banned and weak phrases

Remove or rewrite on sight:

| Remove | Replace with |
| --- | --- |
| In order to | To |
| Please note that | (delete; state fact directly) |
| Simply click / Just click | Click |
| It's important to note | (delete) |
| At this point in time | Now |
| In the event that | If |
| Utilize | Use |
| Leverage | Use |
| Going forward | (delete or "Later") |
| As mentioned above | (delete or restate briefly) |
| We recommend | (state requirement level: must / should / optional) |

---

## docs.page formatting

- [ ] Frontmatter has `title` and `description`
- [ ] `description` passes **Description voice** checks above (not "Learn about X", not a catalog of capabilities)
- [ ] Fenced code blocks have language tags (`bash`, `json`, `tsx`)
- [ ] MDX components closed properly (`<Steps>`, `<Property>`)

### Component accuracy

- [ ] Every MDX component used appears in the published index ([use.docs.page/components](https://use.docs.page/components))
- [ ] Syntax matches the published page (child element names, required props)
- [ ] No `<Callout>`, `<Cards>`, or other invented component names
- [ ] Diátaxis component limits still pass (see **Diátaxis purity** above)
- [ ] Images use project asset paths; alt text or descriptive captions where shown
- [ ] Internal links use root-relative paths (`/configuration`, not full URLs)
- [ ] External links fully qualified `https://`

---

## Accuracy

- [ ] Claims match `docs-inventory.json` or code read from `sources`
- [ ] Defaults and optional fields match schema — no guessed values
- [ ] CLI commands and HTTP methods match `surface` entries
- [ ] `schema-only` capabilities documented as unavailable or preview, not as shipped

---

## Navigation coherence

- [ ] In-body **Next steps** / **See also** links to correct doc types (not circular only)
- [ ] Sidebar `title` and frontmatter `title` aligned
- [ ] New page appears in `docs.json` if user expects nav discovery

---

## Quick rewrite examples

**Before:** In order to reduce latency, you should simply navigate to the settings page and utilize the edge caching toggle.

**After:** To reduce latency, open **Settings > Performance** and set **Edge Caching** to **ON**.

---

**Before:** Please note that the `sidebar` property is an array of objects which can be used to configure navigation.

**After:** The `sidebar` property is an array of group objects that define navigation.

---

**Before (tutorial with reference leak):** Step 1: Install the CLI. The `--format` flag accepts `json`, `yaml`, and `toml` with default `json`…

**After:** Step 1: Install the CLI. → Move flag table to Reference page; link "CLI options".

---

**Before (catalog description):** Tabs and TabItem panels with optional groupId synchronization and persisted tab selection.

**After (reader description):** Organize content into switchable panels for options, platforms, or language examples.

---

**Before (catalog description):** Collapsible Accordion panels and AccordionGroup layouts for FAQs and optional detail.

**After (reader description):** Hide optional detail behind expandable sections—ideal for FAQs and progressive disclosure.

---

**Before (vague description):** Learn about the Tabs component.

**After (reader description):** Organize related content into switchable panels readers can flip between.

---

**Before (duplicated intro — how-to):**

```yaml
description: Run docs check before you push to catch broken links, missing assets, and unreachable external URLs.
```

Run `docs check` after local preview looks right and before you push. The command scans your pages for link and asset problems.

**After:**

```yaml
description: Run docs check before you push to catch broken links, missing assets, and unreachable external URLs.
```

## Before you begin

- A docs.page project with `docs.json` and page files under `docs/`
```

Opening paragraph deleted — `## Before you begin` carries the entry point. Alternative: keep one sentence of **workflow context only**: *"Run this after preview and before you open a pull request."*

---

**Before (duplicated intro — reference):**

```yaml
description: Configure sidebar navigation groups and page links in docs.json.
```

Use the `sidebar` property in `docs.json` to configure sidebar navigation groups and page links.

**After:**

```yaml
description: Configure sidebar navigation groups and page links in docs.json.
```

## sidebar

<Property name="sidebar" type="array" required>
```

Opening paragraph deleted — first section is self-explanatory. Alternative syntax pointer: *"Each group is an object in the top-level `sidebar` array."*
