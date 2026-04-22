import { cn } from "~/lib/utils";

import { PlatformFeatureCard } from "./PlatformFeatureCard";

const titleDuplicateDocs = (
  <>
    Cut duplicate documentation
    <br />
    work for development teams.
  </>
);

const titleScaleOverhead = (
  <>
    Scale docs quality without
    <br />
    scaling docs overhead.
  </>
);

const platformGridCardClassName = "h-full min-h-0 flex-1 border-0 !shadow-none";

const platformCell = cn(
  "flex h-full min-h-0 flex-col bg-black dark:bg-transparent",
);

export function Platform() {
  return (
    <section className="mx-auto w-full min-w-0 max-w-8xl px-4">
      <div>
        <div className="border-x border-zinc-700 dark:border-zinc-700">
          <div
            className={cn(
              "grid min-h-0 auto-rows-auto grid-cols-1 divide-y divide-zinc-700",
              "md:grid-cols-3 md:divide-x md:divide-y-0",
              "md:items-stretch",
              "dark:divide-zinc-700",
            )}
          >
          <div className={platformCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              imageLayout="overlay"
              title={titleDuplicateDocs}
              description="Turn codebase knowledge into production docs instead of rewriting the same information across README, docs site, and support content."
            />
          </div>
          <div className={platformCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              imageLayout="overlay"
              title="Give developers instant answers in-browser and in AI tools."
              description="Serve one documentation source for human reading and AI retrieval, so implementation is faster with less context switching."
            />
          </div>
          <div className={platformCell}>
            <PlatformFeatureCard
              className={platformGridCardClassName}
              imageLayout="overlay"
              title={titleScaleOverhead}
              description="Keep one versioned source of truth with predictable publishing, search, and machine-readable outputs."
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
