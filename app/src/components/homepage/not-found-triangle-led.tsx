import { useEffect, useRef } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

const FOUR_CLASS =
  "pointer-events-none select-none font-heading font-light leading-none text-primary text-[length:calc(var(--slot)*0.78)]";

/**
 * Official vgpu LED hero in the site 404 slot. The hex is the 0;
 * Lexend Light 4s sit on either side so the wordmark reads 404.
 */
export function NotFoundTriangleLed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({ canvas });
    void renderer.ready.catch((error: unknown) => {
      console.error(
        "[docs.page 404] triangle-led-front failed to start",
        error,
      );
    });
    return () => renderer.dispose();
  }, []);

  return (
    <div
      role="img"
      aria-label="404"
      className="mx-auto flex w-full max-w-7xl items-center justify-center gap-1 [--slot:min(32rem,50svh,calc((100%-0.5rem)/2.1))] sm:gap-2"
    >
      <span aria-hidden="true" className={FOUR_CLASS}>
        4
      </span>
      <canvas
        ref={canvasRef}
        className="relative block size-[length:var(--slot)] shrink-0 touch-none"
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
      <span aria-hidden="true" className={FOUR_CLASS}>
        4
      </span>
    </div>
  );
}
