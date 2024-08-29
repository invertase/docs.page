import { ChevronRightIcon } from "lucide-react";
import { type ComponentProps, cloneElement, createElement } from "react";
import { cn } from "~/utils";

type Props =
  | ({
      as: "a";
      href: string;
      children: string;
      cta?: boolean;
    } & ComponentProps<"a">)
  | ({
      as: "button";
      children: string;
      cta?: boolean;
    } & ComponentProps<"button">);

export function Button({ className, cta, ...props }: Props) {
  let el: React.ReactNode;

  if (props.as === "button") {
    el = <button {...props} />;
  } else {
    el = <a {...props} href={props.href} />;
  }

  const child = (
    <div
      className={cn(
        "inline-flex px-6 py-3 items-center gap-2",
        {
          "bg-gradient-to-br from-brand-900 to-brand-950 rounded-full font-medium transition-all":
            cta,
        },
        className,
      )}
    >
      <span>{props.children}</span>
      <ChevronRightIcon size={18} />
    </div>
  );

  return cloneElement(
    el,
    {
      className: cn(
        "inline-block p-px rounded-full hover:-translate-y-[2px] transition-all",
        {
          "bg-gradient-to-b from-brand-700/60 to-brand-100/10": cta,
        },
      ),
    },
    child,
  );
}
