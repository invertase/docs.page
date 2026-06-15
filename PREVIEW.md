# Preview Mode — Spec & Implementation Plan

Local, live-reloading preview of a docs.page site. A user runs the CLI in the
root of their docs project; the CLI watches the filesystem and streams content
over a WebSocket to the hosted `/preview` page, which renders it with the real
`Docs` UI.

```
┌──────────────────────────┐         ws://localhost:PORT        ┌───────────────────────────────┐
│  CLI  (packages/cli)      │ ◄──────────────────────────────► │  Browser  (/preview page)      │
│  - validates project      │   ping {path}                     │  - PreviewClient (ssr:false)   │
│  - chokidar file watch    │   response {config, docIr, ...}   │  - DocPageContext + <Docs/>    │
│  - Bun.serve WebSocket    │                                   │  - live reload on each msg     │
└──────────────────────────┘                                   └───────────────────────────────┘
```

---

## 1. Goals & Non-Goals

### Goals
- `npx @docs.page/cli preview` from a docs root starts a live preview with zero config.
- Validate the project up front (`docs.json`/`docs.yaml` + `docs/` with ≥1 `.mdx`).
- Live reload on changes to config and any `.mdx` under `docs/`.
- URL `/preview/foo` maps to `docs/foo.mdx` or `docs/foo/index.mdx`.
- Reuse the production rendering UI (`Docs`, `DocsIrRenderer`, sidebar, ToC, MDX components) so preview is pixel-identical to production.
- Work fully offline / on the user's machine (no GitHub round-trip; content comes from disk).

### Non-Goals (v1)
- Authentication / private repos (preview is local files only).
- Search index, sitemap, robots, llms.txt, OG images, agent panel.
- Hot module reload of the app itself (we reload data, not the React tree).
- Multi-tenant or remote preview hosting.

---

## 2. Architecture — A shared `mdx-bundler` package owns the docs-ir pipeline

**Decision: extract the markdown → docIr transform into a shared workspace
package, `packages/mdx-bundler`, consumed by both `app` and `cli`.** The CLI
builds the `docIr` locally and streams it over the WebSocket; the app's
`Bundler.build()` calls the same code so prod and preview can never drift.

Today the pipeline lives inside `app` and runs **server-side** during the
GitHub-backed bundle:

```
app/src/server/docs/bundler/index.ts  →  Bundler.build()
  frontmatter(markdown)
  replaceMoustacheVariables(config.variables, content)   // app/src/server/docs/variables.ts
  extractHeadingNodes(markdown, { tocMaxDepth })          // app/src/lib/docs-markdown.ts
  mdxToDocIr(markdown)                                    // app/src/lib/docs-ir/from-mdx.ts
  highlightCodeBlocksInIr(docIr)                          // app/src/lib/docs-ir/highlight-code-blocks.ts
  → { markdown, docIr, headings, frontmatter, config }   // BundlerOutput
```

The browser `PreviewClient` already expects a **fully-built `docIr`** in
`response.bundle.docIr` (`preview-client.tsx`), and `<Prose>` renders
`bundle.docIr` directly via `DocsIrRenderer`. The transform is **pure and
environment-agnostic** — it depends only on `unified` / `remark-*` / `rehype-*` /
`shiki`, all of which run fine under Node and Bun, and needs no DOM, GitHub,
Redis, or app-only globals. That makes it safe to lift wholesale into a package.

### Package layout

```
packages/mdx-bundler/src/
  index.ts                  // renderDoc(markdown, opts) → { markdown, docIr, headings, frontmatter }
  docs-ir/
    types.ts                // moved from app/src/lib/docs-ir/types.ts
    from-mdx.ts             //   "
    highlight-code-blocks.ts//   "
    sanitize-html.ts        //   "
    visit.ts                //   "
  markdown/
    headings.ts             // extractHeadingNodes (from app/src/lib/docs-markdown.ts)
  variables.ts              // replaceMoustacheVariables (from app/src/server/docs/variables.ts)
```

### Why this approach
- Preview is fully local: instant, offline, no load on production. (A server-route
  alternative would round-trip every save to the hosted app — the `/preview` page
  points at the Railway deployment via `getApiBase()` — adding latency, requiring
  internet, and putting dev-loop load on prod.)
- The `docIr` contract (already baked into `PreviewClient`) is produced by *one*
  implementation shared by prod + preview — no divergence.
- Naturally enables future CLI features (`docs validate`, `docs build`).

### Cost / trade-offs to manage
- Mechanical refactor: move ~7 files, repoint `@/lib/docs-ir/*` imports in `app`,
  add the package to the workspace + CLI bundle.
- `shiki` (bundled languages) ships inside the CLI bundle → larger CLI artifact
  and first-highlight latency. Acceptable for a dev tool; lazy-load if needed.

