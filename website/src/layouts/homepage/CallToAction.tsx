import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="border-t border-zinc-300 dark:border-zinc-700">
        {/*
          md+: Icon column is `position:absolute; inset-y:0` inside this `relative` wrapper.
          Wrapper height = in-flow copy column only, so the icon strip always matches that height
          (avoids flex/grid % height bugs with table-cell too).
        */}
        <div className="relative px-6 pb-10 text-left md:min-h-[19rem] md:pb-12 lg:min-h-[21rem]">
          <div className="mx-auto flex w-full min-w-0 max-w-xl flex-col items-start justify-center gap-6 pt-10 md:mx-0 md:box-border md:w-1/2 md:max-w-none md:shrink-0 md:pr-8 md:pt-12">
            <h2 className="heading-h2 break-words text-left">
              Start publishing{" "}
              <span className="font-mono text-marketing-accent">today</span>
            </h2>
            <p className="break-words text-left text-lg font-light text-muted-foreground/70">
              Begin publishing your great documentation now.
            </p>
            <div className="flex justify-start pt-0">
              <Link
                href={LINKS.getStarted}
                className={buttonVariants({
                  variant: "primary",
                  size: "lg",
                })}
              >
                Start publishing
                <ChevronRightIcon aria-hidden />
              </Link>
            </div>
          </div>

          <div className="hidden min-h-0 overflow-hidden border-l border-zinc-300 bg-transparent dark:border-zinc-700 md:absolute md:inset-y-0 md:left-1/2 md:right-0 md:flex md:items-center md:justify-center md:pl-8 md:pr-4">
            <div className="flex h-full max-h-full min-h-0 w-full items-center justify-center p-1">
              <img
                src="/_docs.page/assets/large-icon-light.svg"
                alt=""
                className="h-auto max-h-full w-auto max-w-[min(100%,10.5rem)] object-contain sm:max-w-[11.55rem] md:max-h-[min(100%,11rem)] md:max-w-[min(100%,11rem)] lg:max-h-[min(100%,13rem)] lg:max-w-[min(100%,13rem)] xl:max-h-[min(100%,15rem)] xl:max-w-[min(100%,15rem)] dark:hidden"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/_docs.page/assets/large-icon.svg"
                alt=""
                className="hidden h-auto max-h-full w-auto max-w-[min(100%,10.5rem)] object-contain sm:max-w-[11.55rem] md:max-h-[min(100%,11rem)] md:max-w-[min(100%,11rem)] lg:max-h-[min(100%,13rem)] lg:max-w-[min(100%,13rem)] xl:max-h-[min(100%,15rem)] xl:max-w-[min(100%,15rem)] dark:block"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
