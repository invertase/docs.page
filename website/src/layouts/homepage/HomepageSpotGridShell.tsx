"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Dot-only glow: sets `--homepage-glow-x/y` for `.homepage-spot-glow`, which is
 * masked to the same dot grid as `::before` (see global.css).
 */
export function HomepageSpotGridShell({ children }: { children: ReactNode }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 50, y: 35 });

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = grid.getBoundingClientRect();
        const w = rect.width || 1;
        const h = rect.height || 1;
        const x = ((e.clientX - rect.left) / w) * 100;
        const y = ((e.clientY - rect.top) / h) * 100;
        setPos({
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y)),
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={gridRef} className="homepage-spot-grid min-h-screen">
      <div
        className="homepage-spot-glow pointer-events-none absolute inset-0 motion-reduce:hidden"
        style={
          {
            "--homepage-glow-x": `${pos.x}%`,
            "--homepage-glow-y": `${pos.y}%`,
          } as CSSProperties
        }
        aria-hidden
      />
      {children}
    </div>
  );
}
