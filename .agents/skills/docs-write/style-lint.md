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
| Explanation | No numbered install steps; links out for procedures |

---

## Voice and structure

- [ ] Steps start with imperative verbs (Click, Run, Set, Enable)
- [ ] No passive hedging ("It is recommended that…" → "Enable…")
- [ ] Paragraphs ≤ 3 lines; split or bulletize longer blocks
- [ ] Every setting change states **why** before **how**
- [ ] UI labels bold: **Settings**, **Save**
- [ ] Code, paths, env vars, JSON keys in `backticks`
- [ ] `status: beta` / `deprecated` called out near first mention

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
- [ ] `description` is specific, not generic ("Learn about X" → what X does)
- [ ] Fenced code blocks have language tags (`bash`, `json`, `tsx`)
- [ ] MDX components closed properly (`<Steps>`, `<Property>`)
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
