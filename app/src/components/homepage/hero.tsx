import {
  RiArrowRightSLine,
  RiCheckLine,
  RiFileCopyLine,
} from "@remixicon/react";
import Link from "next/link";
import { Fragment, useLayoutEffect, useRef, useState } from "react";
import { ChipLedRim } from "@/components/homepage/chip-led-rim/chip-led-rim";
import { Button } from "@/components/ui/button";
import { useCopy } from "@/hooks/use-copy";
import { SNIPPET_PARAM, type SnippetId } from "@/lib/prompt-copy";
import { cn } from "@/lib/utils";
import { UTM_KEYS } from "@/lib/utm";

export function Hero() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-8 overflow-visible px-2 pt-12 pb-32 sm:px-0 sm:pt-16 sm:pb-44">
      {/* Title block keeps the hero section rhythm (space-y-6 / sm:space-y-8).
          The two CTA-adjacent gaps — subtext → tabs, and chip → Get started —
          share `gap-8` so they stay equal at every width. */}
      <div className="flex flex-col items-center space-y-6 sm:space-y-8">
        <Eyebrow />
        <h1 className="flex flex-col items-center justify-center text-center font-heading text-4xl sm:text-5xl md:text-6xl">
          <span className="font-extralight">Docs for</span>
          <span>humans + agents</span>
        </h1>
        <p className="max-w-sm text-center text-sm font-light leading-relaxed text-neutral-400 sm:max-w-none sm:text-base">
          Instantly <span className="text-primary">serve markdown</span> from
          any GitHub branch as modern, agent-ready docs, with AI chat, MCP, and
          llms.txt.
        </p>
      </div>
      {/* One stacked, centred group: the snippet — its labels and the chip —
          on top, the primary action underneath, all three on the hero's axis.
          A single column at every width, so there is no `sm:flex-row` to undo
          the stack any more.

          gap-8 matches the hero stack's gap above this group, so the space
          under the subtext and the space above Get started stay the same.

          The chip hugs its command (`inline-flex w-max`); this group is
          `w-auto` so a full-column stretch size never becomes the chip’s
          available width. */}
      <div className="mx-auto flex w-auto max-w-full flex-col items-center gap-8 overflow-visible">
        <Terminal />
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

type HeroSnippet = {
  readonly id: SnippetId;
  readonly label: string;
  readonly prefix: string | null;
  readonly text: string;
};

/**
 * The two ways to start docs.page: run the CLI, or hand the setup prompt to a
 * coding agent. `prefix` is the shell prompt marker — the agent snippet is
 * prose to paste into an agent, not a command to run.
 *
 * The ids are typed against the shared union rather than inferred from here:
 * the copy beacon puts one on the URL and the route validates against the same
 * closed set, so a tab id neither side knows about will not compile.
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
] as const satisfies readonly HeroSnippet[];

const HUMANS_SNIPPET =
  SNIPPETS.find((snippet) => snippet.id === "terminal") ?? SNIPPETS[0];

const SNIPPET_LINE =
  "flex w-max items-center gap-2 whitespace-nowrap leading-6 text-sm sm:text-base";

/**
 * Per-glyph delay so a tab swap stays in the ~500ms cadence.
 * Short humans land slower (readable); long agents hit the floor so they
 * finish in the same ballpark instead of crawling.
 */
const TYPE_TARGET_MS = 520;
const TYPE_MIN_MS = 6;
const TYPE_MAX_MS = 28;
const TYPE_CLEAR_MS = 70;

function typeCharIntervalMs(length: number) {
  const n = Math.max(length, 1);
  return Math.min(
    TYPE_MAX_MS,
    Math.max(TYPE_MIN_MS, Math.round(TYPE_TARGET_MS / n)),
  );
}

const PROMPT_COPY_ENDPOINT = "/api/track/prompt-copy";

/**
 * Tell the server which snippet was copied.
 *
 * A clipboard copy never reaches the server, and the homepage is cookieless
 * (no posthog-js), so a beacon the server turns into a capture is the only way
 * to count one. Fire-and-forget in every sense: no body, no response handling,
 * and any failure — offline, blocked by an extension, sendBeacon missing — is
 * swallowed, because analytics must never break the copy the visitor asked for.
 */
