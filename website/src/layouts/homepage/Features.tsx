import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

const V4 = "/_docs.page/assets/v4";

/**
 * 2×2 grid order (row-major): Machine-readable | Free custom domains / BYOK | Git-native
 *
 * Card fill: linear gradient equivalent to #3B3B47 → #040406 at 20% layer opacity over `#040406`
 * (top stop: 80% base / 20% slate; bottom: canvas black).
 */
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

/** Gradient read as visible overlay; rgba-only stacking was imperceptible on the base. */
const featureCardFill =
  "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-black)_80%,#3B3B47_20%),var(--color-black))]";

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 md:py-12">
      <div
        className={cn(
          "grid w-full grid-cols-1 items-stretch gap-5 sm:grid-cols-2 sm:gap-5 md:gap-6",
          "pl-6 pr-6 sm:pl-8 sm:pr-8 md:pl-10 md:pr-10",
        )}
      >
        {features.map((f) => (
          <article
            key={f.title}
            className={cn(
              "relative flex h-full min-h-0 flex-col rounded-lg border border-white/10 p-6 text-left shadow-sm",
              /* Align row heights in the 2×2 grid: match the ~162px tall cards (shorter row was ~140px). */
              "sm:min-h-[10.125rem]",
              featureCardFill,
            )}
          >
            <Image
              src={f.src}
              alt=""
              width={44}
              height={44}
              unoptimized
              className="pointer-events-none absolute right-5 top-5 size-11 shrink-0 object-contain sm:right-6 sm:top-6"
              aria-hidden
            />
            <div className="relative flex min-w-0 flex-col gap-4 pr-11 sm:pr-12 md:pr-14">
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
