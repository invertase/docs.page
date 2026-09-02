import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

/** Hex box from /hex-fours; width fits Lexend 4 rims without clipping. */
const CANVAS_H = "min(32rem, 50svh, calc(92vw / 1.8125))";
const CANVAS_W = "min(58rem, 92vw, calc(min(32rem, 50svh) * 1.8125))";
const FOUR_FONT_SIZE = "calc(var(--canvas-h) * 0.94)";
const SLOT_STYLE = {
  "--canvas-h": CANVAS_H,
  "--canvas-w": CANVAS_W,
} as CSSProperties;

const FOUR_CLASS =
  "pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-heading font-light leading-none text-primary";

/**
 * Official vgpu LED hero in the site 404 slot. The hex is the 0;
 * Lexend Light 4 rims sit on either side so the wordmark reads 404.
 */
export function NotFoundTriangleLed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heldRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({
      canvas,
      rgbDeployActive: () => heldRef.current,
    });
    void renderer.ready
      .then(() => setReady(true))
      .catch((error: unknown) => {
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
      className="relative mx-auto w-fit touch-none"
      style={SLOT_STYLE}
      onPointerDown={(event) => {
        if (!event.isPrimary) return;
        heldRef.current = true;
        if (event.target !== canvasRef.current) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerUp={(event) => {
        if (!event.isPrimary) return;
        heldRef.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
      onPointerCancel={(event) => {
        heldRef.current = false;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
    >
      <canvas
        ref={canvasRef}
        className="block touch-none"
        style={{ width: "var(--canvas-w)", height: "var(--canvas-h)" }}
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
      <span
        aria-hidden="true"
        className={`${FOUR_CLASS} left-[18.2%] ${ready ? "invisible" : ""}`}
        style={{ fontSize: FOUR_FONT_SIZE }}
      >
        4
      </span>
      <span
        aria-hidden="true"
        className={`${FOUR_CLASS} left-[81.8%] ${ready ? "invisible" : ""}`}
        style={{ fontSize: FOUR_FONT_SIZE }}
      >
        4
      </span>
    </div>
  );
}
