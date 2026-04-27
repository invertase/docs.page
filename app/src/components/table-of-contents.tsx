import { RiListIndefinite } from "@remixicon/react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useDocTabs } from "@/hooks/use-doc-tabs";
import {
  docsContentTopPaddingClassName,
  docsStickyOffsetClassName,
} from "@/lib/docs-layout";
import { cn } from "@/lib/utils";

/**
 * Anchor offset fallback when the header is not in the DOM. Prefer the measured
 * `#docs-app-header` height; must stay aligned with `scroll-mt-[var(--docs-header-h,…)]`
 * on mdx/Heading and `--docs-header-h` in `docs-sticky-metrics`.
 */
const LEGACY_ANCHOR_OFFSET_PX = 96;

function getHeaderOffsetPx(): number {
  const el = document.getElementById("docs-app-header");
  if (el) {
    return el.getBoundingClientRect().height;
  }
  return LEGACY_ANCHOR_OFFSET_PX;
}

/**
 * Returns the y-coordinate (from viewport top) of the "current section" line: the bottom
 * of the fixed docs header, so the TOC only advances after the next heading’s top has
 * crossed the real header chrome (not 96px, which is below the full header when tabs are on).
 */
function getScrollSpyLinePx(): number {
  const el = document.getElementById("docs-app-header");
  if (el) {
    return el.getBoundingClientRect().bottom;
  }
  return getHeaderOffsetPx();
}

export function TableOfContents() {
  const [activeId, setActiveId] = useState("");
  const { bundle } = useDocPageContext();
  const hasHeaderTabs = useDocTabs().length > 0;
  const headings = bundle.headings.filter((heading) => heading.includeInToc);
  const headingIdSet = useMemo(
    () => new Set(headings.map((h) => h.id)),
    [headings],
  );
  const postClickLockUntil = useRef(0);
  const CLICK_SPY_LOCK_MS = 500;

  const scrollToHeading = useCallback((id: string) => {
    const run = (attempt: number) => {
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - getHeaderOffsetPx();
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        return;
      }
      if (attempt < 20) {
        window.setTimeout(() => run(attempt + 1), 40);
      }
    };
    run(0);
  }, []);

  const onTocLinkClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault();
      postClickLockUntil.current = Date.now() + CLICK_SPY_LOCK_MS;
      setActiveId(id);
      scrollToHeading(id);
      const { pathname, search } = window.location;
      window.history.pushState(null, "", `${pathname}${search}#${id}`);
    },
    [scrollToHeading],
  );

  // URL hash: sync highlight for deep links and browser back/forward (pushState from TOC does not fire hashchange).
  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !headingIdSet.has(id)) {
        return;
      }
      setActiveId(id);
      postClickLockUntil.current = Date.now() + CLICK_SPY_LOCK_MS;
      requestAnimationFrame(() => scrollToHeading(id));
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [headingIdSet, scrollToHeading]);

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id || !headingIdSet.has(id)) {
      return;
    }
    setActiveId(id);
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const y =
          el.getBoundingClientRect().top + window.scrollY - getHeaderOffsetPx();
        window.scrollTo({ top: Math.max(0, y), behavior: "auto" });
      }
    }, 0);
    return () => clearTimeout(t);
  }, [headingIdSet]);

  useEffect(() => {
    const headingIds = new Set(headings.map((heading) => heading.id));

    const getSections = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          'main [data-heading="true"][id]',
        ),
      ).filter((el) => headingIds.has(el.id));

    const getScrollTop = () =>
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    /**
     * Small buffer so the last section highlights when the scroll position has reached
     * the real bottom (subpixel, footer) — not a large window that would skip middle entries.
     */
    const SCROLL_END_EPSILON_PX = 2;
    const FOOTER_FOOTPRINT_PX = 24;
    /**
     * Treat a heading as “reached” when its top is this far below the spy line. Without
     * it, a section title can sit just under the bar (common with long pages) and the
     * TOC can stay on the *previous* entry until the next title passes—skipping the
     * in-between item (e.g. “Publishing your documentation”).
     */
    const SCROLL_SPY_NUDGE_PX = 64;

    let frame: number | null = null;

    const updateActiveId = () => {
      if (Date.now() < postClickLockUntil.current) {
        return;
      }
      const sections = getSections();
      if (sections.length === 0) {
        return;
      }
      const scrollTop = getScrollTop();
      const viewBottom = scrollTop + window.innerHeight;
      const doc = document.documentElement;
      const maxY = doc.scrollHeight - window.innerHeight;
      const canScroll = maxY > 0;
      const atAbsoluteBottom =
        canScroll && scrollTop >= maxY - SCROLL_END_EPSILON_PX;
      const inLastFooter =
        canScroll && viewBottom >= doc.scrollHeight - FOOTER_FOOTPRINT_PX;

      const spyLine = getScrollSpyLinePx();

      // At the very top of the document, highlight the first TOC entry.
      if (headings.length > 0 && scrollTop < 12) {
        const firstTocId = headings[0].id;
        setActiveId((prev) => (prev === firstTocId ? prev : firstTocId));
        return;
      }

      const last = sections[sections.length - 1]!;

      // At the end of the scrollable range, pin to the last heading (e.g. short final
      // block + footer) — *only* when we’re actually at the bottom, not when the last
      // title is merely visible in a long viewport.
      if (atAbsoluteBottom || inLastFooter) {
        setActiveId((prev) => (prev === last.id ? prev : last.id));
        return;
      }

      // Last heading in document order whose top has crossed a line just below the header
      // (see SCROLL_SPY_NUDGE_PX so we don’t skip a section whose title is barely below it).
      const line = spyLine + SCROLL_SPY_NUDGE_PX;
      let currentId = sections[0]!.id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) {
          currentId = section.id;
        }
      }

      setActiveId((prev) => (prev === currentId ? prev : currentId));
    };

    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateActiveId();
      });
    };

    // Headings from Streamdown can mount after the first paint — always attach listeners and
    // re-query the DOM each update so we are not stuck with an empty section list.
    updateActiveId();
    const retryId = window.setTimeout(updateActiveId, 50);
    const retryId2 = window.setTimeout(updateActiveId, 300);

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.clearTimeout(retryId);
      window.clearTimeout(retryId2);
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate, { capture: true });
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [headings]);

  return (
    <div
      className={cn(
        "sticky pl-2 pr-2",
        docsStickyOffsetClassName(hasHeaderTabs),
      )}
    >
      <SidebarGroup
        className={cn("w-full min-w-0", docsContentTopPaddingClassName)}
      >
        <SidebarGroupLabel className="mb-3 font-light w-full min-w-0 gap-2">
          <RiListIndefinite className="shrink-0" aria-hidden />
          <span>On this page</span>
        </SidebarGroupLabel>
        <SidebarGroupContent className="pl-2">
          <ul className="mt-0 space-y-3.5 border-l border-border">
            {headings.map((heading) => {
              const rank = heading.rank ?? 2;
              // 1.5rem base (same as pl-6) + extra indent for deeper headings
              const paddingLeftRem = 1.5 + (rank - 2) * 0.75;
              return (
                <li
                  key={heading.id}
                  className={cn("-ml-px border-l", {
                    "border-transparent": activeId !== heading.id,
                    "border-primary": activeId === heading.id,
                  })}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => onTocLinkClick(e, heading.id)}
                    className={cn("block truncate text-[14px]", {
                      "text-muted-foreground/80 hover:text-foreground":
                        activeId !== heading.id,
                      "text-primary": activeId === heading.id,
                    })}
                    style={{ paddingLeft: `${paddingLeftRem}rem` }}
                  >
                    {heading.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
