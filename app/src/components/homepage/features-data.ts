import type { StaticImageData } from "next/image";

import agentReadyPoster from "./assets/agent-ready.gif";
import gitPublishingImage from "./assets/git-publishing.png";
import intelligentSearchPoster from "./assets/intelligent-search.png";
import markdownComponentsPoster from "./assets/markdown-components.png";
import preset1Image from "./assets/preset-1.png";
import versionManagementImage from "./assets/version-management.png";
import { homepageVideos } from "./homepage-videos";

export type FeatureCustomMedia = "themePresets";

export type FeatureMediaGlowPosition = "gitPublishing";

export type FeatureItem = {
  id: string;
  /** Heading in the card body (sentence case). */
  title: string;
  /** First word highlighted in tab header (must match start of stackTitle). */
  honeySubstring: string;
  /** Uppercase tab label, e.g. "Agent access". */
  stackTitle: string;
  description: string;
  ctaHref: string;
  image: StaticImageData;
  imageAlt: string;
  video?: string;
  customMedia?: FeatureCustomMedia;
  /** Slightly larger static image in the media column. */
  mediaEnlarged?: boolean;
  /** Per-card halo placement override. */
  mediaGlowPosition?: FeatureMediaGlowPosition;
};

export const FEATURES: FeatureItem[] = [
  {
    id: "agent-access",
    title: "Agent access",
    stackTitle: "Agent access",
    honeySubstring: "Agent",
    description:
      "Let users' AI agents query your documentation. Built-in MCP servers alongside llms.txt files allow LLMs to ingest your product context instantly.",
    ctaHref: "/agent-access",
    image: agentReadyPoster,
    imageAlt: "Agent-accessible documentation with MCP and llms.txt",
    video: homepageVideos.agentAccess,
  },
  {
    id: "git-publishing",
    title: "Git publishing",
    stackTitle: "Git publishing",
    honeySubstring: "Git",
    description:
      "Deploy updates directly from your software repository. Eliminate build pipelines, hosting configuration, or infrastructure maintenance.",
    ctaHref: "/get-started",
    image: gitPublishingImage,
    imageAlt: "Publishing documentation directly from a Git repository",
    mediaGlowPosition: "gitPublishing",
  },
  {
    id: "intelligent-search",
    title: "Intelligent search",
    stackTitle: "Intelligent search",
    honeySubstring: "Intelligent",
    description:
      "Index content automatically and provide an embedded AI chat. Locate information instantly without third-party tracking scripts or external setup.",
    ctaHref: "/get-started",
    image: intelligentSearchPoster,
    imageAlt: "Built-in documentation search in the docs interface",
    video: homepageVideos.intelligentSearch,
  },
  {
    id: "markdown-components",
    title: "Markdown components",
    stackTitle: "Markdown components",
    honeySubstring: "Markdown",
    description:
      "Add interactive components to your docs with MDX for richer experiences than standard Markdown.",
    ctaHref: "/get-started",
    image: markdownComponentsPoster,
    imageAlt: "Interactive documentation components embedded in markdown",
    video: homepageVideos.markdownComponents,
  },
  {
    id: "version-management",
    title: "Version management",
    stackTitle: "Version management",
    honeySubstring: "Version",
    description:
      "Support multiple software versions simultaneously. Keep legacy guides or localised translations organised for your users.",
    ctaHref: "/get-started",
    image: versionManagementImage,
    imageAlt: "Managing multiple documentation versions and translations",
    mediaEnlarged: true,
  },
  {
    id: "modern-interface",
    title: "Modern interface",
    stackTitle: "Modern interface",
    honeySubstring: "Modern",
    description:
      "Style your docs site using shadcn/ui design standards. Customize components easily to match your brand identity.",
    ctaHref: "/get-started",
    image: preset1Image,
    imageAlt: "Interactive theme preset preview for documentation styling",
    customMedia: "themePresets",
  },
];