> Scope control for the move: `renderDoc()` takes a minimal options object
> `{ variables?: Record<string, unknown>; headerDepth?: number }` rather than the
> full `Config`. This avoids dragging the entire config schema
> (`app/src/server/config/*`) into the package in v1. The browser already parses
> the raw config itself (`parsePreviewConfig` in `preview-client.tsx`), and the
> CLI only needs `variables` + `content.headerDepth` from it. Moving the full
> config schema into the package is a clean follow-up if `docs validate` lands.

---

## 3. Shared package API

```ts
// packages/mdx-bundler/src/index.ts
export type RenderDocOptions = {
  variables?: Record<string, unknown>;
  headerDepth?: number; // default 3, used for ToC max depth
};

export type RenderDocResult = {
  markdown: string;                       // variable-substituted, frontmatter stripped
  docIr: DocIrNode;                       // parsed + highlighted
  headings: HeadingNode[];
  frontmatter: Record<string, unknown>;
};

export async function renderDoc(
  rawMarkdown: string,
  options?: RenderDocOptions,
): Promise<RenderDocResult>;

export type { DocIrNode } from "./docs-ir/types";
export type { HeadingNode } from "./markdown/headings";
```

Internally `renderDoc` is exactly the body of `Bundler.build()`'s `try` block
(lines ~134–161 of `bundler/index.ts`), minus the GitHub/source plumbing.

### App refactor
- `app/src/lib/docs-ir/*` and `app/src/lib/docs-markdown.ts` (heading parts) and
  `app/src/server/docs/variables.ts` re-export from `@docs.page/mdx-bundler` (or
  are deleted and imports repointed). Keep thin re-export shims first to minimize
  churn, then migrate imports in a follow-up.
- `Bundler.build()` calls `renderDoc(this.#markdown, { variables, headerDepth })`.

---

## 4. CLI: `docs preview`

The implementation already exists, fully commented-out, in
`packages/cli/src/commands/preview.ts`. The plan is to **uncomment, wire to the
shared package, and add validation**. Re-register it in `packages/cli/src/cli.ts`.

### 4.1 Startup sequence
1. Resolve `rootDir = process.cwd()`.
2. **Validate** (fail fast with a friendly message):
   - `docs.json` **or** `docs.yaml` exists at root.
   - `docs/` exists and is a directory.
   - `docs/` contains ≥1 `.mdx` file (recursive).
3. Start `Bun.serve` WebSocket on `--port` (default `0` = random free port).
4. Build the browser URL: `${apiBase}/preview?url=ws://localhost:PORT`
   (`apiBase` from the global `--api-url`, default Railway prod; overridable via
   `DOCS_PAGE_API_BASE` for local app dev).
5. Print URLs; open the browser unless `--no-browser`.
6. Start chokidar watcher; handle `SIGINT`/`SIGTERM` for clean shutdown.

### 4.2 Options
| Flag | Default | Description |
|------|---------|-------------|
| `--port <number>` | random | Port for the local WS server |
| `--no-browser` | (opens) | Don't auto-open the preview URL |
| `--api-url <url>` (global) | prod | Host serving the `/preview` page |

### 4.3 Path → file resolution
Mirror production resolution exactly:
- `/` or `index` → `docs/index.mdx`
- `/foo` → `docs/foo.mdx`, else `docs/foo/index.mdx`
- Trailing/leading slashes normalized; `index` collapses to root.

(Existing `normalizeDocPath` / `getDocCandidates` helpers cover this.)

### 4.4 Per-request snapshot → response
On connect, on `ping`, and on file change, the server:
1. Reads the requested doc file + config from disk (`readPreviewSnapshot`).
2. Calls `renderDoc(markdown, { variables, headerDepth })` from the shared package.
3. Emits a `response` event (see protocol below) with `config`, `markdown`,
   `bundle` (`docIr`, `headings`, `frontmatter`), `candidates`, and `error`.
4. On render failure, emits `error` + `errorDetails` (serialized stack) instead
   of throwing — the client renders `PreviewErrorCard`.

> Note: the current commented `buildPreviewBundle` only computes `markdown` +
> `frontmatter` and **omits `docIr`/`headings`**. This must be replaced by
> `renderDoc()` so the payload matches what `PreviewClient` consumes
> (`response.bundle.docIr`, `response.bundle.headings`).

### 4.5 File watching
- `chokidar.watch(["docs.json", "docs.yaml", "docs/**/*.mdx"], { cwd: rootDir, ignoreInitial: true })`.
- Debounce ~300–500ms; collect `changedPaths`; broadcast a fresh `response` to
  every connected client for its current `docPath`.
- Config changes re-broadcast to all clients (affects every page).

---

## 5. WebSocket protocol

### Client → Server
```ts
{ type: "ping"; path?: string | null }   // sent on open and on every navigation
```

