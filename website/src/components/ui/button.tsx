import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-mono text-base font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring focus-visible:ring-ring/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring aria-invalid:ring-destructive/25 dark:aria-invalid:ring-destructive/35 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Semibold is visually heavier; other variants keep default `font-medium` from the base. */
        primary: "font-semibold bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground dark:hover:bg-secondary/90",
        outline:
          "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary",
        ghost:
          "hover:bg-[hsl(var(--color-gray-200))] hover:text-foreground aria-expanded:bg-[hsl(var(--color-gray-200))] aria-expanded:text-foreground dark:hover:bg-muted/60 dark:aria-expanded:bg-muted/60",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:border-destructive focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40",
      },
      size: {
        default:
          "h-9 min-h-9 gap-2 px-3.5 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 sm:px-4 md:px-5",
        xs: "h-6 gap-1.5 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-2.5 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 sm:px-3 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-12 min-h-12 gap-2.5 px-5 text-base has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 sm:px-6 md:px-7 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

type ButtonProps = ButtonPrimitive.Props & {
  variant?: ButtonVariant;
  size?: VariantProps<typeof buttonVariants>["size"];
};

function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

const buttonChevronVariants = cva("shrink-0", {
  variants: {
    size: {
      default: "size-4",
      lg: "size-5",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

function ButtonChevron({
  className,
  size,
  ...props
}: ComponentProps<typeof ChevronRightIcon> &
  VariantProps<typeof buttonChevronVariants>) {
  return (
    <ChevronRightIcon
      aria-hidden
      className={cn(buttonChevronVariants({ size }), className)}
      {...props}
    />
  );
}

export { Button, ButtonChevron, buttonVariants };
