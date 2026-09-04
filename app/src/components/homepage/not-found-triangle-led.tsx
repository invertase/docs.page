import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

/**
 * Fluid cap: rem / svh / vw. Floor: keep lockup width ≥ “Page Not Found”
 * (`--not-found-title` from SiteNotFoundPage; ≈7.72em wide in Lexend Light).
 * Lockup width ≈ 1.83×slot when canvas is 1.25×slot → slot floor ≈ 4.21×title.
 */
const SLOT =
  "max(calc(var(--not-found-title, 2.25rem) * 4.21), min(25.6rem, 40svh, 28vw))";
const CANVAS =
  "max(calc(var(--not-found-title, 2.25rem) * 5.2625), min(32rem, 50svh, 35vw))";
const FOUR_FONT_SIZE = "calc(var(--slot) * 0.82)";
const HONEY = "#E69135";
const PERIWINKLE = "#5368BD";

const honeyGlow = [
  "0 0 0.28em rgba(230, 145, 53, 0.4)",
  "0 0 0.7em rgba(230, 145, 53, 0.32)",
  "0 0 1.35em rgba(230, 145, 53, 0.16)",
].join(", ");

const periwinkleGlow = [
  "0 0 0.28em rgba(83, 104, 189, 0.4)",
  "0 0 0.7em rgba(83, 104, 189, 0.32)",
  "0 0 1.35em rgba(83, 104, 189, 0.16)",
].join(", ");

const SLOT_STYLE = {
  "--slot": SLOT,
  "--canvas": CANVAS,
} as CSSProperties;

/** Stack above the hex canvas so its transparent box cannot darken the glyphs. */
const FOUR_CLASS =
  "relative z-10 pointer-events-none select-none font-heading font-light leading-none text-primary transition-[color,text-shadow] duration-[600ms] ease";

/**
 * Official vgpu LED hero in the site 404 slot. The hex is the 0;
 * Lexend Light 4s sit on either side so the wordmark reads 404.
 */
export function NotFoundTriangleLed() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heldRef = useRef(false);
  const [held, setHeld] = useState(false);
  const [hovered, setHovered] = useState(false);

  const setLockupHeld = (next: boolean) => {
    heldRef.current = next;
    setHeld(next);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const renderer = createRenderer({
      canvas,
      rgbDeployActive: () => heldRef.current,
    });
    void renderer.ready.catch((error: unknown) => {
      console.error(
        "[docs.page 404] triangle-led-front failed to start",
        error,
      );
    });
    return () => renderer.dispose();
  }, []);

  const fourStyle = {
    fontSize: FOUR_FONT_SIZE,
    color: held ? PERIWINKLE : HONEY,
    textShadow: held ? periwinkleGlow : hovered ? honeyGlow : "none",
  } satisfies CSSProperties;

  return (
    <div
      role="img"
      aria-label="404"
      className="relative isolate mx-auto flex w-fit cursor-pointer items-center justify-center gap-0 touch-none sm:gap-1"
      style={SLOT_STYLE}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={(event) => {
        if (!event.isPrimary) return;
        setLockupHeld(true);
        if (event.target !== canvasRef.current) {
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerUp={(event) => {
        if (!event.isPrimary) return;
        setLockupHeld(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
      onPointerCancel={(event) => {
        setLockupHeld(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      }}
    >
      <LockupFour style={fourStyle} />
      <canvas
        ref={canvasRef}
        className="relative z-0 block shrink-0 touch-none -mx-[calc(var(--canvas)*0.18)]"
        style={{ width: "var(--canvas)", height: "var(--canvas)" }}
        data-vgpu="triangle-led-front createRenderer LEDS_PER_EDGE DIRECT_TRIANGLE_INTENSITY_SCALE"
      />
      <LockupFour style={fourStyle} />
    </div>
  );
}

function LockupFour({ style }: { style: CSSProperties }) {
  return (
    <span aria-hidden="true" className={FOUR_CLASS} style={style}>
      4
    </span>
  );
}
