import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="border-t border-border">
        <div className="pl-6 pr-6 pb-10 text-left sm:pl-8 md:pl-10 md:pb-12">
          <div className="flex w-full min-w-0 max-w-2xl flex-col items-start justify-center gap-6 pt-10 md:pt-12">
            <h2 className="heading-h2 break-words text-left">
              Start publishing{" "}
              <span className="font-mono text-marketing-accent">today</span>
            </h2>
            <p className="break-words text-left text-lg font-light text-zinc-600 dark:text-zinc-300/80">
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
        </div>
      </div>
    </section>
  );
}