function trackPromptCopy(snippet: SnippetId) {
  try {
    const url = promptCopyUrl(snippet);
    if (navigator.sendBeacon?.(url)) return;
    void fetch(url, {
      method: "POST",
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Best-effort only; the copy itself has already happened.
  }
}

/**
 * Everything the beacon carries goes in the URL: `sendBeacon`, called with one
 * argument, sends no body, and the fetch fallback deliberately matches it.
 *
 * That is the snippet id, plus whichever utm params the page itself was loaded
 * with — the route reads utm off the request URL it is handed, so forwarding
 * them here is what makes a copy attributable to a campaign at all.
 */
function promptCopyUrl(snippet: SnippetId) {
  const params = new URLSearchParams({ [SNIPPET_PARAM]: snippet });
  const pageParams = new URLSearchParams(window.location.search);

  for (const key of UTM_KEYS) {
    const value = pageParams.get(key);
    if (value) params.set(key, value);
  }

  return `${PROMPT_COPY_ENDPOINT}?${params.toString()}`;
}

function Terminal() {
  const [activeId, setActiveId] = useState<SnippetId>("terminal");
  const active =
    SNIPPETS.find((snippet) => snippet.id === activeId) ?? SNIPPETS[0];

  // The labels and the chip are one column, centred at every width.
  // `w-auto` — not `w-full` — so the chip’s max-content hug is not computed
  // against the hero column (that is what made `w-fit` grow with the page).
  return (
    <div className="flex w-auto max-w-full flex-col items-center gap-2 overflow-visible">
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
                "cursor-pointer transition-colors duration-500 ease-in-out motion-reduce:transition-none",
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
      {/* Chip stays mounted across tabs so the LED rim does not restart.
          Copied tick resets when the text changes. */}
      <Chip snippet={active} />
    </div>
  );
}

/**
 * The chip owns both the LED rim and `useCopy` so periwinkle tracks the 2s
 * copied tick in the same render — no parent callback / effect cleanup that
 * can drop the rim back to honey between pointerup and click.
 */
function Chip({ snippet }: { snippet: HeroSnippet }) {
  const { copied, copy } = useCopy(snippet.text);
  const snippetRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [fillDimmed, setFillDimmed] = useState(false);
  const [typedPrefix, setTypedPrefix] = useState<string | null>(snippet.prefix);
  const [typedText, setTypedText] = useState(snippet.text);
  const [typing, setTyping] = useState(false);
  const typedTab = useRef<SnippetId | null>(null);
  const typeGen = useRef(0);

  useLayoutEffect(() => {
    const node = snippetRef.current;
    if (!node) return;
    node.scrollLeft = 0;
    // `typedText` is read so this re-runs as glyphs land. ResizeObserver
    // only sees the scrollport box, which stays the same width.
    const update = () => {
      setOverflowing(
        typedText.length > 0 && node.scrollWidth - node.clientWidth > 1,
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [typedText]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const firstPaint = typedTab.current === null;
    const sameTab = typedTab.current === snippet.id;
    typedTab.current = snippet.id;

    // First mount (and React Strict remounts of the same tab) show the full
    // command. Type-in is only for an actual humans ↔ agents change.
    if (firstPaint || sameTab || reduced) {
      setTypedPrefix(snippet.prefix);
      setTypedText(snippet.text);
      setTyping(false);
      if (reduced) setFillDimmed(false);
      return;
    }

    const gen = ++typeGen.current;
    setFillDimmed(true);
    setTyping(true);
    setTypedPrefix(null);
    setTypedText("");

    const stepMs = typeCharIntervalMs(snippet.text.length);
    let i = 0;
    let tick: ReturnType<typeof setInterval> | undefined;
    const start = window.setTimeout(() => {
      if (typeGen.current !== gen) return;
      if (snippet.prefix) setTypedPrefix(snippet.prefix);
      tick = window.setInterval(() => {
        if (typeGen.current !== gen) return;
        i += 1;
        setTypedText(snippet.text.slice(0, i));
        if (i >= snippet.text.length) {
          if (tick !== undefined) window.clearInterval(tick);
          setTyping(false);
          setFillDimmed(false);
        }
      }, stepMs);
    }, TYPE_CLEAR_MS);

    return () => {
      window.clearTimeout(start);
      if (tick !== undefined) window.clearInterval(tick);
    };
  }, [snippet.id, snippet.prefix, snippet.text]);
  // Pointerdown copies so the 2s tick starts on press (404 hold analogue, and
  // pointer-only automation that never synthesizes `click`). Click still
  // covers keyboard activation. The latch keeps the beacon to one fire.
  const copyLatch = useRef(false);

  const handleCopy = () => {
    if (copyLatch.current) return;
    copyLatch.current = true;
    window.setTimeout(() => {
      copyLatch.current = false;
    }, 400);
    copy();
    // Both tabs are tracked, because a copy makes no request of its own and so
    // is invisible otherwise — there is no funnel an untracked one shows up in.
    // The snippet id on the beacon is what tells the two apart.
    trackPromptCopy(snippet.id);
  };

  const rimActive = snippet.id === "agent";

  return (
    <div
      className="group relative mx-auto inline-flex w-max max-w-full overflow-visible items-center justify-start gap-2 rounded-xl border border-transparent bg-periwinkle-950 px-3 py-2.5 sm:px-4"
      data-chip-rim={rimActive ? "periwinkle" : "honey"}
    >
      {/* Honey on For humans, periwinkle on For agents. Copy tick is UI-only. */}
      <ChipLedRim active={rimActive} />
      {/* Interior fill dip bookends the type-in. Behind the snippet, inside
          the pill — the page and LED rim stay put. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[1] rounded-[inherit] bg-black/25 motion-reduce:hidden",
          "transition-opacity duration-250 ease-in-out",
          fillDimmed ? "opacity-100" : "opacity-0",
        )}
      />
      {/* Invisible humans command + icon spacer. This is the only in-flow
          content, so both tabs hug this width and never grow with the page. */}
      <div className="invisible flex items-center gap-2" aria-hidden>
        <SnippetLine snippet={HUMANS_SNIPPET} />
        <span className="size-7 shrink-0" />
      </div>
      <div className="absolute inset-0 z-10 flex items-center gap-2 px-3 py-2.5 sm:px-4">
        <div
          ref={snippetRef}
          role="group"
          aria-label={
            snippet.prefix ? `${snippet.prefix} ${snippet.text}` : snippet.text
          }
          className={cn(
            "min-h-6 min-w-0 flex-1 overflow-x-auto overscroll-x-contain touch-pan-x opacity-75 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            overflowing &&
              "[mask-image:linear-gradient(to_right,black_0%,black_calc(100%-1.25rem),transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,black_calc(100%-1.25rem),transparent_100%)]",
          )}
        >
          <SnippetLine
            snippet={{ ...snippet, prefix: typedPrefix, text: typedText }}
            prefixClassName="text-neutral-500"
            textClassName="text-neutral-200"
            caret={typing}
          />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          onClick={handleCopy}
          onPointerDown={(event) => {
            if (!event.isPrimary) return;
            handleCopy();
          }}
        >
          {copied ? (
            <RiCheckLine className="text-green-500" />
          ) : (
            <RiFileCopyLine />
          )}
        </Button>
      </div>
    </div>
  );
}

function SnippetLine({
  snippet,
  prefixClassName,
  textClassName,
  caret = false,
}: {
  snippet: HeroSnippet;
  prefixClassName?: string;
  textClassName?: string;
  caret?: boolean;
}) {
  return (
    <div className={SNIPPET_LINE}>
      {snippet.prefix ? (
        <span className={cn("shrink-0", prefixClassName)}>
          {snippet.prefix}
        </span>
      ) : null}
      <span className={textClassName}>{snippet.text}</span>
      {caret ? (
        <span
          aria-hidden
          className="chip-caret ml-px inline-block h-[0.85em] w-px shrink-0 translate-y-px bg-neutral-200/70 motion-reduce:hidden"
        />
      ) : null}
    </div>
  );
}
