import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import faBrandIconNames from "./fa-brand-icons.json";

/** Slugs synced from `public/_docs.page/fa/brands.min.css` — run `bun run generate:fa-brand-icons`. */
const brands = new Set<string>(faBrandIconNames);

type IconProps = ComponentProps<"i"> & {
  name: string;
  size?: number;
};

export function Icon({ className, name, size, style, ...other }: IconProps) {
  const base = brands.has(name) ? "fa-brands" : "fa-solid";
  return (
    <i
      {...other}
      className={cn("fa-fw", base, `fa-${name}`, className)}
      style={{
        lineHeight: "inherit",
        fontSize: size ? `${size}px` : undefined,
        ...style,
      }}
    />
  );
}
