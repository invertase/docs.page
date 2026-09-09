import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import styles from "../homepage.module.css";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperCorner,
  paperCornerClipPath,
} from "../paper-corner";
import { FeatureDotField } from "./feature-dot-field";

/**
 * Equal inset around staged media — same token on all four sides.
 * Pair with the 1900×1080 aspect box so the visual fills the inner rectangle
 * (no leftover column letterbox, no clip against the card).
 */
const STAGE_MEDIA_INSET_CLASS = "p-8 lg:p-12";
/**
 * Feature videos are 1900×1080 (search/markdown are 1904×1080). Keep the
 * inner box matching so contain ≈ cover for video. Wider stills letterbox
 * into the periwinkle wash rather than cropping.
 */
const STAGE_MEDIA_ASPECT_CLASS = "aspect-[1900/1080]";
/**
 * Next paper card uses `-mt-20` (the dog-ear fold). Desktop fill pins to
 * `bottom-20` so the right-column wash meets that seam. Mobile leaves the
 * shell unpadded so the stage wash can run to the card edge and under the fold.
 */
const STAGE_STACK_CLEARANCE_CLASS = "lg:pb-20";
const STAGE_STACK_CLEARANCE_INSET_CLASS = "bottom-20";
/**
 * In-flow mobile spacer below the visual. Just over the next card’s
 * `-mt-20` fold (5rem) so the inset-0 wash still runs under Git Publishing
 * without a large empty gap.
 */
const STAGE_MOBILE_WASH_PAD_CLASS = "h-24";
/** Shared radial periwinkle wash — desktop column + mobile media panel. */
const STAGE_WASH_CLASS = styles["homepage-feature-stage-wash"];

type FeatureCardProps = PropsWithChildren<{
  title: React.ReactNode;
  description: string;
  link: string;
  index: number;
  /** Shared feature-stage backdrop behind the right-panel visual. */
  stage?: boolean;
}>;

export function FeatureCard({
  title,
  description,
  link,
  index,
  stage,
  children,
}: FeatureCardProps) {
  const copy = (
    <>
      <h4 className="text-2xl font-extralight font-heading text-neutral-300 lg:text-3xl">
        {title}
      </h4>
      <p className="text-neutral-400 font-extralight">{description}</p>
      <div>
        <Button
          variant="outline"
          asChild
          className="group rounded-full dark:border-primary bg-transparent font-light text-primary hover:text-primary hover:bg-primary/10"
        >
          <Link href={link}>
            <span>Learn more</span>
            <RiArrowRightSLine className="size-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </>
  );

  return (
    <div
      data-stack-card
      className={cn(PAPER_SECTION_OVERLAP_CLASS, "sticky")}
      style={{ top: `${index}rem`, zIndex: index + 1 }}
    >
      <div
        className={cn(
          PAPER_SECTION_SHELL_CLASS,
          "bg-black",
          stage ? STAGE_STACK_CLEARANCE_CLASS : "pb-20 lg:pb-40",
        )}
        style={{ clipPath: paperCornerClipPath() }}
      >
        <PaperCorner />
        {stage ? (
          <>
            <div
              className={cn(
                "pointer-events-none absolute top-0 right-0 isolate hidden overflow-hidden border-l border-border lg:block lg:left-[calc(100%*2.5/6)]",
                STAGE_WASH_CLASS,
                STAGE_STACK_CLEARANCE_INSET_CLASS,
              )}
            >
              <FeatureDotField seed={index} />
            </div>
            <div className="relative grid min-h-0 overflow-visible grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,3.5fr)]">
              {/*
                Mobile copy matches sibling horizontal inset (px-6). pt-24
                sits the title a rem below the outer 5rem dog-ear. Desktop
                L/R is unchanged; copy is out of flow so height comes from
                media.
              */}
              <div className="flex flex-col justify-center gap-4 space-y-6 px-6 pt-24 pb-10 lg:absolute lg:inset-y-0 lg:left-0 lg:z-1 lg:w-[calc(100%*2.5/6)] lg:px-12 lg:pl-32 lg:py-0">
                {copy}
              </div>
              {/*
                Mobile media is a straight-edged panel under the copy — no
                PaperCorner or clip-path. The fill is inset-0 so wash /
                lattice / pulse run through the extra pb and under the next
                card’s overlapping dog-ear (no hard seam above the fold).
              */}
              <div className="relative min-h-0 overflow-visible border-t border-border lg:col-start-2 lg:border-0 lg:bg-transparent">
                <div
                  className={cn(
                    "absolute inset-0 isolate overflow-hidden lg:hidden",
                    STAGE_WASH_CLASS,
                  )}
                >
                  <FeatureDotField seed={index} />
                </div>
                <div
                  className={cn("relative z-1 w-full", STAGE_MEDIA_INSET_CLASS)}
                >
                  <div
                    className={cn(
                      "relative w-full min-w-0",
                      STAGE_MEDIA_ASPECT_CLASS,
                      // Direct FeatureMedia children only — do not pierce
                      // composite visuals (Modern Interface preset shots).
                      "[&>*>img]:absolute [&>*>img]:inset-0 [&>*>img]:size-full [&>*>img]:object-contain",
                      "[&>*>video]:absolute [&>*>video]:inset-0 [&>*>video]:size-full [&>*>video]:object-contain",
                    )}
                  >
                    {children}
                  </div>
                </div>
                <div
                  className={cn(STAGE_MOBILE_WASH_PAD_CLASS, "lg:hidden")}
                  aria-hidden
                />
              </div>
            </div>
          </>
        ) : (
          <div className="mx-auto flex flex-col max-w-8xl space-y-8">
            <div className="px-6 pt-8 lg:pl-26 lg:pr-0"></div>
            <div className="mt-8 lg:mt-0 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,3.5fr)] lg:gap-0">
              <div className="flex flex-col gap-4 px-6 space-y-6 lg:mt-12 lg:px-20">
                {copy}
              </div>
              <div className="relative flex items-center justify-center px-6 pb-8 lg:pr-20 lg:px-0 lg:pb-0">
                {children}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
