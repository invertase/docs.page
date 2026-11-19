# Proposal: Sidebar expand/collapse defaults and Collapse all / Open all

**Status:** Feasibility proposal (not implemented)  
**Area:** Hosted docs sidebar (`app/src/components/sidebar.tsx`)  
**Related docs:** [Sidebar](../../docs/features/sidebar.mdx), [Organize](../../docs/authoring/organize.mdx), [docs.json](../../docs/reference/docs-json.mdx)

## Verdict

**Yes — this is feasible** without changing the current “all pages remain in the navigation tree” model. Collapse only hides nested UI; it does not remove links from the sidebar config, search, previous/next, MCP, or `llms.txt`.

Recommended split:

1. **Publisher default** (site config) — choose whether nested sections start open or collapsed (except the active path).
2. **Reader controls** (optional UI) — Collapse all / Open all for the current session.

Ship (1) first; (2) is a small follow-up once nest open state is lifted out of per-node `useState`.

---

## Problem

Today, nested sidebar groups are collapsible, but:

- Inactive nested groups start **collapsed**.
- The active page’s ancestor groups start **expanded** and stay forced open while active.
- There is **no** publisher setting for “start with everything open” (or always collapsed except active).
- There is **no** reader control to expand or collapse every nested section at once.

Publishers with deep trees often want a shorter first view **or** a fully expanded “browse everything” default, while still keeping every page reachable in the same sidebar tree.

---

## Current behavior (baseline)

| Layer | Behavior |
| --- | --- |
| Top-level `sidebar` groups | Always visible (label + pages). **Not** collapsible. |
| Nested groups (objects inside `pages`) | Collapsible via Radix `Collapsible` in `SidebarCollapsibleNestedGroup`. |
| Initial open state | `useState(isActive)` — open only if the group or a descendant matches the current route. |
| Route change | `useEffect` forces `open = true` when `isActive` becomes true; leaving active does **not** force close. |
| Config | No expand-related fields on `content` or `SidebarGroup`. |
| Panel cookie `sidebar_state` | Desktop shell show/hide only — unrelated to nest sections. |

Source of truth for nest open state: local React state in `app/src/components/sidebar.tsx` (`SidebarCollapsibleNestedGroup`). Tree data comes from `docs.json` → `useSidebar()`; previous/next and other features already walk the full tree regardless of open UI state.

---

## Goals

- Keep the existing navigation model: every configured page stays in the tree and remains reachable.
- Let publishers set a **default expand mode** for nested groups.
- Optionally let readers **Collapse all** / **Open all** without changing `docs.json`.
- Preserve today’s rule: the active page’s ancestor groups are always expanded (or re-expanded on navigation).

## Non-goals

- Making top-level section headers collapsible (would change IA; out of scope unless requested separately).
- Persisting nest open state across sessions/devices (cookie/localStorage can be a later opt-in).
- Hiding pages from search, MCP, or sitemap when collapsed.
- Per-locale different expand modes (one site-wide default is enough for v1).

---

## Proposed config

Put the site default on **`content`**, same pattern as `automaticallyInferNextPrevious` / `showPageTitle`. Do **not** hang a sibling field on `sidebar` itself: `sidebar` is already a union of `SidebarGroup[] | Record<string, SidebarGroup[]>`, so `sidebar.defaultExpanded` would require a breaking wrapper shape.

### Site default

```json
{
  "content": {
    "sidebarExpand": "active"
  }
}
```

| Value | Meaning |
| --- | --- |
| `"active"` (default) | Current behavior: nested groups start open only if they contain the active page (or their own `href` is active). |
| `"all"` | All nested collapsible groups start open. Active-path forcing still applies on navigation. |

Optional later:

| Value | Meaning |
| --- | --- |
| `"collapsed"` | Alias clarity for `"active"` if we want explicit naming; not required for v1. |

### Optional per-group override

On nested `SidebarGroup` objects only:

```json
{
  "group": "API",
  "defaultOpen": true,
  "pages": []
}
```

Resolution order for initial `open`:

1. Group `defaultOpen` if set  
2. Else site `content.sidebarExpand === "all"` → `true`  
3. Else `isActive` (today’s rule)

### Reader toggle (UI, not config)

Controls in the sidebar chrome (near locale switcher / anchors):

- **Open all** — set every nested collapsible to open  
- **Collapse all** — set every nested collapsible to closed, then immediately re-open ancestors of the active page (so the current page never disappears from view)

Session-only for v1 (no persistence). Publisher default still applies on first paint / hard reload.

Suggested publisher gate so quiet sites stay clean:

```json
{
  "content": {
    "sidebarExpand": "active",
    "sidebarExpandControls": false
  }
}
```

