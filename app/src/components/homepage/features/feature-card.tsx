import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../../ui/button";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperCorner,
  paperCornerClipPath,
} from "../paper-corner";
import { FeatureStage } from "./feature-dot-field";

type FeatureCardProps = PropsWithChildren<{
  title: React.ReactNode;
  description: string;
  link: string;
  index: number;
  /** Shared feature-stage backdrop behind the right-panel visual. */
  stage?: boolean;
  /** Defined left copy panel (periwinkle fill + left border). */
  copyPanel?: boolean;
}>;

export function FeatureCard({
  title,
  description,
  link,
  index,
  stage,
  copyPanel,
  children,
}: FeatureCardProps) {
  return (
    <div
      data-stack-card
      className={cn(PAPER_SECTION_OVERLAP_CLASS, "sticky")}
      style={{ top: `${index}rem`, zIndex: index + 1 }}
    >
      <div
        className={cn(PAPER_SECTION_SHELL_CLASS, "bg-black pb-20 lg:pb-40")}
        style={{ clipPath: paperCornerClipPath() }}
      >
        <PaperCorner />
        <div className="mx-auto flex flex-col max-w-8xl space-y-8">
          <div className="px-6 pt-8 lg:pl-26 lg:pr-0"></div>
          <div className="mt-8 lg:mt-0 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,3.5fr)] lg:gap-0">
            <div
              className={cn(
                "flex flex-col gap-4 space-y-6 px-6 lg:px-20",
                copyPanel
                  ? "h-full justify-center border-l border-periwinkle-500 bg-periwinkle-500/10 py-8 lg:py-12"
                  : "lg:mt-12",
              )}
            >
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
            </div>
            <div
              className={cn(
                "relative flex items-center justify-center px-6 pb-8 lg:pr-20 lg:px-0 lg:pb-0",
                stage &&
                  "overflow-hidden px-8 pb-10 lg:px-12 lg:py-12 lg:pr-24",
              )}
            >
              {stage ? <FeatureStage>{children}</FeatureStage> : children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
