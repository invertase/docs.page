"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { createGlyphDissolve } from "./not-found-glyph-dissolve";

const GLYPH_CLASS =
  "font-heading font-light text-primary text-8xl leading-none sm:text-9xl md:text-[10rem]";

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

    setEnhanced(true);
    return () => {
      handle.dispose();
      setEnhanced(false);
    };
  }, []);

  return (
    <div className="relative inline-block select-none">
      <p ref={textRef} className={cn(GLYPH_CLASS, enhanced && "opacity-0")}>
        404
      </p>
      <canvas
        ref={canvasRef}
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full",
          !enhanced && "invisible",
        )}
        aria-hidden
      />
    </div>
  );
}
