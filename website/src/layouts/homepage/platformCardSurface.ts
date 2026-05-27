import { cva } from "class-variance-authority";

/** Shared surface for the marketing hero shell, header, and footer cards. */
export const platformCardVariants = cva(
  [
    "group gap-0 rounded-none py-0 !ring-0",
    "bg-transparent shadow-none",
    "dark:bg-transparent dark:shadow-none",
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
