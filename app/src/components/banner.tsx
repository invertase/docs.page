import { cloneElement } from "react";
import { Link } from "@/components/doc-link";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { cn } from "@/lib/utils";

export function Banner() {
  const { bundle } = useDocPageContext();
  const { href, message, backgroundColor, foregroundColor } =
    bundle.config.banner;

  if (!message) {
    return null;
  }

  const Element = href ? <Link href={href} /> : <div />;

  return cloneElement(Element, {
    className: cn("block font-light", {
      "hover:underline": href,
      "bg-sidebar": !backgroundColor,
      "text-foreground": !foregroundColor,
    }),
    style: {
      backgroundColor,
      color: foregroundColor,
    },
    children: (
      <div className="min-h-10 px-4 py-2 max-w-8xl mx-auto flex items-center justify-center text-center">
        <p className="text-sm opacity-90">{message}</p>
      </div>
    ),
  });
}
