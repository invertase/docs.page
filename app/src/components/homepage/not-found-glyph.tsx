"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { createGlyphDissolve, GLOW_PAD_CSS } from "./not-found-glyph-dissolve";

const GLYPH_CLASS =
  "font-heading font-light text-[9.72rem] leading-none sm:text-[12.96rem] md:text-[16.2rem]";

export function NotFoundGlyph() {
  const textRef = useRef<HTMLParagraphElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const text = textRef.current;
    if (!canvas || !text) return;

    const handle = createGlyphDissolve(canvas, text);
    if (!handle) return;

    let cancelled = false;
    void handle.ready.then((ok) => {
      if (!cancelled && ok) setEnhanced(true);
    });

    return () => {
      cancelled = true;
      handle.dispose();
      setEnhanced(false);
    };
  }, []);

  return (
    <div className="relative inline-block select-none">
      <p
        ref={textRef}
        className={cn(GLYPH_CLASS, "text-transparent")}
        aria-hidden
      >
        404
      </p>
      {!enhanced && (
        <p className={cn(GLYPH_CLASS, "absolute inset-0 text-primary")}>404</p>
      )}
      <canvas
        ref={canvasRef}
        className={cn(
          "pointer-events-none absolute z-10",
          !enhanced && "invisible",
        )}
        style={{
          top: -GLOW_PAD_CSS,
          right: -GLOW_PAD_CSS,
          bottom: -GLOW_PAD_CSS,
          left: -GLOW_PAD_CSS,
        }}
        aria-hidden
      />
    </div>
  );
}
