import { useEffect, useRef, useState } from "react";
import { createRenderer } from "../chip-led-front/renderer";
import { CHIP_BLOOM_CSS, setChipFrame } from "../chip-led-front/settings";

/**
 * Keep the WebGPU canvas inside the viewport so `_app`'s `overflow-x-clip`
 * cannot hard-cut the bloom. The floor shader still fades the outer half of
 * this pad so the buffer edge itself is never a visible rectangle.
 */
function bloomPad(rect: DOMRect) {
  const inset = 2;
  const availableX = Math.min(
    Math.floor(rect.left - inset),
    Math.floor(window.innerWidth - rect.right - inset),
  );
  const availableY = Math.min(
    Math.floor(rect.top - inset),
    Math.floor(window.innerHeight - rect.bottom - inset),
  );
  return {
    x: Math.max(4, Math.min(CHIP_BLOOM_CSS, availableX)),
    y: Math.max(4, Math.min(CHIP_BLOOM_CSS, availableY)),
  };
}

function applyCanvasPad(
  canvas: HTMLCanvasElement,
  host: HTMLElement,
  pad: { x: number; y: number },
) {
  const { width, height } = host.getBoundingClientRect();
  // Pixel sizes — never `width: 100%`. A percentage here is cyclic with a
  // hug-sized parent and resolves against the hero column, which is what
  // made `w-fit` stretch the pill to the page width.
  canvas.style.position = "absolute";
  canvas.style.maxWidth = "none";
  canvas.style.left = `${-pad.x}px`;
  canvas.style.top = `${-pad.y}px`;
  canvas.style.width = `${width + pad.x * 2}px`;
  canvas.style.height = `${height + pad.y * 2}px`;
}

/**
 * Official vgpu LED rim around the homepage copy chip — #542 triangle-led-front
 * with the occluder/emitter path swapped from hex to the chip’s rounded-xl.
 */
export function ChipLedRim({ active }: { active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const syncFrame = () => {
      const rect = host.getBoundingClientRect();
      const parent = host.parentElement ?? host;
      const radius = Number.parseFloat(
        getComputedStyle(parent).borderTopLeftRadius,
      );
      const pad = bloomPad(rect);
      applyCanvasPad(canvas, host, pad);
      setChipFrame({
        canvasWidth: Math.max(1, rect.width + pad.x * 2),
        canvasHeight: Math.max(1, rect.height + pad.y * 2),
        radius: Number.isFinite(radius) ? radius : 12,
        padX: pad.x,
        padY: pad.y,
      });
    };

    syncFrame();
    const renderer = createRenderer({
      canvas,
      rgbDeployActive: () => activeRef.current,
    });
    void renderer.ready.catch((error: unknown) => {
      console.error("[docs.page hero] chip LED rim failed to start", error);
      setFallback(true);
    });

    const onResize = () => {
      syncFrame();
      const box = canvas.getBoundingClientRect();
      renderer.resize({ width: box.width, height: box.height });
    };
    const observer = new ResizeObserver(onResize);
    observer.observe(host);
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 w-auto overflow-visible rounded-[inherit]"
      aria-hidden
      data-chip-rim={active ? "periwinkle" : "honey"}
    >
      <canvas
        ref={canvasRef}
        className="absolute max-w-none"
        style={{
          left: -CHIP_BLOOM_CSS,
          top: -CHIP_BLOOM_CSS,
        }}
        data-vgpu="chip-led-front createRenderer LEDS_PER_EDGE"
      />
      {fallback ? (
        <div
          className="absolute inset-0 rounded-[inherit] border-2 transition-colors duration-[600ms] ease"
          style={{ borderColor: active ? "#5368BD" : "#E69135" }}
        />
      ) : null}
    </div>
  );
}
