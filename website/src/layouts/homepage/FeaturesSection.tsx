import Image from "next/image";

import { cn } from "~/lib/utils";

/** All feature illustrations are exported at the same pixel size (see `public/_docs.page/assets/v4/`). */
const FEATURE_ILLUSTRATION_WIDTH = 3546;
const FEATURE_ILLUSTRATION_HEIGHT = 2976;

/** Bump when replacing PNGs in `public/` so Next image optimizer fetches the new file. */
const FEATURE_ASSETS_VERSION = "20250519";

function featureImageSrc(path: string) {
  return `${path}?v=${FEATURE_ASSETS_VERSION}`;
}

const FEATURE_IMAGE_PUBLIC = {
  githubPublishing: featureImageSrc(
    "/_docs.page/assets/v4/github-publishing.png",
  ),
  nativeSearch: featureImageSrc("/_docs.page/assets/v4/native-search.png"),
  shadcnTheming: featureImageSrc("/_docs.page/assets/v4/shadcn-theming.png"),
  agentNative: featureImageSrc("/_docs.page/assets/v4/agent-native.png"),
} as const;

type Feature = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  /** When true, illustration is on the leading side on `md+` (copy on the right). */
  imageLeading?: boolean;
  subtitle?: string;
  subtitleItems?: string[];
  description: string;
  ecosystemTitle?: boolean;
  honeySubstring?: string;
  titleAccent: "lavender" | "teal" | "warmOrange" | "coral";
};

const FEATURES: Feature[] = [
  {
    title: "GitHub Publishing",
    description:
      "Publish Markdown directly from your GitHub repository and preview docs from any branch, pull request, or commit. Keep docs in your normal Git workflow with no build scripts, npm installs, CI/CD bloat, or hosting setup.",
    ecosystemTitle: true,
    honeySubstring: "GitHub",
    titleAccent: "lavender",
    imageSrc: FEATURE_IMAGE_PUBLIC.githubPublishing,
    imageAlt:
      "Illustration: publish documentation directly from a GitHub repository",
  },
  {
    title: "Native search",
    description:
      "Give users built-in documentation search without configuring a third-party indexer or maintaining extra search infrastructure.",
    ecosystemTitle: true,
    honeySubstring: "Native",
    titleAccent: "teal",
    imageSrc: FEATURE_IMAGE_PUBLIC.nativeSearch,
    imageAlt:
      "Illustration: built-in documentation search in the docs interface",
    imageLeading: true,
  },
  {
    title: "Shadcn Theming",
    description:
      "Launch polished documentation with modern Shadcn themes, custom domains, logos, and branding. Make your project look credible without writing custom CSS or paying for enterprise branding.",
    ecosystemTitle: true,
    honeySubstring: "Shadcn",
    titleAccent: "warmOrange",
    imageSrc: FEATURE_IMAGE_PUBLIC.shadcnTheming,
    imageAlt:
      "Illustration: Shadcn-style documentation themes, domains, and branding",
  },
  {
    title: "Agent-native",
    subtitleItems: [
      "llms.txt",
      "MCP support",
      "AI assistant",
      "serve markdown",
    ],
    description:
      "Serve clean Markdown, llms.txt, and /mcp endpoints from the same docs site, with AI assistant support for agentic workflows. Help developers and AI tools access accurate project knowledge without manual copying or scraping.",
    ecosystemTitle: true,
    titleAccent: "coral",
    imageSrc: FEATURE_IMAGE_PUBLIC.agentNative,
    imageAlt:
      "Illustration: agent-readable docs with llms.txt, MCP, and markdown endpoints",
    imageLeading: true,
  },
];

const FEATURE_ROW_CLASS =
  "grid w-full min-w-0 grid-cols-1 overflow-visible py-8 md:grid-cols-2 md:items-stretch md:gap-0 md:py-0";

const FEATURE_COL_BASE =
  "min-h-full min-w-0 self-stretch overflow-visible";

/** Center rule: always on column 1’s trailing edge so every row shares the same axis. */
const FEATURE_COL_FIRST = `${FEATURE_COL_BASE} md:border-r md:border-border`;

/** Matches row surface; helps transparent PNG edges align with other illustrations. */
const FEATURE_IMAGE_COL = `${FEATURE_COL_BASE} bg-card/60 dark:bg-marketing-platform-inner-dark/80`;

const FEATURE_COPY_CLASS =
  "flex min-w-0 flex-col gap-4 p-8 text-left sm:p-10 md:justify-start md:p-12 lg:gap-5 lg:p-16";

