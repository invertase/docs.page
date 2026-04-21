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

const titleBlock = (props: {
  title: string;
  description: string;
  titleClassName?: string;
  /** Extra classes on the text stack (e.g. overlay legibility). */
  textWrapperClassName?: string;
  /** Copy sits on dark scrim / black tile (overlay in light mode). */
  onDarkSurface?: boolean;
}) => (
  <div
    className={cn(
      "flex shrink-0 flex-col gap-2.5",
      props.textWrapperClassName,
    )}
  >
    <CardTitle
      className={cn(
        "shrink-0 text-start text-base font-normal leading-snug",
        props.onDarkSurface
          ? "text-white dark:text-foreground"
          : "text-foreground",
        props.titleClassName,
      )}
    >
      {props.title}
    </CardTitle>
    <CardDescription
      className={cn(
        "shrink-0 text-left text-sm font-light leading-snug sm:text-base sm:leading-snug",
        props.onDarkSurface
          ? "text-zinc-300 group-hover/platform-tile:text-zinc-200 dark:text-zinc-300/80 dark:group-hover/platform-tile:text-zinc-200/85"
          : "text-zinc-400 group-hover/platform-tile:text-zinc-500 dark:text-zinc-300/80 dark:group-hover/platform-tile:text-zinc-200/85",
      )}
    >
      {props.description}
    </CardDescription>
  </div>
);

export function PlatformFeatureCard(props: {
  title: string;
  description: string;
  /** Public paths for theme-specific screenshots (`/_docs.page/assets/...`). */
  image: { light: string; dark: string };
  /** Wider frame for hero-style tiles; default keeps a slightly smaller cap. */
  imageSize?: keyof typeof platformImageFrameWidthClass;
  /** Full-bleed image under bottom-aligned copy (same copy position as stacked layout). */
  imageLayout?: "stacked" | "overlay";
  /** Merged onto `CardTitle` (e.g. `whitespace-nowrap` for a single-line heading). */
  titleClassName?: string;
  /** Merged onto the root `Card` (e.g. `border-0` when the parent grid supplies edges). */
  className?: string;
}) {
  const frameWidthClass =
    platformImageFrameWidthClass[props.imageSize ?? "default"];
  const layout = props.imageLayout ?? "stacked";

  const cardShellClass = cn(
    platformCardVariants(),
    "group/platform-tile w-full text-foreground transition-colors duration-200",
    layout === "stacked" &&
      "hover:bg-muted hover:shadow-none dark:hover:bg-muted/30 dark:hover:text-foreground",
    layout === "overlay" &&
      "hover:!bg-black dark:hover:!bg-marketing-platform-inner-dark dark:hover:!text-foreground",
    /*
      Stacked tiles get height from the fixed screenshot frame + copy. Overlay uses absolute
      fill images (no layout height), so without mins the card collapses to ~text + padding.
    */
    layout === "stacked" && "lg:min-h-[26.25rem]",
    layout === "overlay" &&
      "min-h-[21rem] sm:min-h-[22.5rem] md:min-h-[24rem] lg:min-h-[26.25rem]",
    props.className,
  );

  if (layout === "overlay") {
    return (
      <Card
        className={cn(
          cardShellClass,
          /* Full-card inset tint from `platformCardVariants` darkens art; overlay tiles skip it. */
          "relative overflow-hidden !shadow-none",
          /* Light mode: `bg-card` + `from-background` scrim read as white behind dark art — use black. */
          "!bg-black dark:!bg-marketing-platform-inner-dark",
        )}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <Image
            src={props.image.light}
            alt=""
            fill
            sizes={platformImageSizes}
            className="object-cover object-center dark:hidden"
            priority={false}
          />
          <Image
            src={props.image.dark}
            alt=""
            fill
            sizes={platformImageSizes}
            className="hidden object-cover object-center dark:block"
            priority={false}
          />
        </div>
        {/*
          Scrim only behind copy (bottom band). A full-height gradient + via stop was washing
          the whole image and reading darker than design; top of art stays uncovered.
        */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[min(52%,13rem)] bg-gradient-to-t from-black/90 via-black/40 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/35"
          aria-hidden
        />
        <div
          className={cn(
            "relative z-10 flex h-full min-h-0 w-full min-w-0 flex-1 flex-col justify-end",
            "p-5 pt-4 sm:p-6 sm:pt-4",
          )}
        >
          {titleBlock({
            title: props.title,
            description: props.description,
            titleClassName: props.titleClassName,
            textWrapperClassName: "pt-3",
            onDarkSurface: true,
          })}
        </div>
      </Card>
    );
  }

  return (
    <Card className={cardShellClass}>
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
        <div className="mt-auto shrink-0 pt-3">
          {titleBlock({
            title: props.title,
            description: props.description,
            titleClassName: props.titleClassName,
          })}
        </div>
      </div>
    </Card>
  );
}
