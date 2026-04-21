import Image from "next/image";

import { FeatureCell } from "./FeatureCell";
import { FeaturesScrollStrip } from "./FeaturesScrollStrip";

const V3 = "/_docs.page/assets/v3";

const ICON_PX = 37.5;

function FeatureIcon({ light, dark }: { light: string; dark: string }) {
  if (light === dark) {
    return (
      <Image
        src={light}
        alt=""
        width={ICON_PX}
        height={ICON_PX}
        className="size-[37.5px] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.24)] dark:drop-shadow-none"
        aria-hidden
      />
    );
  }
  return (
    <>
      <Image
        src={light}
        alt=""
        width={ICON_PX}
        height={ICON_PX}
        className="size-[37.5px] object-contain drop-shadow-[0_4px_4px_rgba(0,0,0,0.24)] dark:hidden"
        aria-hidden
      />
      <Image
        src={dark}
        alt=""
        width={ICON_PX}
        height={ICON_PX}
        className="hidden size-[37.5px] object-contain dark:block"
        aria-hidden
      />
    </>
  );
}

const features: {
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    icon: (
      <FeatureIcon light={`${V3}/github-light.svg`} dark={`${V3}/github.svg`} />
    ),
    title: "Made for GitHub",
    description:
      "Source your docs from GitHub repositories with instant deploys.",
  },
  {
    icon: (
      <FeatureIcon
        light={`${V3}/publish-light.svg`}
        dark={`${V3}/publish.svg`}
      />
    ),
    title: "Publish from your editor",
    description:
      "Write where you already work—your editor stays the source of truth.",
  },
  {
    icon: (
      <FeatureIcon light={`${V3}/reload-light.svg`} dark={`${V3}/reload.svg`} />
    ),
    title: "Local preview & hot reload",
    description:
      "See every edit instantly with local preview and fast feedback.",
  },
  {
    icon: (
      <FeatureIcon
        light={`${V3}/markdown-light.svg`}
        dark={`${V3}/markdown.svg`}
      />
    ),
    title: "Markdown powered",
    description:
      "Author in Markdown with components and shortcodes when you need more.",
  },
  {
    icon: (
      <FeatureIcon
        light={`${V3}/preview-light.svg`}
        dark={`${V3}/preview.svg`}
      />
    ),
    title: "Shareable preview links",
    description: "Share previews with reviewers before anything goes live.",
  },
  {
    icon: (
      <FeatureIcon light={`${V3}/theme-light.svg`} dark={`${V3}/theme.svg`} />
    ),
    title: "Custom domains & themes",
    description: "Use your own domain and tailor the look to match your brand.",
  },
  {
    icon: (
      <FeatureIcon
        light={`${V3}/components-light.svg`}
        dark={`${V3}/components.svg`}
      />
    ),
    title: "Pre-built components",
    description: "Tabs, callouts, code blocks, and more—ready out of the box.",
  },
  {
    icon: (
      <FeatureIcon light={`${V3}/search-light.svg`} dark={`${V3}/search.svg`} />
    ),
    title: "Powerful search",
    description:
      "Help readers find answers fast with built-in search integrations.",
  },
  {
    icon: (
      <FeatureIcon
        light={`${V3}/analytics-light.svg`}
        dark={`${V3}/analytics.svg`}
      />
    ),
    title: "Documentation analytics",
    description:
      "Understand what pages matter with Plausible or Google Analytics.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 pt-10 md:pt-12">
      <div className="flex flex-col items-start gap-4 pl-6 text-left sm:pl-8 md:pl-10">
        <h2 className="heading-h2 text-balance">
          Everything needed to publish <br className="md:hidden" aria-hidden />
          <span className="font-mono text-marketing-accent">polished</span>{" "}
          documentation
        </h2>
        <p className="w-full max-w-2xl text-pretty font-light leading-snug text-zinc-600 dark:text-zinc-300/80">
          Built to improve developer experience from first commit to production.
        </p>
      </div>

      <FeaturesScrollStrip className="w-full rounded-none">
        <div className="marketing-features-grid-inner grid w-full min-w-[114rem] grid-cols-[repeat(9,minmax(12rem,1fr))] items-start gap-3 overflow-visible py-5 sm:py-6">
          {features.map((f) => (
            <FeatureCell key={f.title} {...f} />
          ))}
        </div>
      </FeaturesScrollStrip>
    </section>
  );
}
