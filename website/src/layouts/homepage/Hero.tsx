import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";

import { Link } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto min-w-0 w-full max-w-6xl overflow-x-clip px-4 pb-0 lg:overflow-x-visible">
      <Card
        className={cn(
          platformCardVariants(),
          "relative !overflow-visible",
          "border-t-0",
          "pt-6 pl-6 pr-6 pb-6 sm:pt-8 sm:pl-8 sm:pr-8 sm:pb-8 md:pt-10 md:pl-10 md:pr-10 md:pb-10",
          "text-foreground",
        )}
      >
        <div className="relative z-[2] w-full min-w-0">
          <div
            className={cn(
              "relative z-20 space-y-6 text-left",
              "w-full max-w-[min(28rem,100%)]",
              "sm:max-w-[36rem] lg:max-w-[min(42rem,54%)]",
              "xl:max-w-[min(48rem,52%)] 2xl:max-w-[min(52rem,50%)]",
            )}
          >
            <h1 className="heading-h1">
              <span className="block lg:whitespace-nowrap">
                Build and publish AI-ready
              </span>
              <span className="block lg:whitespace-nowrap">
                documentation from your
              </span>
              <span className="block lg:whitespace-nowrap">
                GitHub repository.
              </span>
            </h1>
            <p
              className={cn(
                "text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-300/80",
                "max-w-none",
              )}
            >
              <strong className="font-bold text-zinc-700 dark:text-zinc-200/90">
                docs.page
              </strong>{" "}
              transforms your GitHub repository into a refined documentation
              interface. Serve developers in the browser and AI agents via native
              machine-readable endpoints - all with zero platform overhead.
            </p>
            <Link
              href={LINKS.getStarted}
              className={buttonVariants({
                variant: "primary",
                size: "lg",
              })}
            >
              Start Publishing for Free
              <ChevronRightIcon aria-hidden />
            </Link>
          </div>

          <div
            className={cn(
              "relative z-10 mt-8 w-full",
              "lg:mt-0 lg:absolute lg:inset-y-0 lg:left-[26%] lg:right-0",
              "xl:left-[24%] 2xl:left-[22%]",
              "lg:-translate-y-[20px] lg:translate-x-[30px] lg:flex lg:items-center lg:justify-end lg:pl-2",
            )}
          >
            <Image
              src="/_docs.page/assets/v4/hero-image.png"
              alt="docs.page interface preview: editor, doc chat, and URL"
              width={2841}
              height={2773}
              priority
              sizes="(min-width: 1536px) 1254px, (min-width: 1280px) 1026px, (min-width: 1024px) 80vw, 100vw"
              className={cn(
                "mx-auto h-auto w-full max-w-[47.88rem] object-contain object-center",
                "lg:ms-auto lg:me-0 lg:max-h-[min(45.6rem,78vh)] lg:max-w-none",
                "lg:min-w-[36.48rem] lg:w-[min(68.4rem,100%)] lg:origin-right lg:scale-[1.254] lg:object-right",
                "min-[1200px]:min-w-[41.04rem] min-[1200px]:scale-[1.2768]",
                "xl:min-w-[45.6rem] xl:scale-[1.311]",
                "2xl:min-w-[50.16rem] 2xl:w-[min(72.96rem,100%)]",
              )}
            />
          </div>
        </div>
      </Card>
    </section>
  );
}
