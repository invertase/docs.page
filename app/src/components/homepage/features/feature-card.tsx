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
import { FeatureDotField } from "./feature-dot-field";

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
          !stage && "pb-20 lg:pb-40",
        )}
        style={{ clipPath: paperCornerClipPath() }}
      >
        <PaperCorner />
        {stage ? (
          <>
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden overflow-hidden border-l border-periwinkle-500 bg-periwinkle-500/10 lg:block lg:left-[calc(100%*2.5/6)]">
              <FeatureDotField />
            </div>
            <div className="relative grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,2.5fr)_minmax(0,3.5fr)]">
              <div className="flex flex-col justify-center gap-4 space-y-6 px-8 py-16 lg:px-12 lg:pl-32 lg:py-28">
                {copy}
              </div>
              <div className="relative flex min-h-0 items-center justify-center overflow-hidden border-l border-periwinkle-500 bg-periwinkle-500/10 lg:border-0 lg:bg-transparent">
                <div className="lg:hidden">
                  <FeatureDotField />
                </div>
                <div className="relative z-1 flex size-full min-h-0 items-center justify-center p-8 lg:p-12 [&_img]:max-h-full [&_video]:max-h-full [&_video]:object-contain">
                  {children}
                </div>
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
