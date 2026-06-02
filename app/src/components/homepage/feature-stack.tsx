import { RiArrowRightSLine } from "@remixicon/react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonTrailingIconClass } from "../ui/button";
import {
  FEATURE_MEDIA_FRAME_CLASS,
  FeatureSectionMedia,
} from "./feature-section-media";
import { FEATURES } from "./features-data";
import styles from "./homepage.module.css";
import { ModernInterfaceThemePicker } from "./modern-interface-theme-picker";
import {
  PAPER_SECTION_OVERLAP_CLASS,
  PAPER_SECTION_SHELL_CLASS,
  PaperClippedPanel,
} from "./paper-corner";

const FEATURE_HEADER_CLASS = cn(
  "flex shrink-0 items-center py-4",
  "pl-24 pr-6 sm:pr-8 lg:pr-10",
  "min-h-0 min-w-0",
);

const FEATURE_HEADER_TITLE_CLASS =
  "min-w-0 truncate font-mono text-xs font-medium tracking-wide uppercase text-neutral-400 sm:text-sm";

const FEATURE_ROW_CLASS = cn(
  "grid w-full min-w-0 grid-cols-1 overflow-visible py-8",
  "lg:grid-cols-2 lg:items-stretch lg:gap-0 lg:py-0",
);

const FEATURE_COPY_CLASS = cn(
  "flex h-full min-h-full min-w-0 flex-col justify-start p-8 pt-12 text-left sm:p-10 sm:pt-12",
  "lg:px-16 lg:pt-20 lg:pb-32",
);

function FeatureHeaderTitle({
  stackTitle,
  honeySubstring,
}: {
  stackTitle: string;
  honeySubstring: string;
}) {
  const honeyStart = stackTitle.indexOf(honeySubstring);
  if (honeyStart < 0) {
    return <h3 className={FEATURE_HEADER_TITLE_CLASS}>{stackTitle}</h3>;
  }

  const k = honeySubstring.length;
  return (
    <h3 className={FEATURE_HEADER_TITLE_CLASS}>
      {stackTitle.slice(0, honeyStart)}
      <span className="text-primary">{honeySubstring}</span>
      {stackTitle.slice(honeyStart + k)}
    </h3>
  );
}

export function FeatureStack() {
  return (
    <section
      className={cn(
        PAPER_SECTION_SHELL_CLASS,
        PAPER_SECTION_OVERLAP_CLASS,
        "overflow-visible bg-black pb-24",
      )}
      aria-label="Features"
    >
      <div className="mx-auto flex min-w-0 max-w-8xl flex-col gap-8 overflow-visible">
        {FEATURES.map((feature) => (
          <article key={feature.id}>
            <PaperClippedPanel corner="top-left" frosted className="px-0 py-0">
              <div className={FEATURE_HEADER_CLASS}>
                <FeatureHeaderTitle
                  stackTitle={feature.stackTitle}
                  honeySubstring={feature.honeySubstring}
                />
              </div>
              <div className={FEATURE_ROW_CLASS}>
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
                <div className="mt-8 lg:mt-0">
                  {feature.customMedia === "themePresets" ? (
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
                  )}
                </div>
              </div>
            </PaperClippedPanel>
          </article>
        ))}
      </div>
    </section>
  );
}
