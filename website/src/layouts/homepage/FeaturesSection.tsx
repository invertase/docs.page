"use client";

import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef } from "react";

import { ButtonChevron, buttonVariants } from "~/components/ui/button";
import { landingAssetPath } from "~/constants/assets";
import { MARKETING_NAV_MEDIA_QUERY } from "~/constants/breakpoints";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import {
  FEATURE_PAPER_FOLD_REM,
  FeatureCardPaperCorner,
  featureCardSurfaceClipPath,
  type PaperCornerPlacement,
} from "./FeatureCardPaperCorner";
import { ModernInterfaceThemePicker } from "./ModernInterfaceThemePicker";

type FeatureCopyBlock =
  | { type: "paragraph"; text: string }
  | { type: "listIntro"; text: string }
  | { type: "list"; items: string[] }
  | {
      type: "richParagraph";
      segments: { text: string; accent?: boolean }[];
    };

/** All feature illustrations are exported at the same pixel size (see `LANDING_ASSETS_BASE`). */
const FEATURE_ILLUSTRATION_WIDTH = 3546;
const FEATURE_ILLUSTRATION_HEIGHT = 2976;

/** Bump when replacing PNGs in `public/` so Next image optimizer fetches the new file. */
const FEATURE_ASSETS_VERSION = "20260527c";

function featureImageSrc(filename: string) {
  return `${landingAssetPath(filename)}?v=${FEATURE_ASSETS_VERSION}`;
}

const FEATURE_IMAGE_PUBLIC = {
  githubPublishing: featureImageSrc("github-publishing.png"),
  agentAccess: featureImageSrc("agent-ready.gif"),
  nativeSearch: featureImageSrc("native-search.png"),
  shadcnTheming: featureImageSrc("shadcn-theming.png"),
  versionManagement: featureImageSrc("version-management.png"),
} as const;

type Feature = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** When true, illustration is on the leading side on `md+` (copy on the right). */
  imageLeading?: boolean;
  /** Folded corner on the card — independent of column order. */
  paperCorner: PaperCornerPlacement;
  subtitle?: string;
  subtitleItems?: string[];
  description?: string;
  copyBlocks?: FeatureCopyBlock[];
  cta?: { label: string; href: string };
  ecosystemTitle?: boolean;
  honeySubstring?: string;
  /** Optional minimum height for the card content area. */
  minHeight?: string;
  /** When set, renders a looping video instead of an image. */
  videoSrc?: string;
  /** Custom interactive media instead of a static image or video. */
  customMedia?: "themePresets";
  /** Softer, smaller periwinkle glow when illustration is compact. */
  subtleMediaGlow?: boolean;
  /** Slightly reduced periwinkle glow (e.g. Git publishing illustration). */
  softMediaGlow?: boolean;
};

/** Shared min height for taller feature cards in the sticky stack. */
const FEATURE_TALL_CARD_MIN_HEIGHT = "32rem";

const FEATURES: Feature[] = [
  {
    title: "Agent access",
    description:
      "Let users' AI agents query your documentation. Built-in MCP servers alongside llms.txt files allow LLMs to ingest your product context instantly.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Agent",
    imageSrc: FEATURE_IMAGE_PUBLIC.agentAccess,
    imageAlt:
      "Illustration: agent-accessible documentation with MCP and llms.txt",
    videoSrc: featureImageSrc("agent-ready.mp4"),
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
  },
  {
    title: "Git publishing",
    description:
      "Deploy updates directly from your software repository. Eliminate build pipelines, hosting configuration, or infrastructure maintenance.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Git",
    imageSrc: FEATURE_IMAGE_PUBLIC.githubPublishing,
    imageAlt:
      "Illustration: publishing documentation directly from a Git repository",
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
    softMediaGlow: true,
  },
  {
    title: "Intelligent Search",
    description:
      "Index content automatically and provide an embedded AI chat. Locate information instantly without third-party tracking scripts or external setup.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Intelligent",
    imageSrc: FEATURE_IMAGE_PUBLIC.nativeSearch,
    imageAlt:
      "Illustration: built-in documentation search in the docs interface",
    videoSrc: featureImageSrc("intelligent-search.mp4"),
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
  },
  {
    title: "Interactive components",
    description:
      "Embed functional elements directly into markdown files. Keep readers engaged using pre-built tabs, callouts, or interactive widgets.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Interactive",
    imageSrc: FEATURE_IMAGE_PUBLIC.shadcnTheming,
    imageAlt:
      "Illustration: interactive documentation components embedded in markdown",
    videoSrc: featureImageSrc("interactive-components.mp4"),
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
  },
  {
    title: "Version Management",
    description:
      "Support multiple software versions simultaneously. Keep legacy guides or localised translations organised for your users.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Version",
    imageSrc: FEATURE_IMAGE_PUBLIC.versionManagement,
    imageAlt:
      "Illustration: managing multiple documentation versions and translations",
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
    subtleMediaGlow: true,
  },
  {
    title: "Modern interface",
    description:
      "Style your docs site using shadcn/ui design standards. Customize components easily to match your brand identity.",
    cta: { label: "Learn more", href: LINKS.docs },
    ecosystemTitle: true,
    honeySubstring: "Modern",
    imageSrc: featureImageSrc("preset-1.png"),
    imageAlt: "Interactive theme preset preview for documentation styling",
    customMedia: "themePresets",
    paperCorner: "top-left",
    minHeight: FEATURE_TALL_CARD_MIN_HEIGHT,
  },
];

