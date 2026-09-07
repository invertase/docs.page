import { useEffect, useRef } from "react";
import {
  type CrawlState,
  createCrawlState,
  ledCountForPerimeter,
  roundedRectPerimeter,
  sampleRoundedRect,
  srgbCss,
  stepCrawl,
} from "./crawl";

/** Extra canvas pixels so the LED bloom can sit outside the chip box. */
const BLOOM_PX = 14;

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

/**
 * Discrete LED strip around the hero copy chip. Honey crawl at rest;
 * periwinkle while the copy control is held or the copied tick is showing.
 *
 * Same glow recipe as the HTML 4s on the 404 lockup (`not-found-triangle-led`).
 */
export function ChipLedRim({ active }: { active: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const crawl: CrawlState = createCrawlState();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let disposed = false;
    let sites = sampleRoundedRect(0, 0, 0, 0, 0, 0);
    let cornerRadius = 12;
    let boxW = 0;
    let boxH = 0;

    const layout = () => {
      const rect = host.getBoundingClientRect();
      boxW = Math.max(1, rect.width);
      boxH = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasW = boxW + BLOOM_PX * 2;
      const canvasH = boxH + BLOOM_PX * 2;

      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;

      const computed = getComputedStyle(host.parentElement ?? host);
      const parsed = Number.parseFloat(computed.borderTopLeftRadius);
      cornerRadius = Number.isFinite(parsed) ? parsed : 12;

      const perimeter = roundedRectPerimeter(boxW, boxH, cornerRadius);
      sites = sampleRoundedRect(
        BLOOM_PX,
        BLOOM_PX,
        boxW,
        boxH,
        cornerRadius,
        ledCountForPerimeter(perimeter),
      );
    };

    const draw = (nowMs: number) => {
      if (disposed) return;
      const { brightness, color } = stepCrawl(
        crawl,
        nowMs / 1000,
        sites.length,
        activeRef.current ? 1 : 0,
        reduceMotion,
      );

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Dim always-on stroke so the chip still reads as a rim between bands.
      ctx.strokeStyle = srgbCss(color, 0.32 + crawl.deploy * 0.38);
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.roundRect(BLOOM_PX, BLOOM_PX, boxW, boxH, cornerRadius);
      ctx.stroke();

      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < sites.length; i++) {
        const site = sites[i];
        if (!site) continue;
        const level = brightness[i] ?? 0;
        if (level < 0.04) continue;

        // Soft bloom, then a short capsule so the strip reads as LEDs, not a
        // flat conic gradient.
        ctx.fillStyle = srgbCss(color, 0.2 + level * 0.38);
        ctx.beginPath();
        ctx.ellipse(site.x, site.y, 7.6, 3.6, site.angle, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = srgbCss(color, 0.28 + level * 0.72);
        drawCapsule(ctx, site.x, site.y, site.angle, 2.35, 0.95);
      }
      ctx.globalCompositeOperation = "source-over";

      frame = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(layout);
    observer.observe(host);
    layout();
    frame = window.requestAnimationFrame(draw);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="pointer-events-none absolute inset-0 overflow-visible rounded-[inherit] transition-[box-shadow] duration-[600ms] ease"
      style={{ boxShadow: active ? periwinkleGlow : honeyGlow }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{ left: -BLOOM_PX, top: -BLOOM_PX }}
      />
    </div>
  );
}

function drawCapsule(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  halfLength: number,
  halfThickness: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.roundRect(
    -halfLength,
    -halfThickness,
    halfLength * 2,
    halfThickness * 2,
    halfThickness,
  );
  ctx.fill();
  ctx.restore();
}
