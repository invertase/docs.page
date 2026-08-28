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

export function Features() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const lockY = useRef<number | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const cards = () => [
      ...inner.querySelectorAll<HTMLElement>("[data-stack-card]"),
    ];

    const pinInner = () => {
      const rect = outer.getBoundingClientRect();
      inner.style.position = "fixed";
      inner.style.top = "0px";
      inner.style.left = `${rect.left}px`;
      inner.style.width = `${rect.width}px`;
      inner.style.height = `${window.innerHeight}px`;
      inner.style.zIndex = "10";
    };

    const lock = () => {
      if (lockY.current != null) return;
      lockY.current = window.scrollY;
      outer.style.height = `${inner.offsetHeight}px`;
      pinInner();
      for (const card of cards()) {
        card.style.position = "absolute";
        card.style.top = "0px";
        card.style.left = "0px";
        card.style.right = "0px";
        card.style.marginTop = "0px";
      }
    };

    const unlock = () => {
      if (lockY.current == null) return;
      lockY.current = null;
      outer.style.height = "";
      inner.style.position = "";
      inner.style.top = "";
      inner.style.left = "";
      inner.style.width = "";
      inner.style.height = "";
      inner.style.zIndex = "";
      inner.style.transform = "";
      for (const card of cards()) {
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.right = "";
        card.style.marginTop = "";
      }
    };

    const onScroll = () => {
      const last = cards().at(-1);
      if (!last) return;
      if (lockY.current == null) {
        if (last.getBoundingClientRect().top <= 1) lock();
        return;
      }
      const progress = window.scrollY - lockY.current;
      if (progress < 0) {
        unlock();
        return;
      }
      pinInner();
      inner.style.transform = `translateY(${-progress}px)`;
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
    <div ref={outerRef}>
      <div ref={innerRef}>
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
    </div>
  );
}
