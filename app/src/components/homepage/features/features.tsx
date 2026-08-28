"use client";

import Image from "next/image";
import { type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { features } from "./data";
import { FeatureCard } from "./feature-card";

function stretchStack(container: HTMLElement) {
  const cards = [
    ...container.querySelectorAll<HTMLElement>("[data-stack-card]"),
  ];
  if (cards.length === 0) return;
  const parentHeight = container.scrollHeight;
  const metrics = cards.map((card) => {
    const inner = card.firstElementChild as HTMLElement | null;
    return {
      card,
      top: card.offsetTop,
      visual: inner?.offsetHeight ?? card.offsetHeight,
    };
  });
  for (const { card, top, visual } of metrics) {
    const extra = Math.max(0, parentHeight - top - visual);
    card.style.paddingBottom = extra ? `${extra}px` : "";
    card.style.marginBottom = extra ? `-${extra}px` : "";
  }
}

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
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;

    const apply = () => stretchStack(container);
    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(container);
    for (const card of container.querySelectorAll("[data-stack-card]")) {
      const inner = card.firstElementChild;
      if (inner) ro.observe(inner);
    }
    window.addEventListener("resize", apply);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <div ref={ref} className="relative -mb-[100svh]">
      {features.map((feature, i) => (
        <FeatureCard
          key={i}
          index={i}
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
      <div aria-hidden className="h-[100svh]" />
    </div>
  );
}
