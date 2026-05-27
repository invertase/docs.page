"use client";

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

import { cn } from "~/lib/utils";

/**
 * Dot-only glow: sets `--homepage-glow-x/y` for `.homepage-spot-glow`, which is
 * masked to the same dot grid as `::before` (see global.css).
 */
export function HomepageSpotGridShell({ children }: { children: ReactNode }) {
  /** Viewport px — matches `background-attachment: fixed` on `.homepage-spot-grid::before`. */
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setPos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="homepage-spot-grid min-h-screen">
      <div
        className={cn(
          "homepage-spot-glow pointer-events-none motion-reduce:hidden",
        )}
        style={
          {
            "--homepage-glow-x": `${pos.x}px`,
            "--homepage-glow-y": `${pos.y}px`,
          } as CSSProperties
        }
        aria-hidden
      />
      {children}
    </div>
  );
}