const FEATURE_IMAGE_CLASS = "block h-auto w-full max-w-full";

export function FeaturesSection() {
  return (
    <section
      className="mx-auto min-w-0 w-full max-w-8xl overflow-visible px-4"
      aria-label="Features"
    >
      <div className="min-w-0 overflow-visible rounded-none border border-border">
        <ul className="divide-y divide-border">
          {FEATURES.map((feature) => {
            const titleClassName =
              feature.titleAccent === "lavender"
                ? "font-marketing-heading text-xl font-light leading-snug text-[hsl(var(--color-brand-lavender))] sm:text-2xl"
                : feature.titleAccent === "teal"
                  ? "font-marketing-heading text-xl font-light leading-snug text-[hsl(var(--color-brand-teal))] sm:text-2xl"
                  : feature.titleAccent === "warmOrange"
                    ? "font-marketing-heading text-xl font-light leading-snug text-[hsl(var(--color-brand-warm-orange))] sm:text-2xl"
                    : feature.titleAccent === "coral"
                      ? "font-marketing-heading text-xl font-light leading-snug text-[hsl(var(--color-brand-coral-red))] sm:text-2xl"
                      : "font-marketing-heading text-xl font-light leading-snug text-foreground sm:text-2xl";

            const ecosystemHeadingClass =
              "font-marketing-heading text-2xl font-light leading-snug text-balance text-gray-950 dark:text-white sm:text-3xl";

            const honeyStart =
              feature.honeySubstring && feature.honeySubstring.length > 0 ?
                feature.title.indexOf(feature.honeySubstring)
              : -1;

            const hasHoneyHighlight =
              Boolean(feature.ecosystemTitle) &&
              Boolean(feature.honeySubstring) &&
              honeyStart >= 0;

            let titleMarkup: JSX.Element | null = null;

            if (feature.ecosystemTitle) {
              if (hasHoneyHighlight && feature.honeySubstring) {
                const i = honeyStart as number;
                const k = feature.honeySubstring.length;
                titleMarkup = (
                  <h3 className={ecosystemHeadingClass}>
                    {feature.title.slice(0, i)}
                    <span className="text-marketing-accent">
                      {feature.honeySubstring}
                    </span>
                    {feature.title.slice(i + k)}
                  </h3>
                );
              } else {
                titleMarkup = (
                  <h3 className={ecosystemHeadingClass}>{feature.title}</h3>
                );
              }
            }

            const copyColumn = (
              <div className={FEATURE_COPY_CLASS}>
                {titleMarkup ? (
                  titleMarkup
                ) : (
                  <h3 className={titleClassName}>{feature.title}</h3>
                )}
                {feature.subtitleItems?.length ? (
                  <ul className="list-disc space-y-1 pl-5 text-sm font-light leading-relaxed text-marketing-accent sm:text-base">
                    {feature.subtitleItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : feature.subtitle ? (
                  <p className="text-sm font-light leading-snug text-gray-500 dark:text-gray-400">
                    {feature.subtitle}
                  </p>
                ) : null}
                <p className="text-sm font-light leading-relaxed text-gray-400 sm:text-base">
                  {feature.description}
                </p>
              </div>
            );

            const imageColumn = (
              <Image
                key={feature.imageSrc}
                src={feature.imageSrc}
                alt={feature.imageAlt}
                width={FEATURE_ILLUSTRATION_WIDTH}
                height={FEATURE_ILLUSTRATION_HEIGHT}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={FEATURE_IMAGE_CLASS}
                unoptimized={process.env.NODE_ENV === "development"}
              />
            );

            return (
              <li key={feature.title} className="overflow-visible">
                <article className="overflow-visible bg-card/60 px-0 py-0 dark:bg-marketing-platform-inner-dark/80">
                  <div className={FEATURE_ROW_CLASS}>
                    {feature.imageLeading ? (
                      <>
                        <div className={cn(FEATURE_IMAGE_COL, FEATURE_COL_FIRST)}>
                          {imageColumn}
                        </div>
                        <div className={FEATURE_COL_BASE}>{copyColumn}</div>
                      </>
                    ) : (
                      <>
                        <div className={FEATURE_COL_FIRST}>{copyColumn}</div>
                        <div className={cn(FEATURE_IMAGE_COL, "mt-8 md:mt-0")}>
                          {imageColumn}
                        </div>
                      </>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
