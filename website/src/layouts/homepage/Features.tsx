import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

const V4 = "/_docs.page/assets/v4";

/** 2×2 grid order (row-major): Machine-readable | Free custom domains / BYOK | Git-native */
const features: {
  src: string;
  title: string;
  description: ReactNode;
  /** Optional classes for the description paragraph (e.g. tighter type so two forced lines don’t reflow). */
  descriptionClassName?: string;
}[] = [
  {
    src: `${V4}/machine-readable.svg`,
    title: "Machine-readable",
    descriptionClassName: "text-[13px] leading-snug sm:text-sm sm:leading-relaxed",
    description: (
      <>
        <span className="block">
          Native support for llms.txt, llms-full.txt,
        </span>
        <span className="block">
          and /mcp endpoints - 94% faster for instant RAG context.
        </span>
      </>
    ),
  },
  {
    src: `${V4}/custom-domains.svg`,
    title: "Free custom domains",
    description:
      "Serve docs on your own domain at no added platform charge.",
  },
  {
    src: `${V4}/byok.svg`,
    title: "BYOK",
    description: "Power search via your own API keys. No middleware markups.",
  },
  {
    src: `${V4}/git-native.svg`,
    title: "Git-native",
    description:
      "Manage docs like you manage code. Branching, version control, and PR previews come standard.",
  },
];

function featureCellClass(i: number) {
  return cn(
    "min-w-0 border-border",
    i < 3 && "border-b",
    i === 0 && "sm:border-b sm:border-r",
    i === 1 && "sm:border-b",
    i === 2 && "sm:border-b-0 sm:border-r",
  );
}

export function Features() {
  return (
    <section className="mx-auto w-full min-w-0 max-w-8xl px-4">
      <div
        className={cn(
          "border-t border-b border-border",
          "grid grid-cols-1 sm:grid-cols-2",
          "items-stretch gap-0",
        )}
      >
        {features.map((f, i) => (
          <article
            key={f.title}
            className={cn(
              "flex min-w-0 gap-4 p-6 text-left sm:p-8 md:p-10",
              featureCellClass(i),
            )}
          >
            <Image
              src={f.src}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="pointer-events-none size-11 shrink-0 object-contain"
              aria-hidden
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h3 className="font-heading text-lg font-medium leading-snug text-zinc-50 sm:text-xl">
                {f.title}
              </h3>
              <p
                className={cn(
                  "font-light text-zinc-400",
                  f.descriptionClassName ?? "text-sm leading-relaxed",
                )}
              >
                {f.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
