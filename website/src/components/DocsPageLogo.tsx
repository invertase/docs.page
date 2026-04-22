import Image from "next/image";

import { cn } from "~/lib/utils";

/** Marketing wordmark — source of truth: `public/_docs.page/assets/v4/logo.svg`. */
const DOCS_PAGE_LOGO_SRC = "/_docs.page/assets/v4/logo.svg";

export function DocsPageLogo({ className }: { className?: string }) {
  return (
    <Image
      src={DOCS_PAGE_LOGO_SRC}
      alt="docs.page"
      width={6703}
      height={1213}
      priority
      unoptimized
      className={cn(
        "h-[calc(1.75rem*0.85)] w-auto brightness-0 dark:brightness-100",
        className,
      )}
    />
  );
}
