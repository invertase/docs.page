import { type CSSProperties, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

export function Background() {
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
    <>
      <div className="absolute inset-0 bg-linear-to-br from-periwinkle-500/30 via-transparent to-transparent h-[1000px] z-1 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-tl from-periwinkle-500/20 via-transparent to-transparent h-[1000px] z-1 pointer-events-none" />
      <div className={cn(styles["homepage-spot-grid"], "fixed inset-0")}>
        <div
          className={cn(styles["homepage-spot-glow"], "motion-reduce:hidden")}
          style={
            {
              "--homepage-glow-x": `${pos.x}px`,
              "--homepage-glow-y": `${pos.y}px`,
            } as CSSProperties
          }
          aria-hidden
        />
      </div>
    </>
  );
}
