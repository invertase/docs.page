import { ChevronRightIcon } from "lucide-react";
import { cn } from "~/utils";

type Props = {
  href: string;
  children: string;
  cta?: boolean;
};

export function Button(props: Props) {
  return (
    <a
      href={props.href}
      className={cn(
        "inline-block p-px rounded-full hover:-translate-y-[2px] transition-all",
        {
          "bg-gradient-to-b from-brand-700/60 to-brand-100/10": props.cta,
        },
      )}
    >
      <div
        className={cn("inline-flex px-6 py-3 items-center gap-2", {
          "bg-gradient-to-br from-brand-900 to-brand-950 rounded-full font-medium transition-all":
            props.cta,
        })}
      >
        <span>{props.children}</span>
        <ChevronRightIcon size={18} />
      </div>
    </a>
  );
}
