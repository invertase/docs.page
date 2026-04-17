import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="border-t border-zinc-300 dark:border-zinc-700">
        <div className="flex flex-col items-stretch gap-10 pl-6 pr-4 text-left md:flex-row md:items-stretch md:gap-8 lg:gap-10">
          <div className="flex w-full min-w-0 max-w-xl flex-col items-start justify-center gap-6 md:flex-1 md:self-stretch lg:max-w-2xl">
            <h2 className="heading-h2 text-left">
              Start publishing{" "}
              <span className="font-mono text-marketing-accent">today</span>
            </h2>
            <p className="text-left text-lg font-light text-muted-foreground/70">
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
          <div className="flex w-full min-w-0 shrink-0 md:flex-1">
            <div className="flex min-h-[12rem] w-full flex-1 flex-col items-center justify-center border-l border-zinc-300 bg-transparent py-12 pl-6 pr-2 dark:border-zinc-700 md:min-h-0 md:py-14 md:pl-8 md:pr-4">
              <img
                src="/_docs.page/assets/large-icon-light.svg"
                alt=""
                className="h-auto w-auto max-w-[min(100%,10.5rem)] object-contain sm:max-w-[11.55rem] md:max-w-[12.6rem] dark:hidden"
                loading="lazy"
                decoding="async"
              />
              <img
                src="/_docs.page/assets/large-icon.svg"
                alt=""
                className="hidden h-auto w-auto max-w-[min(100%,10.5rem)] object-contain sm:max-w-[11.55rem] md:max-w-[12.6rem] dark:block"
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
