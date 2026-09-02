import { type CSSProperties, useEffect, useRef } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

/** 0.8× the /hex-fours fours (`min(32rem, 50svh)`). Canvas stays at hex-fours box so the hex scales only via TRIANGLE_HEIGHT_RATIO. */
const SLOT = "min(25.6rem, 40svh)";
const CANVAS = "min(32rem, 50svh)";
const FOUR_FONT_SIZE = "calc(var(--slot) * 0.82)";
const SLOT_STYLE = {
  "--slot": SLOT,
  "--canvas": CANVAS,
} as CSSProperties;
const FOUR_STYLE = { fontSize: FOUR_FONT_SIZE } satisfies CSSProperties;

const FOUR_CLASS =
  "pointer-events-none select-none font-heading font-light leading-none text-primary";

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
      className="mx-auto flex w-fit items-center justify-center gap-0 sm:gap-1"
      style={SLOT_STYLE}
    >
      <span aria-hidden="true" className={FOUR_CLASS} style={FOUR_STYLE}>
        4
      </span>
      <canvas
        ref={canvasRef}
        className="block shrink-0 touch-none -mx-[calc(var(--canvas)*0.18)]"
        style={{ width: "var(--canvas)", height: "var(--canvas)" }}
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
      <span aria-hidden="true" className={FOUR_CLASS} style={FOUR_STYLE}>
        4
      </span>
    </div>
  );
}