Default `sidebarExpandControls` to `false`; enable when the site has enough nested depth that the controls help. Alternatively always show controls when any nested group exists — product call at implementation time.

---

## Implementation sketch

### Config / schema

1. Extend `app/src/server/config/models/content.ts` with:
   - `sidebarExpand: z.enum(["active", "all"]).catch("active")`
   - optional `sidebarExpandControls: z.boolean().catch(false)`
2. Optionally extend `SidebarGroup` in `models/sidebar.ts` with `defaultOpen?: boolean`.
3. `/schema.json` updates automatically via Zod → JSON Schema.
4. Document in `docs/reference/docs-json.mdx`, `docs/features/sidebar.mdx`, and `docs/authoring/organize.mdx`.

### Runtime UI

1. Read `bundle.config.content.sidebarExpand` in the docs sidebar.
2. Change `SidebarCollapsibleNestedGroup` init from `useState(props.isActive)` to the resolution order above.
3. Keep the existing `useEffect` that opens when `isActive` becomes true.
4. For Collapse all / Open all: introduce a small React context (or lift state in `Sidebar`) so nested groups subscribe to expand/collapse commands instead of isolated `useState` only.

Approximate surface area:

- `app/src/server/config/models/content.ts` (+ optional `sidebar.ts`)
- `app/src/components/sidebar.tsx` (init + context + controls)
- Product docs under `docs/`

No changes required to `packages/mdx-bundler`, CLI check of page existence, previous/next flattening, or agent exports — those already ignore nest open UI state.

### Accessibility

- Controls are real buttons with clear names (“Expand all nested sections” / “Collapse all nested sections”).
- Collapsible triggers already expose expand/collapse; bulk actions should not trap focus.
- After Collapse all, focus remains sensible (do not move focus into a now-hidden subtree).

---

## Compatibility

| Concern | Impact |
| --- | --- |
| Existing sites (no new keys) | Unchanged — `"active"` default matches today. |
| Flat sidebars (no nested groups) | No visible change; controls can hide when there is nothing to expand. |
| Locale-keyed `sidebar` | Unaffected; expand mode is site-wide under `content`. |
| Tabs | Unaffected; filtering still happens before render. |
| Mobile sheet vs desktop panel | Same nest tree and state; controls render in both. |
| Linked nested groups (#399 click-to-collapse) | Keep; bulk expand/collapse cooperates with the same `open` state. |

---

## Phased delivery

### Phase 1 — Publisher default only

- Add `content.sidebarExpand: "active" | "all"`.
- Wire initial open state + docs.
- **Risk:** low. One config field and a one-line init change (plus docs).

### Phase 2 — Reader Collapse all / Open all

- Lift nest open state (context or parent-owned map).
- Add controls; re-expand active ancestors after collapse-all.
- Optional `content.sidebarExpandControls`.
- **Risk:** moderate. Touches state ownership in `sidebar.tsx`; needs manual UI checks on deep trees and linked groups.

### Phase 3 (optional)

- Per-group `defaultOpen`.
- Persist reader preference in `localStorage` / cookie (separate from panel `sidebar_state`).

---

## Acceptance criteria

### Phase 1

- [ ] Omitting `content.sidebarExpand` matches today’s expand behavior.
- [ ] `"all"` opens every nested collapsible on first load for pages with and without an active match inside a given group.
- [ ] Navigating to a page under a manually collapsed group still expands that path.
- [ ] Top-level groups remain non-collapsible.
- [ ] `bun run check` passes; docs-json / sidebar docs updated.

### Phase 2

- [ ] Open all expands every nested collapsible currently rendered (active locale/tab).
- [ ] Collapse all collapses them, then leaves the active page’s ancestors open.
- [ ] Controls do not appear (or are no-ops) when the tree has no nested groups.
- [ ] Works in desktop sidebar and mobile sheet.

---

## Open questions for maintainers

1. Should Phase 2 controls always appear when nested groups exist, or only when `sidebarExpandControls: true`?
2. Is `"active" | "all"` enough, or do we want `"collapsed"` naming / per-group `defaultOpen` in v1?
3. Should “Open all” mean literally every nest, or “expand to match a fully browsable tree but keep inactive top-level visual density” (top-level already always open)?

---

## Summary

docs.page can support a publisher default of “all nested sections open” while keeping the current all-pages-viewable sidebar, and can add a reader Collapse all / Open all toggle by centralizing nest open state that already lives only in the client sidebar. The clean config home is `content.sidebarExpand`, not a new shape of `sidebar`. Phase 1 is a small, backward-compatible change; Phase 2 is the interactive toggle.
