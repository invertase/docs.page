"use client";

import Image from "next/image";
import { type PropsWithChildren, useEffect, useRef } from "react";
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

export function Features({ children }: PropsWithChildren) {
  const spacerRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const lockY = useRef<number | null>(null);
  const adjusting = useRef(false);

  useEffect(() => {
    const spacer = spacerRef.current;
    const stack = stackRef.current;
    if (!spacer || !stack) return;

    const cards = () => [
      ...stack.querySelectorAll<HTMLElement>("[data-stack-card]"),
    ];

    const lock = () => {
      if (lockY.current != null) return;
      const last = cards().at(-1);
      if (!last) return;

      const gap =
        last.getBoundingClientRect().top - stack.getBoundingClientRect().top;
      const pileHeight = last.offsetHeight;

      adjusting.current = true;
      spacer.style.height = `${Math.max(0, gap)}px`;
      stack.style.height = `${pileHeight}px`;
      stack.style.position = "relative";
      for (const card of cards()) {
        card.style.position = "absolute";
        card.style.top = "0px";
        card.style.left = "0px";
        card.style.right = "0px";
        card.style.marginTop = "0px";
      }
      lockY.current = window.scrollY;
      adjusting.current = false;
    };

    const unlock = () => {
      if (lockY.current == null) return;
      adjusting.current = true;
      lockY.current = null;
      spacer.style.height = "";
      stack.style.height = "";
      stack.style.position = "";
      for (const card of cards()) {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.right = "";
        card.style.marginTop = "";
      }
      adjusting.current = false;
    };

    const onScroll = () => {
      if (adjusting.current) return;
      const last = cards().at(-1);
      if (!last) return;
      if (lockY.current == null) {
        if (last.getBoundingClientRect().top <= 1) lock();
        return;
      }
      if (window.scrollY < lockY.current) unlock();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      unlock();
    };
  }, []);

  return (
    <div style={{ overflowAnchor: "none" }}>
      <div ref={spacerRef} aria-hidden className="pointer-events-none" />
      <div ref={stackRef}>
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
                <Image
                  src={feature.image}
                  alt={feature.titleText}
                  className=""
                />
              ) : null}
              {feature.component ?? null}
            </FeatureMedia>
          </FeatureCard>
        ))}
      </div>
      {children}
    </div>
  );
}
