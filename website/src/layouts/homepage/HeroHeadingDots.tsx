"use client";

import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn } from "~/lib/utils";

/**
 * Dot-masked primary glow on hover only — no always-visible grid (same masking idea as
 * `.homepage-spot-glow`), coordinates relative to this box.
 */
export function HeroHeadingDots({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const updateFromEvent = useCallback((clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const w = rect.width || 1;
    const h = rect.height || 1;
    setPos({
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / w) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / h) * 100)),
    });
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);
    const onMove = (e: MouseEvent) => updateFromEvent(e.clientX, e.clientY);

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousemove", onMove);
    };
  }, [updateFromEvent]);

  return (
    <div
      ref={wrapRef}
      className="hero-heading-dots relative mx-auto w-full max-w-full pt-0 pb-16 sm:pb-20 -mb-14 sm:-mb-[4.25rem]"
    >
      <div
        aria-hidden
        className={cn(
          "hero-heading-dots-glow pointer-events-none absolute inset-0 motion-reduce:hidden -translate-y-3 sm:-translate-y-4 md:-translate-y-5",
          "transition-opacity duration-200 ease-out",
          hovered ? "opacity-100" : "opacity-0",
        )}
        style={
          {
            "--hero-heading-glow-x": `${pos.x}%`,
            "--hero-heading-glow-y": `${pos.y}%`,
          } as CSSProperties
        }
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
