import {
  BarChart2Icon,
  ComponentIcon,
  EyeIcon,
  GithubIcon,
  Grid2X2Icon,
  Heading1Icon,
  PencilIcon,
  RefreshCcwDot,
  RefreshCcwDotIcon,
  SearchIcon,
  SwatchBookIcon,
} from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/utils";

export function Features() {
  return (
    <section className="max-w-5xl mx-auto py-20 space-y-6">
      <p className="md:flex text-center items-center justify-center gap-3 text-brand-50">
        <Grid2X2Icon size={18} className="mb-3 mx-auto md:m-0" />
        <span>Features</span>
      </p>
      <h3 className="text-brand-100 text-4xl md:text-5xl text-center !leading-[3.5rem]">
        Everything needed to
        <br />
        publish great documentation
      </h3>
      <p className="font-light text-brand-50 text-center">
        Built to improve developer experience
      </p>
      <div className="px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-white/5 border-t border-l border-b rounded-md bg-gradient-to-b from-brand-500/[.02]">
          <FeatureCard
            icon={<GithubIcon size={26} />}
            title="Seamless GitHub Integration"
            description="Source your docs directly from your GitHub repositories for easy updates."
            className="border-b"
          />
          <FeatureCard
            icon={<PencilIcon size={26} />}
            title="Editing"
            description="Editing workflow built into where you work."
            className="border-b"
          />
          <FeatureCard
            icon={<RefreshCcwDotIcon size={26} />}
            title="Local Preview & Hot Reload"
            description="See your changes instantly as you type, streamlining your workflow."
            className="border-b"
          />
          <FeatureCard
            icon={<Heading1Icon size={26} />}
            title="Markdown-Powered"
            description="Write your documentation in the simple and intuitive Markdown format."
            className="border-b"
          />
          <FeatureCard
            icon={<ComponentIcon size={26} />}
            title="Pre-Built Components"
            description="Add code blocks, alerts, tabs, videos, and more with ease."
            className="border-b"
          />
          <FeatureCard
            icon={<EyeIcon size={26} />}
            title="Preview Deployments"
            description="Review and share your changes before they go live."
            className="border-b"
          />
          <FeatureCard
            icon={<SwatchBookIcon size={26} />}
            title="Custom Domains & Themes"
            description="Make your docs truly your own with a personalised domain, look and feel."
            className="border-b"
          />
          <FeatureCard
            icon={<SearchIcon size={26} />}
            title="Powerful Search"
            description="Help users find information quickly with configurable search functionality."
            className="border-b"
          />
          <FeatureCard
            icon={<BarChart2Icon />}
            title="Documentation Analytics"
            description="Understand what users are viewing using Google Analytics or Plausible."
            className="border-b"
          />
          <div className="hidden lg:block border-r border-white/5" />
          <div className="hidden lg:block border-r border-white/5" />
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
} & ComponentProps<"div">;

function FeatureCard({
  icon,
  title,
  description,
  className,
  ...other
}: FeatureCardProps) {
  return (
    <div
      {...other}
      className={cn(
        "p-6 space-y-3 border-r border-white/5 text-center md:text-left",
        className,
      )}
    >
      <div className="size-[30px] text-brand-100 mx-auto md:mx-0">{icon}</div>
      <h4 className="">{title}</h4>
      <p className="font-light">{description}</p>
    </div>
  );
}
