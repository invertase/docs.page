import { useEffect, useRef, useState } from "react";
import { createRenderer } from "../chip-led-front/renderer";
import { CHIP_BLOOM_CSS, setChipFrame } from "../chip-led-front/settings";

/**
 * Official vgpu LED rim around the homepage copy chip — same honey crawl +
 * periwinkle deploy as the 404 hex (`triangle-led-front` on PR #542), with a
 * rounded-rect occluder instead of a pointy hex.
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
      setChipFrame({
        canvasWidth: Math.max(1, rect.width + CHIP_BLOOM_CSS * 2),
        canvasHeight: Math.max(1, rect.height + CHIP_BLOOM_CSS * 2),
        radius: Number.isFinite(radius) ? radius : 12,
        padX: CHIP_BLOOM_CSS,
        padY: CHIP_BLOOM_CSS,
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

    const observer = new ResizeObserver(() => {
      syncFrame();
      const box = canvas.getBoundingClientRect();
      renderer.resize({ width: box.width, height: box.height });
    });
    observer.observe(host);

    return () => {
      observer.disconnect();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 overflow-visible rounded-[inherit]"
      aria-hidden
      data-chip-rim={active ? "periwinkle" : "honey"}
    >
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{
          left: -CHIP_BLOOM_CSS,
          top: -CHIP_BLOOM_CSS,
          width: `calc(100% + ${CHIP_BLOOM_CSS * 2}px)`,
          height: `calc(100% + ${CHIP_BLOOM_CSS * 2}px)`,
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
