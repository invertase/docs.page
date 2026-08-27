import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center space-y-6 px-2 pt-12 pb-32 sm:space-y-8 sm:px-0 sm:pt-16 sm:pb-44">
      <Eyebrow />
      <h1 className="flex flex-col items-center justify-center text-center font-heading text-4xl sm:text-5xl md:text-6xl">
        <span className="font-extralight">Docs for</span>
        <span>humans + agents</span>
      </h1>
      <p className="max-w-sm text-center text-sm font-light leading-relaxed text-neutral-400 sm:max-w-none sm:text-base">
        Instantly <span className="text-primary">serve markdown</span> from any
        GitHub branch as modern, agent-ready docs, with AI chat, MCP, and
        llms.txt.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-stretch sm:gap-4">
        <Button
          asChild
          size="lg"
          className="group rounded-full px-6 py-6 text-lg"
        >
          {/* prefetch off: the tracked redirect must not be requested on page view.
              nofollow: a hint to keep crawlers from following the CTA and
              inflating clicks — best-effort, not a guarantee. */}
          <Link href="/get-started" prefetch={false} rel="nofollow">
            <span>Get started</span>
            <RiArrowRightSLine className="size-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        <Terminal />
      </div>
    </div>
  );
}

function Eyebrow() {
  return (
    <div className="group relative">
      <div
        className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-periwinkle-500/10 opacity-0 blur-sm transition-opacity group-hover:opacity-100"
        aria-hidden
      />
      <div className="border rounded-full px-4 py-2 bg-periwinkle-950 text-sm hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
        Free and open-source
      </div>
    </div>
  );
}

/**
 * The two ways to start docs.page: run the CLI, or hand the setup prompt to a
 * coding agent. `prefix` is the shell prompt marker — the agent snippet is
 * prose to paste into an agent, not a command to run.
 */
const SNIPPETS = [
  {
    id: "terminal",
    label: "Terminal",
    prefix: "$",
    text: "npx @docs.page/cli init",
  },
  {
    id: "agent",
    label: "Agent",
    prefix: null,
    text: "Read https://use.docs.page/quickstart.md and set up docs.page in this repository.",
  },
] as const;

type SnippetId = (typeof SNIPPETS)[number]["id"];

const PROMPT_COPY_ENDPOINT = "/api/track/prompt-copy";

/**
 * Tell the server the agent prompt was copied.
 *
 * A clipboard copy never reaches the server, and the homepage is cookieless
 * (no posthog-js), so a beacon the server turns into a capture is the only way
 * to count one. Fire-and-forget in every sense: no body, no response handling,
 * and any failure — offline, blocked by an extension, sendBeacon missing — is
 * swallowed, because analytics must never break the copy the visitor asked for.
 */
function trackPromptCopy() {
  try {
    if (navigator.sendBeacon?.(PROMPT_COPY_ENDPOINT)) return;
    void fetch(PROMPT_COPY_ENDPOINT, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Best-effort only; the copy itself has already happened.
  }
}

function Terminal() {
  const [activeId, setActiveId] = useState<SnippetId>("terminal");
  const active =
    SNIPPETS.find((snippet) => snippet.id === activeId) ?? SNIPPETS[0];

  // min-w-0 plus wrapping is what keeps the long agent prompt inside the chip:
  // it scrolls in its own container instead of stretching the CTA row. Below
  // `sm` the tabs take a line of their own so the snippet keeps the full width;
  // from `sm` up everything sits on one line, as before.
  return (
    <div className="group flex w-full min-w-0 flex-wrap items-center gap-2 rounded-xl border border-primary bg-periwinkle-950 px-3 py-2.5 sm:w-auto sm:flex-nowrap sm:px-4 sm:py-0">
      <div
        role="group"
        aria-label="Setup method"
        className="flex shrink-0 basis-full items-center gap-1 sm:basis-auto"
      >
        {SNIPPETS.map((snippet) => (
          <Button
            key={snippet.id}
            variant={snippet.id === active.id ? "outline" : "ghost"}
            size="xs"
            aria-pressed={snippet.id === active.id}
            onClick={() => setActiveId(snippet.id)}
            className={cn(
              "rounded-full font-light",
              snippet.id === active.id &&
                "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/10",
            )}
          >
            {snippet.label}
          </Button>
        ))}
      </div>
      {/* Keyed by tab so the "copied" tick never carries over to the snippet
          the visitor has not copied. */}
      <Snippet key={active.id} snippet={active} />
    </div>
  );
}

/** The snippet text and its copy button — one flex line inside the chip. */
function Snippet({ snippet }: { snippet: (typeof SNIPPETS)[number] }) {
  // useCopy takes the text as an argument, so the button copies whatever this
  // tab is showing with no extra plumbing.
  const { copied, copy } = useCopy(snippet.text);

  const handleCopy = () => {
    copy();
    // Only the agent prompt is tracked: CLI copies already show up in the
    // /get-started funnel, and one shared event would conflate the two.
    if (snippet.id === "agent") trackPromptCopy();
  };

  return (
    <>
      <div className="flex min-w-0 max-w-64 flex-1 items-center gap-2 overflow-x-auto opacity-75 transition-opacity group-hover:opacity-100 sm:max-w-72 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {snippet.prefix && (
          <span className="shrink-0 text-neutral-500">{snippet.prefix}</span>
        )}
        <span className="whitespace-nowrap text-sm text-neutral-200 sm:text-base">
          {snippet.text}
        </span>
      </div>
      <Button variant="ghost" size="icon-sm" onClick={handleCopy}>
        {copied ? (
          <RiCheckLine className="text-green-500" />
        ) : (
          <RiFileCopyLine />
        )}
      </Button>
    </>
  );
}
