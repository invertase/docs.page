"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "~/lib/use-isomorphic-layout-effect";
import { cn } from "~/lib/utils";

type ThumbState = { widthPct: number; leftPct: number };

const MIN_THUMB_PCT = 10;

export function FeaturesScrollStrip({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<ThumbState>({
    widthPct: 100,
    leftPct: 0,
  });
  const [overflow, setOverflow] = useState(false);

  const updateThumb = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = scrollWidth - clientWidth;
    const hasOverflow = maxScroll > 2;
    setOverflow(hasOverflow);
    if (!hasOverflow) {
      setThumb({ widthPct: 100, leftPct: 0 });
      return;
    }
    const rawWidthPct = (clientWidth / scrollWidth) * 100;
    const widthPct = Math.max(rawWidthPct, MIN_THUMB_PCT);
    const maxLeft = 100 - widthPct;
    const leftPct = maxScroll > 0 ? (scrollLeft / maxScroll) * maxLeft : 0;
    setThumb({ widthPct, leftPct });
  }, []);

  useIsomorphicLayoutEffect(() => {
    updateThumb();
  }, [updateThumb]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateThumb();
    el.addEventListener("scroll", updateThumb, { passive: true });
    const ro = new ResizeObserver(updateThumb);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateThumb);
      ro.disconnect();
    };
  }, [updateThumb]);

  const onTrackPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;
    if ((e.target as HTMLElement).dataset.thumb === "true") return;
    const rect = track.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const maxScroll = scroll.scrollWidth - scroll.clientWidth;
    const ratio = rect.width > 0 ? Math.max(0, Math.min(1, x / rect.width)) : 0;
    scroll.scrollLeft = ratio * maxScroll;
  };

  const onThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const scroll = scrollRef.current;
    const track = trackRef.current;
    if (!scroll || !track) return;
    const startX = e.clientX;
    const startScroll = scroll.scrollLeft;
    const trackW = track.getBoundingClientRect().width;
    const maxScroll = scroll.scrollWidth - scroll.clientWidth;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      scroll.scrollLeft =
        trackW > 0 ? startScroll + (dx / trackW) * maxScroll : startScroll;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={scrollRef}
        className={cn(
          "marketing-features-scroll-native-hidden w-full py-0",
          /* Room for the custom scrollbar track (h-1) so cards aren’t covered */
          overflow && "pb-2",
        )}
      >
        {children}
      </div>
      {overflow ? (
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-10"
          aria-hidden
        >
          <div
            ref={trackRef}
            role="presentation"
            className="pointer-events-auto relative h-1 w-full cursor-pointer rounded-none bg-zinc-200 dark:bg-zinc-900"
            onPointerDown={onTrackPointerDown}
          >
            <div
              data-thumb="true"
              className="absolute top-0 h-full cursor-grab rounded-none bg-zinc-300 active:cursor-grabbing dark:bg-zinc-700"
              style={{
                width: `${thumb.widthPct}%`,
                left: `${thumb.leftPct}%`,
              }}
              onPointerDown={onThumbPointerDown}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
