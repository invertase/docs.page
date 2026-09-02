import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { createRenderer } from "./triangle-led-front/renderer";

const GLYPH_CLASS =
  "font-heading font-light text-primary text-[9.72rem] leading-none sm:text-[12.96rem] md:text-[16.2rem]";

/**
 * Official vgpu Triangle LED Hero (`triangle-led-front`, rev
 * 90b65bf4144a6c18e275982fb1669336e3f9a1154ecbaac6174011f0c0ffeff1)
 * mounted in the site 404 slot. Honey type stays visible until
 * `createRenderer().ready` resolves.
 */
export function NotFoundTriangleLed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({ canvas });
    void renderer.ready
      .then(() => {
        setReady(true);
      })
      .catch((error: unknown) => {
        console.error(
          "[docs.page 404] triangle-led-front failed to start",
          error,
        );
      });
    return () => renderer.dispose();
  }, []);

  return (
    <div className="relative mx-auto flex h-[min(50svh,32rem)] w-full max-w-[45rem] items-center justify-center [&_.lil-gui]:hidden">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 flex items-center justify-center",
          ready && "invisible",
        )}
      >
        <p className={GLYPH_CLASS}>404</p>
      </div>
      <canvas
        ref={canvasRef}
        className="relative z-10 block h-full w-full touch-none"
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
    </div>
  );
}
