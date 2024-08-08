import type { ComponentProps } from "react";
import { cn } from "~/utils";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
} & ComponentProps<"div">;

export function FeatureCard({
  icon,
  title,
  description,
  className,
  ...other
}: Props) {
  return (
    <div {...other} className={cn("p-6 space-y-3 border-r border-white/5", className)}>
      <div className="size-[30px] bg-white/10">{icon}</div>
      <h4 className="">{title}</h4>
      <p className="font-light">{description}</p>
    </div>
  );
}
