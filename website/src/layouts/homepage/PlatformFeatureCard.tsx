import Image from "next/image";

import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

/** `default` keeps marketing screenshots slightly narrower; `large` uses the full tile width. */
const platformImageFrameWidthClass = {
  default:
    "mx-auto w-full max-w-[min(100%,14rem)] sm:max-w-[15rem] md:max-lg:max-w-[min(100%,17.5rem)] lg:max-w-[min(100%,18rem)]",
  large: "w-full max-w-full",
} as const;

/** Responsive hint for `next/image` fill — grid tile ≈ ⅓ of content width at lg. */
const platformImageSizes =
  "(min-width: 1024px) min(34vw, 28rem), (min-width: 768px) 45vw, 92vw";

export function PlatformFeatureCard(props: {
  title: string;
  description: string;
  /** Public paths for theme-specific screenshots (`/_docs.page/assets/...`). */
  image: { light: string; dark: string };
  /** Wider frame for hero-style tiles; default keeps a slightly smaller cap. */
  imageSize?: keyof typeof platformImageFrameWidthClass;
  /** Merged onto `CardTitle` (e.g. `whitespace-nowrap` for a single-line heading). */
  titleClassName?: string;
  /** Merged onto the root `Card` (e.g. `border-0` when the parent grid supplies edges). */
  className?: string;
}) {
  const frameWidthClass =
    platformImageFrameWidthClass[props.imageSize ?? "default"];

  return (
    <Card
      className={cn(
        platformCardVariants(),
        "group/platform-tile w-full text-foreground transition-colors duration-200 hover:bg-zinc-100 hover:shadow-none dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
        /* lg: 3+2 grid — rows size independently; align both rows to the taller row (~26.25rem). */
        "lg:min-h-[26.25rem]",
        props.className,
      )}
    >
      <div
        className={cn(
          "relative flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden p-5 pt-4 sm:p-6 sm:pt-4",
        )}
      >
        <div
          className="box-border flex min-h-0 min-w-0 max-w-full shrink-0 flex-col overflow-hidden py-1.5 h-[13.5rem] sm:h-[14.5rem] md:h-[15.5rem] lg:h-[18.5rem]"
          aria-hidden
        >
          <div
            className={cn(
              "relative h-full min-h-0 min-w-0 overflow-hidden",
              frameWidthClass,
            )}
          >
            <Image
              src={props.image.light}
              alt=""
              fill
              sizes={platformImageSizes}
              className="object-contain object-center dark:hidden"
            />
            <Image
              src={props.image.dark}
              alt=""
              fill
              sizes={platformImageSizes}
              className="hidden object-contain object-center dark:block"
            />
          </div>
        </div>
        <div className="mt-auto flex shrink-0 flex-col gap-2.5 pt-3">
          <CardTitle
            className={cn(
              "shrink-0 text-start text-base font-normal leading-snug text-foreground",
              props.titleClassName,
            )}
          >
            {props.title}
          </CardTitle>
          <CardDescription className="shrink-0 text-left text-sm font-light leading-snug group-hover/platform-tile:text-zinc-600 dark:group-hover/platform-tile:text-zinc-400 sm:text-base sm:leading-snug">
            {props.description}
          </CardDescription>
        </div>
      </div>
    </Card>
  );
}
