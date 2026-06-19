import Image from "next/image";
import type { PropsWithChildren } from "react";
import { features } from "./data";
import { FeatureCard } from "./feature-card";

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
    <>
      {features.map((feature, i) => (
        <FeatureCard
          key={i}
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
              <Image src={feature.image} alt={feature.titleText} className="" />
            ) : null}
            {feature.component ?? null}
          </FeatureMedia>
        </FeatureCard>
      ))}
    </>
  );
}
