"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

const SUGGESTED_QUESTIONS = [
  "How do I setup docs.page?",
  "Is it free to use?",
  "How do I customize the theme?",
  "How is docs.page agent ready?",
  "What is the difference between docs.page and Mintlify?",
];

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <title>Sparkles</title>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <title>Send</title>
      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <title>Close</title>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <title>Chevron</title>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function AgentChatWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      <div
        ref={panelRef}
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border bg-neutral-950 shadow-2xl shadow-black/40",
          "w-[22rem] transition-all duration-300 ease-in-out origin-bottom-right",
          open
            ? "scale-100 opacity-100 pointer-events-auto"
            : "scale-95 opacity-0 pointer-events-none",
        )}
        style={{ maxHeight: "min(32rem, calc(100vh - 7rem))" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-honey-500" />
            <span className="text-sm font-medium text-white">Agent</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggle}
              className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close agent chat"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
            <ChevronIcon className="h-4 w-4 text-neutral-500" />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-5">
          <div className="mt-auto flex flex-col gap-1.5">
            <p className="mb-3 text-xs text-neutral-500">
              Tip: You can open and close chat with{" "}
              <kbd className="rounded border border-border/60 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                Ctrl
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-border/60 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">
                i
              </kbd>
            </p>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                type="button"
                key={q}
                className="text-left text-sm font-light text-honey-500 transition-colors hover:text-honey-400"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-border/50 px-3 py-3">
          <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-white/[0.03] px-3 py-2">
            <input
              type="text"
              placeholder="Ask a question..."
              className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 focus:outline-none"
              readOnly
            />
            <button
              type="button"
              className="shrink-0 rounded-full bg-honey-500 p-1.5 text-neutral-950 transition-colors hover:bg-honey-400"
              aria-label="Send message"
            >
              <SendIcon className="h-3 w-3" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-neutral-600">
            Shift + Enter for new line
          </p>
        </div>
      </div>

      {/* FAB button */}
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-300",
          "bg-honey-500 text-neutral-950 hover:bg-honey-400 hover:shadow-xl",
          "ring-1 ring-white/10",
          open && "rotate-0",
        )}
        aria-label={open ? "Close agent chat" : "Open agent chat"}
      >
        {open ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <SparklesIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
