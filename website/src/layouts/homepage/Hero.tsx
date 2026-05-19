import Image from "next/image";

import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import heroBgGlow from "../../../public/_docs.page/assets/v4/hero-bg-glow.svg";
import hexagonBg from "../../../public/_docs.page/assets/v4/hexagon-bg.svg";
import { HeroHeadingDots } from "./HeroHeadingDots";
import { HeroInitCommand } from "./HeroInitCommand";
import { HeroPreview } from "./HeroPreview";
import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto min-w-0 w-full max-w-8xl overflow-visible px-4">
      <Card
        className={cn(
          platformCardVariants({ clip: "visible" }),
          "relative",
          "border-b-0 border-t-0",
          "py-0 px-6 sm:px-8 md:px-10",
          "text-foreground",
          "!overflow-visible",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <Image
            src={hexagonBg}
            alt=""
            width={1373}
            height={1514}
            className="absolute right-0 top-[26%] h-[min(32.2rem,69vw)] w-auto max-w-none translate-x-[24%] opacity-[0.78] sm:top-[24%] sm:h-[min(34.5rem,74.75vw)] sm:translate-x-[26%] md:top-[21%] lg:top-[19%] lg:h-[36.8rem] lg:translate-x-[28%]"
          />
        </div>
        <div
          className="hero-bg-glow pointer-events-none absolute inset-x-0 z-[1]"
          aria-hidden
        >
          <Image
            src={heroBgGlow}
            alt=""
            width={5033}
            height={1896}
            className="hero-bg-glow__image"
            sizes="(min-width: 1280px) 1152px, 100vw"
          />
        </div>
        <div className="relative z-[2] w-full min-w-0 text-center pt-14 pb-5 sm:pt-16 sm:pb-6 md:pt-18 md:pb-8">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 overflow-visible sm:gap-6 md:gap-7">
            <span className="mx-auto inline-flex w-fit max-w-[38rem] items-center justify-center rounded-md border border-gray-600 px-2.5 py-0.5 text-center font-mono text-xs font-medium leading-snug text-gray-500 opacity-70 transition-opacity duration-200 ease-out hover:opacity-100 md:text-sm">
              The easiest way to ship agent-ready docs for free
            </span>
            <HeroHeadingDots className="w-full">
            <div className="relative z-[2] mx-auto max-w-3xl overflow-visible">
              <h1 className="heading-h1 mx-auto flex w-max max-w-full flex-col items-center gap-0 overflow-visible text-center text-4xl font-light leading-none md:text-5xl lg:text-6xl">
                <span className="inline-block max-w-full leading-none text-gray-950 dark:text-white lg:whitespace-nowrap">
                  Docs for
                </span>
                <span className="block max-w-full overflow-visible leading-none text-gray-950 dark:text-white [line-height:1.22] -mt-[0.08em] md:[line-height:1.23] lg:whitespace-nowrap lg:[line-height:1.26]">
                  humans<span className="px-[0.2em]">+</span>agents
                </span>
              </h1>
            </div>
            </HeroHeadingDots>
            <p className="mx-auto max-w-[38rem] text-base font-light leading-relaxed text-gray-500 dark:text-gray-400">
              A <span className="text-marketing-accent">free</span> and{" "}
              <span className="text-marketing-accent">open-source</span> service
              for publishing public GitHub repository markdown documentation as
              a modern themed docs site. Native AI chat, MCP support, and
              llms.txt out of the box.
            </p>
            <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <p className="shrink-0 text-left font-mono text-base font-light leading-relaxed text-gray-500 dark:text-gray-400">
              Live in seconds:
            </p>
            <HeroInitCommand />
            </div>
          </div>
        </div>
        <div className="relative z-[2] mt-8 md:mt-12">
          <HeroPreview />
        </div>
      </Card>
    </section>
  );
}
