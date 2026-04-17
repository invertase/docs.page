/// <reference lib="webworker" />

import { Document } from "flexsearch";

export type SearchDoc = {
  path: string;
  title: string;
  content: string;
};

export type SearchRow = {
  path: string;
  title: string;
  titleHtml: string;
  snippetHtml: string;
};

export type SearchWorkerInMessage =
  | { type: "init"; url: string }
  | { type: "search"; id: number; query: string; limit: number };

export type SearchWorkerOutMessage =
  | { type: "ready" }
  | { type: "result"; id: number; rows: SearchRow[] };

const DOCUMENT_OPTIONS = {
  tokenize: "forward",
  encoder: "Normalize",
  document: {
    id: "path",
    index: [
      { field: "title", tokenize: "forward", encoder: "Normalize" },
      { field: "content", tokenize: "forward", encoder: "Normalize" },
    ],
  },
};

type FlexDocument = {
  add: (doc: SearchDoc) => void;
  search: (
    query: string,
    opts: { merge: boolean; limit: number },
  ) => Array<{
    id: string;
    field?: string[];
  }>;
};

let index: FlexDocument | null = null;
const docsByPath = new Map<string, SearchDoc>();

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.addEventListener("message", (event: MessageEvent<SearchWorkerInMessage>) => {
  const msg = event.data;

  if (msg.type === "init") {
    void initFromUrl(msg.url);
    return;
  }

  if (msg.type === "search") {
    if (!index) {
      post({ type: "result", id: msg.id, rows: [] });
      return;
    }

    const q = msg.query.trim();
    if (!q) {
      post({ type: "result", id: msg.id, rows: [] });
      return;
    }

    const raw = index.search(q, { merge: true, limit: msg.limit });

    const rows: SearchRow[] = [];
    const seen = new Set<string>();
    for (const hit of raw) {
      if (seen.has(hit.id)) continue;
      seen.add(hit.id);

      const doc = docsByPath.get(hit.id);
      if (!doc) continue;

      rows.push({
        path: doc.path,
        title: doc.title,
        titleHtml: highlightInline(doc.title, q),
        snippetHtml: buildSnippet(doc.content, q),
      });
    }

    post({ type: "result", id: msg.id, rows });
  }
});

async function initFromUrl(url: string) {
  try {
    const res = await fetch(url);
    const data = (await res.json()) as { documents?: SearchDoc[] };

    const instance = new (Document as unknown as new (
      options: unknown,
    ) => FlexDocument)(DOCUMENT_OPTIONS);

    docsByPath.clear();
    for (const doc of data.documents ?? []) {
      instance.add(doc);
      docsByPath.set(doc.path, doc);
    }
    index = instance;

    post({ type: "ready" });
  } catch (error) {
    console.error("[search.worker] init failed", error);
  }
}

function post(message: SearchWorkerOutMessage) {
  ctx.postMessage(message);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function highlightInline(text: string, query: string): string {
  if (!text) return "";
  const q = query.trim();
  if (!q) return escapeHtml(text);

  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return escapeHtml(text);

  const before = escapeHtml(text.slice(0, idx));
  const match = escapeHtml(text.slice(idx, idx + q.length));
  const after = escapeHtml(text.slice(idx + q.length));
  return `${before}<mark>${match}</mark>${after}`;
}

function buildSnippet(content: string, query: string, radius = 60): string {
  if (!content) return "";
  const q = query.trim();
  if (!q) return escapeHtml(content.slice(0, radius * 2));

  const lower = content.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());

  if (idx === -1) {
    return `${escapeHtml(content.slice(0, radius * 2))}…`;
  }

  const start = Math.max(0, idx - radius);
  const end = Math.min(content.length, idx + q.length + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  const before = escapeHtml(content.slice(start, idx));
  const match = escapeHtml(content.slice(idx, idx + q.length));
  const after = escapeHtml(content.slice(idx + q.length, end));

  return `${prefix}${before}<mark>${match}</mark>${after}${suffix}`;
}
