"use client";

import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { Button, buttonTrailingIconClass } from "../ui/button";
import {
  FEATURE_MEDIA_FRAME_CLASS,
  FeatureSectionMedia,
} from "./feature-section-media";
import { FEATURES } from "./features-data";
import styles from "./homepage.module.css";
import { HOMEPAGE_FEATURE_STACK_MEDIA_QUERY } from "./homepage-breakpoints";
import { ModernInterfaceThemePicker } from "./modern-interface-theme-picker";
import {
  PAPER_FOLD_REM,
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperClippedPanel,
} from "./paper-corner";

/** First card sticks this far from the viewport top; each next card sits slightly lower. */
const FEATURE_STACK_TOP_BASE_REM = 1.5;
/** Peek overlap between stack tabs — keep below fold height so corners stay readable. */
const FEATURE_STACK_OVERLAP_REM = 1;
const FEATURE_STACK_STEP_REM = PAPER_FOLD_REM - FEATURE_STACK_OVERLAP_REM;

const FEATURE_STACK_HEADER_CLASS = cn(
  "flex shrink-0 items-center",
  "pl-24 pr-6 sm:pr-8 lg:pr-10",
  "min-h-0 min-w-0",
);

const FEATURE_STACK_HEADER_TITLE_CLASS =
  "min-w-0 truncate font-mono text-xs font-medium tracking-wide uppercase text-neutral-400 sm:text-sm";

const FEATURE_ROW_CLASS = cn(
  "grid w-full min-w-0 grid-cols-1 overflow-visible py-8",
  "lg:grid-cols-2 lg:items-stretch lg:gap-0 lg:py-0",
);

const FEATURE_COPY_CLASS = cn(
  "flex h-full min-h-full min-w-0 flex-col justify-start p-8 pt-12 text-left sm:p-10 sm:pt-12",
  "lg:px-16 lg:pt-20 lg:pb-32",
);

function featureStackTop(index: number) {
  return `calc(${FEATURE_STACK_TOP_BASE_REM}rem + ${index * FEATURE_STACK_STEP_REM}rem)`;
}

function StackHeaderTitle({
  stackTitle,
  honeySubstring,
}: {
  stackTitle: string;
  honeySubstring: string;
}) {
  const honeyStart = stackTitle.indexOf(honeySubstring);
  if (honeyStart < 0) {
    return <h3 className={FEATURE_STACK_HEADER_TITLE_CLASS}>{stackTitle}</h3>;
  }

  const k = honeySubstring.length;
  return (
    <h3 className={FEATURE_STACK_HEADER_TITLE_CLASS}>
      {stackTitle.slice(0, honeyStart)}
      <span className="text-primary">{honeySubstring}</span>
      {stackTitle.slice(honeyStart + k)}
    </h3>
  );
}

