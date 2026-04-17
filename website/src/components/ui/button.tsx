import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding font-mono text-base font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-yellow-500 focus-visible:ring focus-visible:ring-yellow-500/40 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring aria-invalid:ring-red-500/20 dark:aria-invalid:border-red-400 dark:aria-invalid:ring-red-400/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-yellow-400 text-zinc-950 hover:bg-yellow-300",
        secondary:
          "bg-zinc-200 text-zinc-900 hover:bg-zinc-300 aria-expanded:bg-zinc-200 aria-expanded:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700 dark:aria-expanded:bg-zinc-800 dark:aria-expanded:text-zinc-50",
        outline:
          "border-yellow-600 bg-white hover:bg-yellow-100 hover:text-zinc-950 aria-expanded:bg-yellow-100 aria-expanded:text-zinc-950 dark:border-yellow-400 dark:bg-transparent dark:text-yellow-400 dark:hover:bg-yellow-400/10 dark:aria-expanded:bg-yellow-400/10",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-950 aria-expanded:bg-zinc-100 aria-expanded:text-zinc-950 dark:hover:bg-zinc-800/50 dark:aria-expanded:bg-zinc-800/50",
        destructive:
          "bg-red-100 text-red-700 hover:bg-red-200 focus-visible:border-red-500 focus-visible:ring-red-500/30 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/60 dark:focus-visible:border-red-400 dark:focus-visible:ring-red-400/30",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2 text-sm has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        xs: "h-6 gap-1 px-1.5 text-xs has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2 text-[0.8rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 min-h-11 gap-2 px-4 text-base sm:px-5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-5",
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

export { Button, buttonVariants };
