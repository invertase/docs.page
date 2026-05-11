import Image from "next/image";

type Feature = {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  /** Accent heading color for text-only cards (image cards use teal). */
  titleAccent?: "lavender" | "warmOrange";
};

const FEATURES: Feature[] = [
  {
    title: "Ship with your Code",
    description:
      "Publish directly from GitHub with PR, branch, and commit previews.",
    titleAccent: "lavender",
  },
  {
    title: "Built for AI Agents",
    description:
      "docs.page exposes your documentation in the formats agents and tools need.",
    imageSrc: "/_docs.page/assets/v4/for-agents.svg",
    imageAlt: "Diagram: documentation endpoints for AI agents",
  },
  {
    title: "Designed for Great DX",
    description:
      "Get a production-ready documentation site with custom themes, native search, and interactive AI tools as standard.",
    titleAccent: "warmOrange",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="mx-auto min-w-0 w-full max-w-8xl overflow-x-clip px-4"
      aria-label="Features"
    >
      <div className="min-w-0">
        <div className="mx-auto grid max-w-8xl grid-cols-1 gap-0 divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {FEATURES.map((feature) => {
            const titleClassName = feature.imageSrc
              ? "font-marketing-heading text-lg font-light leading-snug text-left text-[hsl(var(--color-brand-teal))] sm:text-xl"
              : feature.titleAccent === "lavender"
                ? "font-marketing-heading text-lg font-light leading-snug text-[hsl(var(--color-brand-lavender))] sm:text-xl"
                : feature.titleAccent === "warmOrange"
                  ? "font-marketing-heading text-lg font-light leading-snug text-[hsl(var(--color-brand-warm-orange))] sm:text-xl"
                  : "font-marketing-heading text-lg font-light leading-snug text-foreground sm:text-xl";

            const textBlock = (
              <div className="flex flex-col gap-3">
                <h3 className={titleClassName}>{feature.title}</h3>
                {feature.description ? (
                  <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300/85">
                    {feature.description}
                  </p>
                ) : null}
              </div>
            );

            return (
              <article
                key={feature.title}
                className="flex h-full min-h-0 flex-col bg-card/60 px-7 pt-6 pb-12 dark:bg-marketing-platform-inner-dark/80 sm:px-9 sm:pt-7 sm:pb-14 md:pb-16"
              >
                {feature.imageSrc ? (
                  <>
                    <div className="mb-12 flex shrink-0 flex-col gap-3 sm:mb-14 md:mb-16">
                      <h3 className={titleClassName}>{feature.title}</h3>
                      {feature.description ? (
                        <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300/85">
                          {feature.description}
                        </p>
                      ) : null}
                    </div>
                    <Image
                      src={feature.imageSrc}
                      alt={feature.imageAlt ?? ""}
                      width={595}
                      height={496}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="block h-auto w-full max-w-none shrink-0"
                    />
                  </>
                ) : (
                  textBlock
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
