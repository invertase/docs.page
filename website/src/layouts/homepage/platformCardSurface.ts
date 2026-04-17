import { cva } from "class-variance-authority";

/** Shared surface for Platform tiles and the marketing hero shell — matches `PlatformFeatureCard`. */
export const platformCardVariants = cva(
  [
    "group gap-0 overflow-hidden rounded-none py-0 !ring-0",
    "bg-[hsl(var(--color-zinc-50))] shadow-[inset_0_0_0_9999px_hsl(var(--color-zinc-600)/0.04)]",
    "dark:bg-marketing-platform-inner-dark dark:shadow-none",
  ].join(" "),
  {
    variants: {
      tone: {
        default: "border border-zinc-300 shadow-none dark:border-zinc-700",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);
