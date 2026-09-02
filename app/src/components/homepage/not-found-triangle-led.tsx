import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createRenderer } from "./triangle-led-front/renderer";

/** 0.8× the /hex-fours fours (`min(32rem, 50svh)`). Canvas stays at hex-fours box so the hex scales only via TRIANGLE_HEIGHT_RATIO. */
const SLOT = "min(25.6rem, 40svh)";
const CANVAS = "min(32rem, 50svh)";
const FOUR_FONT_SIZE = "calc(var(--slot) * 0.82)";
const HONEY = "#E69135";
const PERIWINKLE = "#5368BD";

const honeyGlow = [
  `0 0 0.06em ${HONEY}`,
  `0 0 0.18em ${HONEY}`,
  `0 0 0.4em color-mix(in srgb, ${HONEY} 85%, white)`,
  `0 0 0.85em color-mix(in srgb, ${HONEY} 55%, transparent)`,
].join(", ");

const periwinkleGlow = [
  `0 0 0.08em ${PERIWINKLE}`,
  `0 0 0.22em color-mix(in srgb, ${PERIWINKLE} 70%, transparent)`,
  `0 0 0.55em color-mix(in srgb, ${PERIWINKLE} 40%, transparent)`,
].join(", ");

const SLOT_STYLE = {
  "--slot": SLOT,
  "--canvas": CANVAS,
} as CSSProperties;

const FOUR_CLASS =
  "pointer-events-none select-none font-heading font-light leading-none text-primary transition-[color,text-shadow] duration-150";

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
    ...(held
      ? { color: PERIWINKLE, textShadow: periwinkleGlow }
      : hovered
        ? { textShadow: honeyGlow }
        : undefined),
  } satisfies CSSProperties;

  return (
    <div
      role="img"
      aria-label="404"
      className="mx-auto flex w-fit cursor-pointer items-center justify-center gap-0 touch-none sm:gap-1"
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
        className="block shrink-0 touch-none -mx-[calc(var(--canvas)*0.18)]"
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
