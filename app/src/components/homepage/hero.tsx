import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";
import { Fragment, useState } from "react";
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
      {/* items-end, not items-stretch: the snippet column is taller than the
          button now that it carries a label row, so the two are aligned on the
          edge they share — the bottom of the button and the bottom of the chip.
          The chip's own padding gives it the button's height, so the boxes read
          as one row with the labels sitting above it.

          w-full below `sm` (where the row stacks) so the chip still spans the
          hero column and shrinks its snippet instead of pushing past the
          gutter; sm:w-auto puts the row back to content width. */}
      <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:items-end sm:gap-4">
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
    label: "For humans",
    prefix: "$",
    text: "npx @docs.page/cli init",
  },
  {
    id: "agent",
    label: "For agents",
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

  // A column of its own: the labels sit above the chip, and the chip alone
  // lines up with the Get started button beside it. Full width below `sm`
  // (where the CTA row stacks) and content width from `sm` up, as the chip
  // was before; min-w-0 lets the column shrink in the `sm` row rather than
  // widen it to fit the prompt.
  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-2 sm:w-auto sm:items-start">
      <div
        role="group"
        aria-label="Setup method"
        className="flex items-center gap-3 text-sm"
      >
        {SNIPPETS.map((snippet, index) => (
          <Fragment key={snippet.id}>
            {index > 0 && (
              <span aria-hidden className="h-3.5 w-px shrink-0 bg-border" />
            )}
            <button
              type="button"
              aria-pressed={snippet.id === active.id}
              onClick={() => setActiveId(snippet.id)}
              className={cn(
                "cursor-pointer transition-colors",
                snippet.id === active.id
                  ? "text-foreground"
                  : "font-light text-muted-foreground hover:text-foreground",
              )}
            >
              {snippet.label}
            </button>
          </Fragment>
        ))}
      </div>
      {/* The chip keeps its own `py-2.5` at every width — it used to be
          `sm:py-0` and take its height from the stretched CTA row, which it
          can no longer do now that the labels share its column. Around a
          `size="icon-sm"` copy button that comes out at the height of the
          Get started button beside it, which is what makes the two boxes read
          as one row; if either size changes, this padding has to follow.
          min-w-0 plus the snippet's own scroll area is what keeps the long
          agent prompt inside the chip. */}
      <div className="group flex w-full min-w-0 items-center gap-2 rounded-xl border border-primary bg-periwinkle-950 px-3 py-2.5 sm:w-auto sm:px-4">
        {/* Keyed by tab so the "copied" tick never carries over to the snippet
            the visitor has not copied. */}
        <Snippet key={active.id} snippet={active} />
      </div>
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
