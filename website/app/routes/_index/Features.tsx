import { Grid2X2Icon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/utils";

export function Features() {
  return (
    <section className="max-w-5xl mx-auto py-32 space-y-6">
      <p className="flex items-center gap-3 justify-center">
        <Grid2X2Icon size={18} />
        <span>Features</span>
      </p>
      <h3 className="text-brand-100 text-5xl text-center leading-[3.5rem]">
        Everything needed to
        <br />
        publish great documentation
      </h3>
      <p className="font-light text-brand-50 text-center">
        Built to improve developer experience
      </p>
      <div className="grid grid-cols-3 border-white/5 border-t border-l border-b">
        <FeatureCard
          icon={<div />}
          title="Seamless GitHub Integration"
          description="Source your docs directly from your GitHub repositories for easy updates."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Editing"
          description="Editing workflow built into where you work."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Local Preview & Hot Reload"
          description="See your changes instantly as you type, streamlining your workflow."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Markdown-Powered"
          description="Write your documentation in the simple and intuitive Markdown format."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Pre-Built Components"
          description="Add code blocks, alerts, tabs, videos, and more with ease."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Preview Deployments"
          description="Review and share your changes before they go live."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Custom Domains & Themes"
          description="Make your docs truly your own with a personalised domain, look and feel."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Custom Domains & Themes"
          description="Make your docs truly your own with a personalised domain, look and feel."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Powerful Search"
          description="Help users find information quickly with configurable search functionality."
          className="border-b"
        />
        <FeatureCard
          icon={<div />}
          title="Documentation Analytics"
          description="Understand what users are viewing using Google Analytics or Plausible."
          className="border-b"
        />
        <div className="border-r border-white/5" />
        <div className="border-r border-white/5" />
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
      className={cn("p-6 space-y-3 border-r border-white/5", className)}
    >
      <div className="size-[30px] bg-white/10">{icon}</div>
      <h4 className="">{title}</h4>
      <p className="font-light">{description}</p>
    </div>
  );
}
