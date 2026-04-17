import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

const platformImageSizeClass = {
  default:
    "max-h-[10rem] max-w-[min(100%,12.5rem)] sm:max-h-[10.75rem] sm:max-w-[14rem]",
  large:
    "max-h-[11.75rem] max-w-[min(100%,14rem)] sm:max-h-[12.75rem] sm:max-w-[16rem]",
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
      <div className="relative flex aspect-square w-full flex-col gap-3 overflow-hidden p-6 pt-4">
        <div
          className="relative flex min-h-0 w-full flex-1 items-center justify-center"
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
            "shrink-0 text-start text-lg font-normal text-foreground",
            props.titleClassName,
          )}
        >
          {props.title}
        </CardTitle>
        <CardDescription className="shrink-0 text-left text-base font-light leading-6 group-hover/platform-tile:text-zinc-600 dark:group-hover/platform-tile:text-zinc-400">
          {props.description}
        </CardDescription>
      </div>
    </Card>
  );
}
