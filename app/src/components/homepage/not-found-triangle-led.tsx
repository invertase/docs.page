import { type CSSProperties, useEffect, useRef } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

const SLOT = "min(32rem, 50svh)";
const GLYPH_FONT_SIZE = "min(16.2rem, calc(var(--slot) * 0.4))";
const SLOT_STYLE = { "--slot": SLOT } as CSSProperties;

/**
 * Official vgpu LED hero in the site 404 slot. Lexend Light 404
 * sits on the hex so the lockup reads as one wordmark.
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
      className="relative mx-auto w-fit"
      style={SLOT_STYLE}
    >
      <canvas
        ref={canvasRef}
        className="block touch-none"
        style={{ width: "var(--slot)", height: "var(--slot)" }}
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-heading font-light leading-none text-primary"
        style={{ fontSize: GLYPH_FONT_SIZE }}
      >
        404
      </p>
    </div>
  );
}