export function FeatureStack() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const lockScrollRef = useRef(0);

  useEffect(() => {
    const stackNode = wrapperRef.current;
    if (!stackNode) return;
    const stackWrapper: HTMLDivElement = stackNode;

    const desktopMq = window.matchMedia(HOMEPAGE_FEATURE_STACK_MEDIA_QUERY);

    let rafId = 0;
    const lastIndex = FEATURES.length - 1;
    const lastStickyTopPx =
      (FEATURE_STACK_TOP_BASE_REM + lastIndex * FEATURE_STACK_STEP_REM) * 16;
    const UNLOCK_BUFFER_PX = 8;

    function maxCardHeight(cards: HTMLCollectionOf<HTMLElement>) {
      let max = 0;
      for (let i = 0; i < cards.length; i++) {
        max = Math.max(max, cards[i].offsetHeight);
      }
      return max;
    }

    function clearScrollLockStyles(cards: HTMLCollectionOf<HTMLElement>) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.position = "";
        cards[i].style.left = "";
        cards[i].style.width = "";
        cards[i].style.transform = "";
      }
    }

    function restoreStickyTops(cards: HTMLCollectionOf<HTMLElement>) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.top = featureStackTop(i);
      }
    }

    function lock(cards: HTMLCollectionOf<HTMLElement>) {
      lockedRef.current = true;
      lockScrollRef.current = window.scrollY;
      stackWrapper.style.height = `${stackWrapper.offsetHeight}px`;

      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        cards[i].style.position = "fixed";
        cards[i].style.top = `${rect.top}px`;
        cards[i].style.left = `${rect.left}px`;
        cards[i].style.width = `${rect.width}px`;
        cards[i].style.transform = "";
      }
    }

    function unlock(cards: HTMLCollectionOf<HTMLElement>) {
      lockedRef.current = false;
      stackWrapper.style.height = "";
      clearScrollLockStyles(cards);
      restoreStickyTops(cards);
      requestAnimationFrame(update);
    }

    function resetScrollLock(cards: HTMLCollectionOf<HTMLElement>) {
      if (lockedRef.current) {
        unlock(cards);
        return;
      }
      stackWrapper.style.height = "";
      clearScrollLockStyles(cards);
      restoreStickyTops(cards);
    }

    function update() {
      const cards = stackWrapper.children as HTMLCollectionOf<HTMLElement>;
      if (cards.length === 0) return;

      const cardHeight = maxCardHeight(cards);
      if (cardHeight === 0) return;

      const wrapperRect = stackWrapper.getBoundingClientRect();
      const unstickThreshold = lastStickyTopPx + cardHeight;

      if (!lockedRef.current) {
        if (wrapperRect.bottom <= unstickThreshold + 1) {
          lock(cards);
        }
      } else {
        const delta = window.scrollY - lockScrollRef.current;
        for (let i = 0; i < cards.length; i++) {
          cards[i].style.transform =
            delta === 0 ? "" : `translateY(${-delta}px)`;
        }

        if (wrapperRect.bottom > unstickThreshold + UNLOCK_BUFFER_PX) {
          unlock(cards);
        }
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => {
      const cards = stackWrapper.children as HTMLCollectionOf<HTMLElement>;
      if (cards.length === 0) return;
      if (lockedRef.current) {
        unlock(cards);
      }
      requestAnimationFrame(update);
    });
    resizeObserver.observe(stackWrapper);
    for (let i = 0; i < stackWrapper.children.length; i++) {
      resizeObserver.observe(stackWrapper.children[i]);
    }

    requestAnimationFrame(update);

    const onBreakpointChange = () => {
      const cards = stackWrapper.children as HTMLCollectionOf<HTMLElement>;
      if (cards.length > 0 && lockedRef.current) {
        unlock(cards);
      }
      if (!desktopMq.matches && cards.length > 0) {
        resetScrollLock(cards);
      }
      requestAnimationFrame(update);
    };

    desktopMq.addEventListener("change", onBreakpointChange);

    return () => {
      desktopMq.removeEventListener("change", onBreakpointChange);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      const cards = stackWrapper.children as HTMLCollectionOf<HTMLElement>;
      if (cards.length > 0) {
        resetScrollLock(cards);
      }
    };
  }, []);

  return (
    <section
      className={cn(
        PAPER_SECTION_SHELL_CLASS,
        PAPER_SECTION_OVERLAP_CLASS,
        "overflow-visible bg-black pb-40",
      )}
      aria-label="Features"
    >
      <div
        ref={wrapperRef}
        className="mx-auto flex min-w-0 max-w-8xl flex-col overflow-visible"
      >
        {FEATURES.map((feature, index) => {
          const stackHeader = (
            <div
              className={FEATURE_STACK_HEADER_CLASS}
              style={{ height: `${FEATURE_STACK_STEP_REM}rem` }}
            >
              <StackHeaderTitle
                stackTitle={feature.stackTitle}
                honeySubstring={feature.honeySubstring}
              />
            </div>
          );

          const copyColumn = (
            <div className={FEATURE_COPY_CLASS}>
              <div className="flex flex-col gap-6 lg:gap-7">
                <h4 className="text-3xl font-light font-heading text-neutral-300">
                  {feature.title}
                </h4>
                <p className="text-neutral-400">{feature.description}</p>
                <div>
                  <Button variant="outline" asChild>
                    <Link href={feature.ctaHref}>
                      <span>Learn more</span>
                      <RiArrowRightSLine
                        data-icon="inline-end"
                        className={buttonTrailingIconClass}
                      />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );

          const mediaColumn =
            feature.customMedia === "themePresets" ? (
              <div
                className={cn(
                  "flex min-h-full min-w-0 flex-col items-center justify-center py-6",
                  "lg:justify-start lg:py-0 lg:pt-8",
                )}
              >
                <div
                  className={cn(
                    styles.homepageFeatureMediaGlow,
                    styles.homepageFeatureMediaGlowImage,
                    "relative z-[1] w-full px-4 sm:px-6 lg:px-16",
                  )}
                >
                  <div className={FEATURE_MEDIA_FRAME_CLASS}>
                    <ModernInterfaceThemePicker />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "flex min-h-full min-w-0 flex-col items-center justify-center py-6",
                  feature.video
                    ? "lg:justify-center lg:py-0"
                    : "lg:items-start lg:justify-start lg:py-0 lg:pt-20",
                )}
              >
                <FeatureSectionMedia
                  alt={feature.imageAlt}
                  image={feature.image}
                  video={feature.video}
                  mediaEnlarged={feature.mediaEnlarged}
                  mediaGlowPosition={feature.mediaGlowPosition}
                  className="w-full lg:px-16"
                />
              </div>
            );

          return (
            <article
              key={feature.id}
              className="sticky overflow-visible"
              style={{
                top: featureStackTop(index),
                zIndex: index + 1,
              }}
            >
              <PaperClippedPanel
                corner="top-left"
                frosted
                className={cn(
                  "px-0 py-0",
                  feature.tallOnDesktop && "lg:min-h-128",
                )}
              >
                {stackHeader}
                <div className={FEATURE_ROW_CLASS}>
                  {copyColumn}
                  <div className="mt-8 lg:mt-0">{mediaColumn}</div>
                </div>
              </PaperClippedPanel>
            </article>
          );
        })}
      </div>
    </section>
  );
}
