import { MenuIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/utils";

export function MenuToggle({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "flex lg:hidden items-center justify-center relative size-8 hover:bg-black/10 hover:dark:bg-white/10 rounded-full transition-all",
        className,
      )}
    >
      <MenuIcon size={20} />
    </button>
  );
}