const FEATURE_ROW_CLASS =
  "grid w-full min-w-0 grid-cols-1 overflow-visible py-8 marketingNav:grid-cols-2 marketingNav:items-stretch marketingNav:gap-0 marketingNav:py-0";

const FEATURE_COL_BASE = "min-h-full min-w-0 self-stretch overflow-visible";

const FEATURE_IMAGE_COL = cn(
  FEATURE_COL_BASE,
  "flex flex-col items-center justify-center py-6",
  "marketingNav:items-start marketingNav:justify-start marketingNav:py-0 marketingNav:pt-16 lg:pt-20",
);

const FEATURE_IMAGE_COL_THEME_PICKER = cn(
  FEATURE_COL_BASE,
  "flex flex-col items-center justify-center py-6",
  "marketingNav:justify-start marketingNav:py-0 marketingNav:pt-6 lg:pt-8",
);

/** Title strip — matches sticky stack peek height so headings stay visible when layered. */
const FEATURE_STACK_HEADER_CLASS = cn(
  "flex shrink-0 items-center",
  "pl-24 pr-6 sm:pr-8 marketingNav:pr-10",
  "min-h-0 min-w-0",
);

const FEATURE_STACK_HEADER_TITLE_CLASS =
  "min-w-0 truncate font-mono text-xs font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400 sm:text-sm";

const FEATURE_COPY_CLASS_BASE =
  "flex h-full min-h-full min-w-0 flex-col justify-start p-8 text-left sm:p-10 marketingNav:pt-16 marketingNav:pb-24 marketingNav:px-12 lg:pt-20 lg:pb-32 lg:px-16";

const FEATURE_COPY_BODY_CLASS = "flex flex-col gap-6 lg:gap-7";

const FEATURE_BODY_MONO_CLASS =
  "flex flex-col gap-4 font-mono text-sm font-light leading-relaxed sm:text-base";

const FEATURE_BODY_MUTED_CLASS = "text-neutral-400 dark:text-neutral-400";

const FEATURE_BODY_LIST_CLASS = "marketing-feature-copy-list space-y-1.5";

const FEATURE_MEDIA_FRAME_CLASS = "relative w-[90%] max-w-full";

const FEATURE_MEDIA_GLOW_CLASS = cn(
  "feature-media-glow pointer-events-none absolute left-1/2 top-1/2 z-0",
  "aspect-square w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[96px]",
);

const FEATURE_MEDIA_GLOW_SUBTLE_CLASS = cn(
  FEATURE_MEDIA_GLOW_CLASS,
  "feature-media-glow--subtle w-[46%] blur-[72px]",
);

const FEATURE_MEDIA_GLOW_SOFT_CLASS = cn(
  FEATURE_MEDIA_GLOW_CLASS,
  "feature-media-glow--soft w-[56%] blur-[84px]",
);

const FEATURE_MEDIA_GLOW_VIVID_CLASS = cn(
  FEATURE_MEDIA_GLOW_CLASS,
  "feature-media-glow--vivid w-[68%] blur-[100px]",
);

function featureMediaGlowClass({
  subtleGlow,
  softGlow,
  vividGlow,
}: {
  subtleGlow?: boolean;
  softGlow?: boolean;
  vividGlow?: boolean;
}) {
  if (subtleGlow) return FEATURE_MEDIA_GLOW_SUBTLE_CLASS;
  if (softGlow) return FEATURE_MEDIA_GLOW_SOFT_CLASS;
  if (vividGlow) return FEATURE_MEDIA_GLOW_VIVID_CLASS;
  return FEATURE_MEDIA_GLOW_CLASS;
}

