import Image from "next/image";
import type { CSSProperties, PropsWithChildren } from "react";
import { features } from "./data";
import { FeatureCard } from "./feature-card";

const stackStickyClass =
  "sticky top-[calc(var(--stack-base)+var(--stack-index)*var(--stack-step))] z-[calc(var(--stack-index)+1)]";

function FeatureMedia({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-5/3 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-periwinkle-400/25 blur-3xl"
        aria-hidden
      />
      {children}
    </div>
  );
}

export function Features() {
  return (
    <section className="relative [--stack-base:3rem] [--stack-step:1.5rem] lg:[--stack-base:5rem] lg:[--stack-step:3rem]">
      {features.map((feature, i) => (
        <div
          key={feature.titleText}
          className={stackStickyClass}
          style={{ "--stack-index": i } as CSSProperties}
        >
          <FeatureCard
            overlap={i === 0}
            title={feature.title}
            description={feature.description}
            link={feature.link}
          >
            <FeatureMedia>
              {feature.video ? (
                <video
                  src={feature.video}
                  autoPlay
                  loop
                  muted
                  title={feature.titleText}
                  className="relative aspect-auto z-1 w-full rounded-lg object-cover border border-border/50 shadow-lg"
                />
              ) : null}
              {feature.image ? (
                <Image
                  src={feature.image}
                  alt={feature.titleText}
                  className=""
                />
              ) : null}
              {feature.component ?? null}
            </FeatureMedia>
          </FeatureCard>
        </div>
      ))}
    </section>
  );
}
