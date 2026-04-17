import {
  BarChart2Icon,
  ComponentIcon,
  EyeIcon,
  GithubIcon,
  GlobeIcon,
  Heading1Icon,
  PencilIcon,
  RefreshCcwDotIcon,
  SearchIcon,
  SwatchBookIcon,
} from "lucide-react";

import { FeatureCell } from "./FeatureCell";
import { FeaturesScrollStrip } from "./FeaturesScrollStrip";

const features: {
  icon: React.ReactNode;
  title: string;
  description: string;
}[] = [
  {
    icon: <GithubIcon className="size-6" />,
    title: "Made for GitHub",
    description:
      "Source your docs from GitHub repositories with instant deploys.",
  },
  {
    icon: <PencilIcon className="size-6" />,
    title: "Publish from your editor",
    description:
      "Write where you already work—your editor stays the source of truth.",
  },
  {
    icon: <RefreshCcwDotIcon className="size-6" />,
    title: "Local preview & hot reload",
    description:
      "See every edit instantly with local preview and fast feedback.",
  },
  {
    icon: <Heading1Icon className="size-6" />,
    title: "Markdown powered",
    description:
      "Author in Markdown with components and shortcodes when you need more.",
  },
  {
    icon: <ComponentIcon className="size-6" />,
    title: "Pre-built components",
    description: "Tabs, callouts, code blocks, and more—ready out of the box.",
  },
  {
    icon: <EyeIcon className="size-6" />,
    title: "Shareable preview links",
    description: "Share previews with reviewers before anything goes live.",
  },
  {
    icon: <GlobeIcon className="size-6" />,
    title: "Custom domains & themes",
    description: "Use your own domain and tailor the look to match your brand.",
  },
  {
    icon: <SearchIcon className="size-6" />,
    title: "Powerful search",
    description:
      "Help readers find answers fast with built-in search integrations.",
  },
  {
    icon: <BarChart2Icon className="size-6" />,
    title: "Documentation analytics",
    description:
      "Understand what pages matter with Plausible or Google Analytics.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 pt-4">
      <div className="flex flex-col items-start gap-4 pl-6 text-left">
        <h2 className="heading-h2">
          Everything needed to publish{" "}
          <span className="font-mono text-marketing-accent">polished</span>{" "}
          documentation
        </h2>
        <p className="w-fit max-w-none whitespace-nowrap font-light text-muted-foreground/70">
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
