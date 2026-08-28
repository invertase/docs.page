/**
 * Pointer-driven 404 dissolve on vgpu.
 *
 * Dots are circular honey HDR emitters (and occluders), lit with the same
 * JFA / SDF / radiance-cascade chain as agent-radiance-cascades. The Lexend
 * 404 is albedo: packed ~7px specks under the pointer space out onto the
 * page 22px lattice, then the fill heals.
 */

import type { Gpu, Surface } from "vgpu";
import type * as Simulation from "./not-found-glyph/simulation";
import type { DotsUniforms, GlyphScene } from "./not-found-glyph/simulation";

/** Matches `.homepage-spot-grid` in homepage.module.css */
export const SPOT_GRID_CELL_PX = 22;
export const SPOT_GRID_DOT_RADIUS_PX = 1;

/** Packed cluster under the pointer (CSS px). Trail spreads to 22px. */
const DENSE_CELL_PX = 7;

/** Locked brand honey from the Shaders room. */
export const HONEY_RGB = [230 / 255, 145 / 255, 53 / 255] as const;

const HEAD_INNER_PX = 6;
const HEAD_OUTER_PX = 34;
const TRAIL_LIFE_MS = 260;
const TRAIL_COUNT = 12;
const TRAIL_RECORD_PX = 6;

/** COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT */
const GLYPH_USAGE = 0x02 | 0x04 | 0x10;

export type GlyphDissolveHandle = {
  readonly ready: Promise<boolean>;
  dispose: () => void;
};

function parseCssRgb(color: string): readonly [number, number, number] {
  const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s/]+([\d.]+)[,\s/]+([\d.]+)/);
  if (rgb) {
    return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  }
  return HONEY_RGB;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWebGpu(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.gpu);
}

function snapTo(value: number, cell: number): number {
  return (Math.floor(value / cell) + 0.5) * cell;
}

