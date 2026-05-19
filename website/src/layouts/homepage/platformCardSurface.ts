import { cva } from "class-variance-authority";

/** Shared surface for the marketing hero shell, header, and footer cards. */
export const platformCardVariants = cva(
  [
    "group gap-0 rounded-none py-0 !ring-0",
    "bg-card shadow-[inset_0_0_0_9999px_hsl(var(--foreground)/0.04)]",
    "dark:bg-marketing-platform-inner-dark dark:shadow-none",
  ].join(" "),
  {
    variants: {
      tone: {
        default: "border border-border shadow-none",
      },
      clip: {
        hidden: "overflow-hidden",
        visible: "overflow-visible",
      },
    },
    defaultVariants: {
      tone: "default",
      clip: "hidden",
    },
  },
);
