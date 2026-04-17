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
  /* Tablet (md–1023): 2 columns — right edge on odd columns; even columns share the internal divider */
  "md:max-lg:border-r md:max-lg:[&:nth-child(2n)]:border-r-0",
  /* Desktop (lg+): 3 columns */
  "lg:border-r lg:[&:nth-child(n+4)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0",
);

const platformGridCardClassName = "min-h-0 flex-1 border-0 !shadow-none";

const platformGridCell = cn(
  platformGridTileShell,
  "flex h-full min-h-0 flex-col",
);

export function Platform() {
  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 pb-10 pt-10">
      <div className="flex flex-col items-start gap-4 pl-6 text-left">
        <h2 className="heading-h2">
          Documentation made{" "}
          <span className="font-mono text-marketing-accent">simple</span>
        </h2>
        <p className="w-full max-w-2xl text-pretty font-light leading-snug text-muted-foreground/70">
          The easiest way to maintain open-source documentation alongside your
          codebase.
        </p>
      </div>

      <div className="border border-zinc-300 dark:border-zinc-700">
        <div className="grid gap-0 md:grid-cols-4 lg:grid-cols-6">
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("publish-instantly")}
              imageSize="large"
              title="Publish Instantly"
              description="Create fully managed documentation sites in seconds, without complex setup."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("manage-docs-as-code")}
              imageSize="large"
              title="Manage docs as code"
              description="Branch, review, and version your docs like the rest of your project."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("collaborate-with-live-preview")}
              imageSize="large"
              title="Collaborate with Live Preview"
              description="Write Markdown and see changes in real time. Share preview links for feedback."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={asset("cutomise-and-theme")}
              title="Customise and Theme"
              description="Tailor colors, typography, and layout so documentation feels native to your product."
            />
          </div>
          <div className={platformGridCell}>
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
