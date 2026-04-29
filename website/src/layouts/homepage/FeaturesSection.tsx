import Image from "next/image";

type Feature = {
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className: string;
    sizes: string;
  };
};

const FEATURES: Feature[] = [
  {
    title: "Ship with your Code",
    description:
      "Publish directly from GitHub with PR, branch, and commit previews.",
    image: {
      src: "/_docs.page/assets/v4/docs-as-code.png",
      alt: "Docs as code: ship documentation with your repository",
      width: 560,
      height: 280,
      className:
        "h-auto w-auto max-w-[340px] object-contain sm:max-w-[360px]",
      sizes: "(max-width: 768px) 340px, 360px",
    },
  },
  {
    title: "Built for AI Agents",
    description:
      "Native llms.txt, /mcp, and .md routes make it effortless for tools like Cursor and Copilot to ingest your docs. By providing a structured feed, you ensure that AI agents can accurately reference your content.",
    image: {
      src: "/_docs.page/assets/v4/built-for-ai-agents.png",
      alt: "Built for AI agents: structured feeds for tools like Cursor and Copilot",
      width: 640,
      height: 320,
      className:
        "h-auto w-auto max-w-[380px] object-contain sm:max-w-[400px]",
      sizes: "(max-width: 768px) 380px, 400px",
    },
  },
  {
    title: "Designed for Great DX",
    description:
      "Get a production-ready documentation site with custom themes, native search, and interactive AI tools as standard.",
    image: {
      src: "/_docs.page/assets/v4/great-dx.png",
      alt: "Designed for great DX: themes, search, and interactive AI tools",
      width: 560,
      height: 280,
      className:
        "h-auto w-auto max-w-[340px] object-contain sm:max-w-[360px]",
      sizes: "(max-width: 768px) 340px, 360px",
    },
  },
];

export function FeaturesSection() {
  return (
    <section
      className="mx-auto min-w-0 w-full max-w-8xl overflow-x-clip px-4"
      aria-label="Features"
    >
      <div className="min-w-0 border-t border-border">
        <div className="mx-auto grid max-w-8xl grid-cols-1 gap-0 divide-y divide-border border border-border md:grid-cols-3 md:divide-x md:divide-y-0">
          {FEATURES.map((feature) => {
            const textBlock = (
              <div className="mt-auto flex flex-col gap-3 pt-5">
                <h3 className="font-heading text-base font-medium leading-snug text-foreground sm:text-[17px]">
                  {feature.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-zinc-600 dark:text-zinc-300/85">
                  {feature.description}
                </p>
              </div>
            );

            const imageEl = feature.image ? (
              <div className="flex w-full shrink-0 justify-center">
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  width={feature.image.width}
                  height={feature.image.height}
                  className={feature.image.className}
                  sizes={feature.image.sizes}
                />
              </div>
            ) : null;

            return (
            <article
              key={feature.title}
              className="flex h-full min-h-0 flex-col bg-card/60 px-5 py-6 dark:bg-marketing-platform-inner-dark/80 sm:px-6 sm:py-7"
            >
              {imageEl}
              {textBlock}
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
