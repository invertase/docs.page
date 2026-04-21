import { cn } from "~/lib/utils";

import { PlatformFeatureCard } from "./PlatformFeatureCard";

/** v3 art (single file) — use until light/dark pairs exist under `v3/`. */
const v3Asset = (name: string) => {
  const u = `/_docs.page/assets/v3/${name}.png`;
  return { light: u, dark: u };
};

/** Single 1px edges: outer frame + right/bottom segments only (avoids doubled borders between tiles). */
const platformGridTileShell = cn(
  "md:col-span-2",
  "border-b border-zinc-700 dark:border-zinc-700",
  "last:border-b-0",
  /* Tablet (md–1023): 2 columns — right edge on odd columns; even columns share the internal divider */
  "md:max-lg:border-r md:max-lg:[&:nth-child(2n)]:border-r-0",
  /* Desktop (lg+): 3 columns */
  "lg:border-r lg:[&:nth-child(n+4)]:border-b-0 lg:[&:nth-child(3n)]:border-r-0",
);

const platformGridCardClassName = "min-h-0 flex-1 border-0 !shadow-none";

/** Matches `PlatformFeatureCard` overlay min-heights so rows stay even when a slot has no card. */
const platformGridRowMinHeight =
  "min-h-[21rem] sm:min-h-[22.5rem] md:min-h-[24rem] lg:min-h-[26.25rem]";

const platformGridCell = cn(
  platformGridTileShell,
  /* Black only behind tiles — reserved empty slot uses transparent shell. */
  "flex h-full min-h-0 flex-col bg-black dark:bg-transparent",
);

/** Top-left grid slot: section intro (same copy as former block above the grid). */
const platformGridIntroCell = cn(
  platformGridTileShell,
  platformGridRowMinHeight,
  "flex flex-col items-start justify-center gap-4 bg-transparent pt-5 pr-5 pb-5 pl-6 text-left sm:pt-6 sm:pr-6 sm:pb-6 sm:pl-8 md:pt-8 md:pr-8 md:pb-8 md:pl-10",
);

export function Platform() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="border border-zinc-700 dark:border-zinc-700">
        <div className="grid gap-0 md:grid-cols-4 lg:grid-cols-6">
          <div className={platformGridIntroCell}>
            <h2 className="heading-h2 text-balance">
              Documentation made{" "}
              <span className="font-mono text-marketing-accent">simple</span>
            </h2>
            <p className="w-full max-w-[min(100%,28rem)] text-pretty font-light leading-snug text-zinc-600 dark:text-zinc-300/80">
              The easiest way to maintain open-source documentation alongside your
              codebase.
            </p>
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={v3Asset("publish-instantly")}
              imageLayout="overlay"
              title="Publish Instantly"
              description="Create fully managed documentation sites in seconds, without complex setup."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={v3Asset("manage-docs-as-code")}
              imageLayout="overlay"
              title="Manage docs as code"
              description="Branch, review, and version your docs like the rest of your project."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={v3Asset("collaborate-with-live-preview")}
              imageLayout="overlay"
              title="Collaborate with Live Preview"
              description="Write Markdown and see changes in real time. Share preview links for feedback."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={v3Asset("customise-and-theme")}
              imageLayout="overlay"
              title="Customise and Theme"
              description="Tailor colors, typography, and layout so documentation feels native to your product."
            />
          </div>
          <div className={platformGridCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              image={v3Asset("polished-by-default")}
              imageLayout="overlay"
              title="Polished by Default"
              description="Publish visually stunning, responsive documentation sites straight out of the box."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
