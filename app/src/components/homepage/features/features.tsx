import Image from "next/image";
import { features } from "./data";
import { FeatureCard } from "./feature-card";

export function Features() {
  return (
    <>
      {features.map((feature, i) => (
        <FeatureCard
          key={i}
          header={feature.header}
          title={feature.title}
          description={feature.description}
          link={feature.link}
        >
          {feature.video ? (
            <video
              src={feature.video}
              autoPlay
              loop
              muted
              title={feature.title}
              className="relative aspect-auto z-1 w-full rounded-md object-cover border border-border/50 shadow-lg"
            />
          ) : null}
          {feature.image ? (
            <Image src={feature.image} alt={feature.title} className="" />
          ) : null}
          {feature.component ? feature.component : null}
        </FeatureCard>
      ))}
    </>
  );
}