export function createGlyphDissolve(
  canvas: HTMLCanvasElement,
  textEl: HTMLElement,
): GlyphDissolveHandle | null {
  if (prefersReducedMotion() || !hasWebGpu()) return null;

  let disposed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let scene: GlyphScene | undefined;
  let sim: typeof Simulation | undefined;
  let scenePrepared = false;
  let sceneGeneration = 0;
  let glyph: GPUTexture | undefined;
  let unsubscribeResize: (() => void) | undefined;
  let observer: ResizeObserver | undefined;
  let raf = 0;
  let lastTs = performance.now();
  let active = 0;
  let targetActive = 0;
  let pointerX = 0;
  let pointerY = 0;
  let honey: readonly [number, number, number] = HONEY_RGB;
  const trail: { x: number; y: number; t: number }[] = [];
  const trailSlots: [number, number, number, number][] = Array.from(
    { length: TRAIL_COUNT },
    () => [0, 0, 0, 0],
  );

  const glyphCanvas = document.createElement("canvas");
  const glyphCtx = glyphCanvas.getContext("2d");
  if (!glyphCtx) return null;

  const paintGlyph = () => {
    if (!gpu || !glyph || disposed) return;
    const style = getComputedStyle(textEl);
    honey = parseCssRgb(style.color);
    const width = Math.max(1, glyph.width);
    const height = Math.max(1, glyph.height);
    const cssWidth = Math.max(1, textEl.clientWidth);
    const cssHeight = Math.max(1, textEl.clientHeight);
    const dprX = width / cssWidth;
    const dprY = height / cssHeight;

    glyphCanvas.width = width;
    glyphCanvas.height = height;
    glyphCtx.setTransform(1, 0, 0, 1, 0, 0);
    glyphCtx.clearRect(0, 0, width, height);
    glyphCtx.setTransform(dprX, 0, 0, dprY, 0, 0);
    glyphCtx.fillStyle = "#fff";
    glyphCtx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`;
    glyphCtx.textAlign = "center";
    glyphCtx.textBaseline = "middle";
    glyphCtx.fillText("404", cssWidth / 2, cssHeight / 2);

    gpu.gpu.queue.copyExternalImageToTexture(
      { source: glyphCanvas },
      { texture: glyph },
      [width, height],
    );
  };

  const allocGlyph = (width: number, height: number) => {
    if (!gpu) return;
    if (glyph && glyph.width === width && glyph.height === height) return;
    glyph?.destroy();
    glyph = gpu.gpu.createTexture({
      label: "404-glyph",
      size: [width, height],
      format: "rgba8unorm",
      usage: GLYPH_USAGE,
    });
  };

  const packTrail = (now: number) => {
    const cutoff = now - TRAIL_LIFE_MS;
    while (trail.length > 0 && trail[trail.length - 1].t < cutoff) {
      trail.pop();
    }
    for (const slot of trailSlots) {
      slot[0] = 0;
      slot[1] = 0;
      slot[2] = 0;
      slot[3] = 0;
    }
    const seen = new Set<string>();
    let index = 0;
    for (let i = 0; i < trail.length && index < TRAIL_COUNT; i++) {
      const sample = trail[i];
      const age = Math.min(1, (now - sample.t) / TRAIL_LIFE_MS);
      const fade = Math.max(0, 1 - age);
      const spread = age * age * (3 - 2 * age);
      const t = spread * spread;
      const denseX = snapTo(sample.x, DENSE_CELL_PX);
      const denseY = snapTo(sample.y, DENSE_CELL_PX);
      const pageX = snapTo(sample.x, SPOT_GRID_CELL_PX);
      const pageY = snapTo(sample.y, SPOT_GRID_CELL_PX);
      const x = denseX + (pageX - denseX) * t;
      const y = denseY + (pageY - denseY) * t;
      const key =
        t > 0.55
          ? `${Math.round(pageX / SPOT_GRID_CELL_PX)}:${Math.round(pageY / SPOT_GRID_CELL_PX)}`
          : `${Math.round(denseX / DENSE_CELL_PX)}:${Math.round(denseY / DENSE_CELL_PX)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const slot = trailSlots[index]!;
      slot[0] = x;
      slot[1] = y;
      slot[2] = fade;
      index += 1;
    }
  };

  const dotsUniforms = (rect: DOMRect): DotsUniforms => ({
    origin: [rect.left, rect.top],
    css_size: [Math.max(1, rect.width), Math.max(1, rect.height)],
    pointer: [pointerX, pointerY],
    enabled: active,
    honey: [honey[0], honey[1], honey[2], 1],
    dense_cell: DENSE_CELL_PX,
    dot_radius: SPOT_GRID_DOT_RADIUS_PX,
    head_inner: HEAD_INNER_PX,
    head_outer: HEAD_OUTER_PX,
    trail: trailSlots,
  });

  const draw = () => {
    if (
      disposed ||
      !scene ||
      !scenePrepared ||
      !canvasSurface ||
      !glyph ||
      !sim
    ) {
      return;
    }
    packTrail(performance.now());
    const uniforms = dotsUniforms(canvas.getBoundingClientRect());
    sim.renderLighting(scene, uniforms, glyph);
    sim.presentScene(scene, canvasSurface, glyph, honey);
  };

  const tick = (ts: number) => {
    if (disposed) return;
    const dt = Math.min(0.05, Math.max(0, (ts - lastTs) / 1000));
    lastTs = ts;
    active += (targetActive - active) * (1 - Math.exp(-dt * 14));
    if (Math.abs(active) < 0.001 && targetActive === 0) active = 0;
    try {
      draw();
    } catch {
      dispose();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const noteTrail = (clientX: number, clientY: number, over: boolean) => {
    if (!over) return;
    const t = performance.now();
    const head = trail[0];
    if (
      !head ||
      Math.hypot(clientX - head.x, clientY - head.y) >= TRAIL_RECORD_PX
    ) {
      trail.unshift({ x: clientX, y: clientY, t });
    } else {
      head.x = clientX;
      head.y = clientY;
      head.t = t;
    }
    if (trail.length > TRAIL_COUNT) trail.length = TRAIL_COUNT;
  };

  const updatePointer = (clientX: number, clientY: number) => {
    pointerX = clientX;
    pointerY = clientY;
    const rect = canvas.getBoundingClientRect();
    const over =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;
    targetActive = over ? 1 : 0;
    noteTrail(clientX, clientY, over);
  };

  const onPointerMove = (event: PointerEvent) => {
    updatePointer(event.clientX, event.clientY);
  };
  const onPointerDown = (event: PointerEvent) => {
    updatePointer(event.clientX, event.clientY);
  };
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      updatePointer(event.clientX, event.clientY);
      return;
    }
    targetActive = 0;
  };

  const rebuildScene = async (width: number, height: number) => {
    if (disposed || !gpu || !canvasSurface || !sim) return;
    const size: [number, number] = [
      Math.max(1, Math.floor(width)),
      Math.max(1, Math.floor(height)),
    ];
    if (
      scene?.size[0] === size[0] &&
      scene.size[1] === size[1] &&
      glyph?.width === size[0] &&
      glyph.height === size[1]
    ) {
      paintGlyph();
      return;
    }

    const next = sim.createScene(gpu, size);
    const previous = scene;
    scene = next;
    scenePrepared = false;
    const generation = ++sceneGeneration;
    allocGlyph(size[0], size[1]);
    paintGlyph();
    await sim.prepareScene(next, canvasSurface.format);
    if (disposed || generation !== sceneGeneration) {
      sim.destroyScene(next);
      return;
    }
    scenePrepared = true;
    if (previous) sim.destroyScene(previous);
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    observer?.disconnect();
    unsubscribeResize?.();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("pointercancel", onPointerUp);
    glyph?.destroy();
    glyph = undefined;
    try {
      gpu?.dispose();
    } catch {
      // Best-effort teardown.
    }
  };

  const ready = (async () => {
    const [{ init, surface }, loaded] = await Promise.all([
      import("vgpu"),
      import("./not-found-glyph/simulation"),
    ]);
    if (disposed) return false;
    sim = loaded;
    const nextGpu = await init({ label: "docs-page-404" });
    if (disposed) {
      nextGpu.dispose();
      return false;
    }
    gpu = nextGpu;
    canvasSurface = surface(gpu, canvas, {
      dpr: [1, 2],
      alphaMode: "premultiplied",
    });
    let firstRebuild: Promise<void> | undefined;
    unsubscribeResize = canvasSurface.onResize(({ width, height }) => {
      const run = rebuildScene(width, height);
      firstRebuild ??= run;
      void run;
    });
    await firstRebuild;
    if (disposed || !scenePrepared) {
      dispose();
      return false;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    observer = new ResizeObserver(() => {
      paintGlyph();
    });
    observer.observe(textEl);
    void document.fonts?.ready?.then(() => {
      if (!disposed) paintGlyph();
    });
    lastTs = performance.now();
    try {
      draw();
    } catch {
      dispose();
      return false;
    }
    raf = requestAnimationFrame(tick);
    return true;
  })().catch(() => {
    dispose();
    return false;
  });

  return { ready, dispose };
}
