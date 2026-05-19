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
 * On hover: dot grid (`::before`) + honey → periwinkle gradient dots at the cursor. Reduced motion: hidden.
 */
export function HeroHeadingDots({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });

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

    const onMove = (e: MouseEvent) => updateFromEvent(e.clientX, e.clientY);

    el.addEventListener("mousemove", onMove);

    return () => {
      el.removeEventListener("mousemove", onMove);
    };
  }, [updateFromEvent]);

  return (
    <div
      ref={wrapRef}
      className={cn(
        "hero-heading-dots hero-heading-dots--wide relative mx-auto w-full overflow-visible pt-2 pb-2 sm:pt-2.5 sm:pb-2.5",
        className,
      )}
    >
      <div
        aria-hidden
        className="hero-heading-dots-glow pointer-events-none absolute motion-reduce:hidden"
        style={
          {
            "--hero-heading-glow-x": `${pos.x}%`,
            "--hero-heading-glow-y": `${pos.y}%`,
          } as CSSProperties
        }
      />
      <div className="relative z-[2] overflow-visible">{children}</div>
    </div>
  );
}
