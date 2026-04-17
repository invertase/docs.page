import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

const platformImageSizeClass = {
  default:
    "max-h-[12rem] max-w-[min(100%,15.5rem)] sm:max-h-[12.5rem] sm:max-w-[16.5rem] md:max-lg:max-h-[13.5rem] md:max-lg:max-w-[min(100%,19rem)] lg:max-h-[14rem] lg:max-w-[min(100%,19.5rem)]",
  large:
    "max-h-[14rem] max-w-[min(100%,17.5rem)] sm:max-h-[14.5rem] sm:max-w-[19.5rem] md:max-lg:max-h-[15.5rem] md:max-lg:max-w-[min(100%,22rem)] lg:max-h-[16.5rem] lg:max-w-[min(100%,22.5rem)]",
} as const;

export function PlatformFeatureCard(props: {
  title: string;
  description: string;
  /** Public paths for theme-specific screenshots (`/_docs.page/assets/...`). */
  image: { light: string; dark: string };
  /** Larger screenshots for select tiles; default keeps the smaller cap. */
  imageSize?: keyof typeof platformImageSizeClass;
  /** Merged onto `CardTitle` (e.g. `whitespace-nowrap` for a single-line heading). */
  titleClassName?: string;
  /** Merged onto the root `Card` (e.g. `border-0` when the parent grid supplies edges). */
  className?: string;
}) {
  const sizeClass = platformImageSizeClass[props.imageSize ?? "default"];

  return (
    <Card
      className={cn(
        platformCardVariants(),
        "group/platform-tile w-full text-foreground transition-colors duration-200 hover:bg-zinc-100 hover:shadow-none dark:hover:bg-zinc-900 dark:hover:text-zinc-50",
        props.className,
      )}
    >
      <div
        className={cn(
          "relative flex w-full flex-col gap-2.5 overflow-hidden p-5 pt-4 sm:p-6 sm:pt-4",
        )}
      >
        <div
          className="relative flex w-full shrink-0 items-center justify-center py-1"
          aria-hidden
        >
          <img
            src={props.image.light}
            alt=""
            className={cn(
              "h-auto w-auto object-contain object-center dark:hidden",
              sizeClass,
            )}
            loading="lazy"
            decoding="async"
          />
          <img
            src={props.image.dark}
            alt=""
            className={cn(
              "hidden h-auto w-auto object-contain object-center dark:block",
              sizeClass,
            )}
            loading="lazy"
            decoding="async"
          />
        </div>
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
    </Card>
  );
}