const FEATURE_MEDIA_BASE_CLASS =
  "relative z-0 block h-auto w-full max-w-full rounded-lg overflow-hidden";

const FEATURE_IMAGE_CLASS = FEATURE_MEDIA_BASE_CLASS;

const FEATURE_VIDEO_CLASS = cn(
  FEATURE_MEDIA_BASE_CLASS,
  "border border-neutral-700",
);

function FeatureMediaGlow({
  children,
  centered = false,
  subtleGlow = false,
  softGlow = false,
  vividGlow = false,
}: {
  children: ReactNode;
  centered?: boolean;
  subtleGlow?: boolean;
  softGlow?: boolean;
  vividGlow?: boolean;
}) {
  return (
    <div
      className={cn(
        FEATURE_MEDIA_FRAME_CLASS,
        "mx-auto marketingNav:mx-0",
        centered && "marketingNav:mx-auto",
      )}
    >
      <div
        className={featureMediaGlowClass({ subtleGlow, softGlow, vividGlow })}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-[1]",
          centered && "flex w-full justify-center",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** First card sticks this far from the viewport top; each next card sits slightly lower. */
const FEATURE_STACK_TOP_BASE_REM = 1.5;
/** Peek overlap between stack tabs — keep below fold height so corners stay readable. */
const FEATURE_STACK_OVERLAP_REM = 1;
const FEATURE_STACK_STEP_REM =
  FEATURE_PAPER_FOLD_REM - FEATURE_STACK_OVERLAP_REM;

function featureStackTop(index: number) {
  return `calc(${FEATURE_STACK_TOP_BASE_REM}rem + ${index * FEATURE_STACK_STEP_REM}rem)`;
}

function FeatureVideo({
  src,
  className,
  ariaLabel,
}: {
  src: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className={className}
      aria-label={ariaLabel}
    />
  );
}

export function FeaturesSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lockedRef = useRef(false);
  const lockScrollRef = useRef(0);

  useEffect(() => {
    const stackNode = wrapperRef.current;
    if (!stackNode) return;
    const stackWrapper: HTMLDivElement = stackNode;
    const desktopMq = window.matchMedia(MARKETING_NAV_MEDIA_QUERY);

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
      className="mx-auto min-w-0 w-full max-w-8xl overflow-visible px-4"
      aria-label="Features"
    >
      <div
        ref={wrapperRef}
        className="flex min-w-0 flex-col overflow-visible rounded-none"
      >
        {FEATURES.map((feature, index) => {
          const honeyStart =
            feature.honeySubstring && feature.honeySubstring.length > 0
              ? feature.title.indexOf(feature.honeySubstring)
              : -1;

          const hasHoneyHighlight =
            Boolean(feature.ecosystemTitle) &&
            Boolean(feature.honeySubstring) &&
            honeyStart >= 0;

          let titleMarkup: JSX.Element | null = null;

          if (feature.ecosystemTitle) {
            if (hasHoneyHighlight && feature.honeySubstring) {
              const i = honeyStart as number;
              const k = feature.honeySubstring.length;
              titleMarkup = (
                <h3 className={FEATURE_STACK_HEADER_TITLE_CLASS}>
                  {feature.title.slice(0, i)}
                  <span className="text-honey-500">
                    {feature.honeySubstring}
                  </span>
                  {feature.title.slice(i + k)}
                </h3>
              );
            } else {
              titleMarkup = (
                <h3 className={FEATURE_STACK_HEADER_TITLE_CLASS}>
                  {feature.title}
                </h3>
              );
            }
          }

          const stackHeader = (
            <div
              className={FEATURE_STACK_HEADER_CLASS}
              style={{ height: `${FEATURE_STACK_STEP_REM}rem` }}
            >
              {titleMarkup ?? (
                <h3 className={FEATURE_STACK_HEADER_TITLE_CLASS}>
                  {feature.title}
                </h3>
              )}
            </div>
          );

          const copyHeadingClass =
            "text-marketing-section text-neutral-950 dark:text-white";

          const copyHeading = (
            <h3 className={copyHeadingClass}>{feature.title}</h3>
          );

          const copyColumn = (
            <div className={FEATURE_COPY_CLASS_BASE}>
              <div className={FEATURE_COPY_BODY_CLASS}>
                {copyHeading}
                {feature.subtitleItems?.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm font-light leading-relaxed text-honey-500 sm:text-base">
                    {feature.subtitleItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : feature.subtitle ? (
                  <p className="text-sm font-light leading-snug text-neutral-500 dark:text-neutral-400">
                    {feature.subtitle}
                  </p>
                ) : null}
                {feature.copyBlocks?.length ? (
                  <div className={FEATURE_BODY_MONO_CLASS}>
                    {feature.copyBlocks.map((block, blockIdx) => {
                      if (block.type === "list") {
                        return (
                          <ul
                            key={`${block.type}-${blockIdx}`}
                            className={FEATURE_BODY_LIST_CLASS}
                          >
                            {block.items.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        );
                      }

                      if (block.type === "richParagraph") {
                        return (
                          <p
                            key={`${block.type}-${blockIdx}`}
                            className={FEATURE_BODY_MUTED_CLASS}
                          >
                            {block.segments.map((segment, segmentIndex) =>
                              segment.accent ? (
                                <span
                                  key={segmentIndex}
                                  className="text-honey-500"
                                >
                                  {segment.text}
                                </span>
                              ) : (
                                segment.text
                              ),
                            )}
                          </p>
                        );
                      }

                      return (
                        <p
                          key={`${block.type}-${blockIdx}`}
                          className={FEATURE_BODY_MUTED_CLASS}
                        >
                          {block.text}
                        </p>
                      );
                    })}
                  </div>
                ) : feature.description ? (
                  <p className="text-sm font-light leading-relaxed text-neutral-400 sm:text-base">
                    {feature.description}
                  </p>
                ) : null}
                {feature.cta ? (
                  <Link
                    href={feature.cta.href}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "w-fit shrink-0",
                    )}
                  >
                    {feature.cta.label}
                    <ButtonChevron />
                  </Link>
                ) : null}
              </div>
            </div>
          );

          const imageColumn = (
            <div
              className={
                feature.customMedia === "themePresets"
                  ? FEATURE_IMAGE_COL_THEME_PICKER
                  : FEATURE_IMAGE_COL
              }
            >
              <FeatureMediaGlow
                centered={feature.customMedia === "themePresets"}
                subtleGlow={feature.subtleMediaGlow}
                softGlow={feature.softMediaGlow}
                vividGlow={
                  !feature.subtleMediaGlow &&
                  !feature.softMediaGlow &&
                  Boolean(
                    feature.videoSrc || feature.customMedia === "themePresets",
                  )
                }
              >
                {feature.customMedia === "themePresets" ? (
                  <ModernInterfaceThemePicker imageSrc={featureImageSrc} />
                ) : feature.videoSrc ? (
                  <FeatureVideo
                    src={feature.videoSrc}
                    className={FEATURE_VIDEO_CLASS}
                    ariaLabel={feature.imageAlt}
                  />
                ) : (
                  <Image
                    key={feature.imageSrc}
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    width={FEATURE_ILLUSTRATION_WIDTH}
                    height={FEATURE_ILLUSTRATION_HEIGHT}
                    sizes="(max-width: 812px) 100vw, 50vw"
                    className={FEATURE_IMAGE_CLASS}
                    unoptimized={process.env.NODE_ENV === "development"}
                  />
                )}
              </FeatureMediaGlow>
            </div>
          );

          return (
            <article
              key={`${feature.title}-${index}`}
              className="sticky overflow-visible"
              style={{
                top: featureStackTop(index),
                zIndex: index + 1,
              }}
            >
              <div
                className={cn(
                  "relative border-x border-border bg-black/70 px-0 py-0 backdrop-blur-lg",
                )}
                style={{
                  clipPath: featureCardSurfaceClipPath(feature.paperCorner),
                }}
              >
                <FeatureCardPaperCorner corner={feature.paperCorner} />
                {stackHeader}
                <div
                  className={cn(
                    FEATURE_ROW_CLASS,
                    feature.minHeight && "marketingNav:min-h-[32rem]",
                  )}
                >
                  {feature.imageLeading ? (
                    <>
                      {imageColumn}
                      <div className={FEATURE_COL_BASE}>{copyColumn}</div>
                    </>
                  ) : (
                    <>
                      <div className={FEATURE_COL_BASE}>{copyColumn}</div>
                      <div className="mt-8 marketingNav:mt-0">
                        {imageColumn}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
