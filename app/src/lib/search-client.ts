import type {
  SearchRow,
  SearchScope,
  SearchWorkerInMessage,
  SearchWorkerOutMessage,
} from "@/workers/search.worker";

type ResultCallback = (rows: SearchRow[]) => void;

let worker: Worker | null = null;
let currentUrl: string | null = null;
let workerReady = false;
const readyQueue: Array<() => void> = [];
const pending = new Map<number, ResultCallback>();
let requestCounter = 0;
let latestShownId = 0;

function ensureWorker(url: string): Worker | null {
  if (typeof window === "undefined") return null;

  if (worker && currentUrl === url) return worker;

  if (!worker) {
    const w = new Worker(
      new URL("../workers/search.worker.ts", import.meta.url),
      { type: "module" },
    );

    w.addEventListener(
      "message",
      (event: MessageEvent<SearchWorkerOutMessage>) => {
        const msg = event.data;
        if (msg.type === "ready") {
          workerReady = true;
          for (const fn of readyQueue.splice(0)) fn();
          return;
        }
        if (msg.type === "result") {
          const cb = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.id < latestShownId) return;
          latestShownId = msg.id;
          cb?.(msg.rows);
        }
      },
    );

    worker = w;
  }

  workerReady = false;
  readyQueue.length = 0;
  currentUrl = url;

  const init: SearchWorkerInMessage = { type: "init", url };
  worker.postMessage(init);

  return worker;
}

export function prewarmSearch(url: string): void {
  ensureWorker(url);
}

export function searchDocs(
  url: string,
  query: string,
  limit: number,
  onResult: ResultCallback,
  options?: { scope?: SearchScope },
): () => void {
  const w = ensureWorker(url);
  if (!w) {
    onResult([]);
    return () => {};
  }

  const id = ++requestCounter;
  pending.set(id, onResult);

  const send = () => {
    const msg: SearchWorkerInMessage = {
      type: "search",
      id,
      query,
      limit,
      scope: options?.scope,
    };
    w.postMessage(msg);
  };

  if (workerReady) send();
  else readyQueue.push(send);

  return () => {
    pending.delete(id);
  };
}

export function isSearchReady(): boolean {
  return workerReady;
}
