import Image from "next/image";

import { landingAssetPath } from "~/constants/assets";
import { cn } from "~/lib/utils";

/** Marketing wordmark sourced from the replaceable public SVG asset. */
export function DocsPageLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-neutral-950 dark:text-neutral-50",
        className,
      )}
    >
      <Image
        src={landingAssetPath("logo.svg")}
        alt="docs.page"
        width={6182}
        height={1423}
        className="h-[calc(1.75rem*0.85*1.3)] w-auto"
      />
    </span>
  );
}
