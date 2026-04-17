import { cn } from "~/lib/utils";

import { PlatformFeatureCard } from "./PlatformFeatureCard";

const asset = (base: string) => ({
  light: `/_docs.page/assets/${base}-light.png`,
  dark: `/_docs.page/assets/${base}.png`,
});

/** Single 1px edges: outer frame + right/bottom segments only (avoids doubled borders between tiles). */
const platformGridTileShell = cn(
  "md:col-span-2",
  "border-b border-zinc-300 dark:border-zinc-700",
  "last:border-b-0",
  "md:border-r md:[&:nth-child(n+4)]:border-b-0 md:[&:nth-child(3n)]:border-r-0",
  /* Row 2 leaves cols 5–6 empty; the 5th tile keeps a right edge so it doesn’t open into that gap. */
);

const platformGridCardClassName = "h-full border-0 !shadow-none";

export function Platform() {
  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 pb-10 pt-10">
      <div className="flex flex-col items-start gap-4 pl-6 text-left">
        <h2 className="heading-h2">
          Documentation made{" "}
          <span className="font-mono text-marketing-accent">simple</span>
        </h2>
        <p className="w-fit max-w-none whitespace-nowrap font-light text-muted-foreground/70">
          The easiest way to maintain open-source documentation alongside your
          codebase.
        </p>
      </div>

      <div className="border border-zinc-300 dark:border-zinc-700">
        <div className="grid gap-0 md:grid-cols-6">
          <div className={platformGridTileShell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("publish-instantly")}
              imageSize="large"
              title="Publish Instantly"
              description="Create fully managed documentation sites in seconds, without complex setup."
            />
          </div>
          <div className={platformGridTileShell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("manage-docs-as-code")}
              imageSize="large"
              title="Manage docs as code"
              description="Branch, review, and version your docs like the rest of your project."
            />
          </div>
          <div className={platformGridTileShell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("collaborate-with-live-preview")}
              imageSize="large"
              title="Collaborate with Live Preview"
              titleClassName="whitespace-nowrap"
              description="Write Markdown and see changes in real time. Share preview links for feedback."
            />
          </div>
          <div className={platformGridTileShell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("cutomise-and-theme")}
              title="Customise and Theme"
              description="Tailor colors, typography, and layout so documentation feels native to your product."
            />
          </div>
          <div className={platformGridTileShell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("polished-by-default")}
              title="Polished by Default"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