### Server → Client
```ts
{
  type: "response";
  revision: number;                 // monotonically increasing
  pathname: string;                 // resolved doc pathname, e.g. "/foo"
  filePath: string | null;          // resolved disk file, e.g. "docs/foo.mdx"
  changedPaths?: string[];          // what triggered this push (watch events)
  config: { json: string | null; yaml: string | null };
  markdown: string | null;
  bundle: {
    markdown?: string;
    docIr?: DocIrNode;
    frontmatter: Record<string, unknown>;
    headings: HeadingNode[];
  } | null;
  candidates: string[];             // files tried when not found
  error: string | null;
  errorDetails: { name; message; stack; raw } | null;
  rootDir: string;
  at: string;                       // ISO timestamp
}
```

This is already the exact shape `PreviewClient` parses (`PreviewSocketResponse`).
The only required change vs. the stub: populate `bundle.docIr` + `bundle.headings`.

---

## 6. Browser: `/preview` page

Mostly built. `app/src/pages/preview/[[...path]].tsx` lazy-loads
`PreviewClient` with `ssr:false`. `preview-client.tsx`:
- Reads `?url=` for the WS endpoint; normalizes `http(s)`→`ws(s)`.
- Connects, sends `ping` with the current preview path, listens for `response`.
- Maps `/preview/foo` → docPath `foo` and re-pings on navigation.
- Builds a synthetic `DocPageProps` (owner `local`, ref `preview`, `requestMode:
  "preview"`) and renders `<DocPageContext.Provider><Docs/><Preset/></...>`.
- Shows connecting / missing-url / invalid-url empty states and a rich
  `PreviewErrorCard` for render/connection errors.

### Remaining client work
- **Live reload UX**: `revision` already forces re-render via `setResponse`.
  Verify ToC/sidebar/code components re-mount cleanly on each push; add a subtle
  "updated" indicator (optional).
- **Verify `requestMode: "preview"`** is handled everywhere `Docs` reads the
  route (links, edit-on-GitHub, agent panel disabled, canonical URLs). Audit
  components that branch on `route.requestMode` / `owner`.
- **CORS / private network**: the page is hosted (https) but talks to
  `ws://localhost` — the server sets permissive CORS + `Access-Control-Allow-
  Private-Network`. Confirm browsers permit the WS upgrade from an https origin
  to a local ws (may need `wss` or a localhost exception; document the caveat).

---

## 7. Error handling

| Condition | Where | Behavior |
|-----------|-------|----------|
| No `docs.json`/`docs.yaml` | CLI startup | Exit 1 with message |
| No `docs/` or no `.mdx` | CLI startup | Exit 1 with message |
| Requested page missing | server snapshot | `error` + `candidates`; client shows `PreviewErrorCard` with tried files |
| MDX render throws | `renderDoc` in server | `error` + serialized `errorDetails.stack`; client shows trace |
| WS cannot connect | client | `socketError` → connection `PreviewErrorCard` |
| Invalid `?url=` | client | Invalid-url empty state |

---

## 8. Implementation phases

### Phase 1 — Shared package
1. Scaffold `packages/mdx-bundler` (package.json, tsconfig, `type: module`).
2. Move `docs-ir/{types,from-mdx,highlight-code-blocks,sanitize-html,visit}.ts`,
   the heading extractor, and `replaceMoustacheVariables` into it.
3. Implement `renderDoc()`; add unit tests (port `from-mdx.test.ts`,
   `sanitize-html.test.ts`).
4. Repoint `app` imports (or add re-export shims); refactor `Bundler.build()` to
   use `renderDoc()`. Confirm app builds + existing bundle behavior unchanged.

### Phase 2 — CLI preview command
5. Add `@docs.page/mdx-bundler` as a CLI dependency.
6. Uncomment `preview.ts`; replace `buildPreviewBundle` with `renderDoc()` so the
   payload includes `docIr` + `headings`.
7. Add project validation (config + `docs/` + ≥1 `.mdx`).
8. Re-register `registerPreviewCommand` in `cli.ts`.
9. Verify the CLI bundles (esbuild/`bun build`) with shiki included.

### Phase 3 — Browser polish
10. Audit `requestMode: "preview"` handling across `Docs` subtree.
11. Verify live reload re-render correctness; optional "updated" indicator.
12. Document the https→ws localhost connectivity caveat; consider a localhost
    `wss` story if browsers block it.

### Phase 4 — QA
13. E2E: run `docs init` then `docs preview`; edit config + pages; confirm live
    updates, path mapping, and error states.

---

## 9. Open questions
- **https → ws://localhost**: will target browsers allow the WS upgrade from the
  hosted https `/preview` origin to a plaintext local socket? If not, we need a
  local `wss` cert story or a localhost-served preview page. (Highest-risk item —
  validate first with a spike.)
- **Config schema follow-up**: v1 keeps `parseConfig` in `app` and the package
  takes only `{ variables, headerDepth }` (decided). Open: when do we promote the
  full config schema into a shared package to unblock `docs validate`?
- **Shiki bundle size** in the CLI artifact — acceptable, or lazy-load languages
  on demand?
- **Asset references** (`<Image src="/img.png">`): do local `public/`-style
  assets need to be served by the CLI's `Bun.serve`, or are preview images
  expected to be absolute URLs in v1?
