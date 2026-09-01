/**
 * Pointer-lit honey LEDs along the live Lexend 404 outline.
 *
 * Lighting structure from vgpu triangle-led-front (rev 90b65bf4…): LED buffer,
 * geometry quads, led-emitters draw, pointer brush (active + isMouse),
 * brightnessMin hover ×4, black occluder. The occluder is the rasterized 404
 * via JFA/SDF, not a three-vertex triangle. Type is never dissolved.
 */

import type { Gpu, Surface } from "vgpu";
import { type BrushState, DEFAULT_BRUSH } from "./not-found-glyph/led-buffer";
import { layoutGlyphLeds } from "./not-found-glyph/outline";
import type * as Simulation from "./not-found-glyph/simulation";
import type { GlyphScene } from "./not-found-glyph/simulation";

/** Locked brand honey #E69135 from the Shaders room. */
export const HONEY_RGB = [230 / 255, 145 / 255, 53 / 255] as const;

/** Canvas pad so the official 165 CSS-px glow can wrap the silhouette. */
export const GLOW_PAD_CSS = DEFAULT_BRUSH.glowRadius;

/** COPY_DST | TEXTURE_BINDING | RENDER_ATTACHMENT */
const GLYPH_USAGE = 0x02 | 0x04 | 0x10;
const ALPHA_CUTOFF = 128;

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

function srgbToLinear(channel: number): number {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
}

function toLinearHoney(
  rgb: readonly [number, number, number],
): readonly [number, number, number] {
  return [srgbToLinear(rgb[0]), srgbToLinear(rgb[1]), srgbToLinear(rgb[2])];
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWebGpu(): boolean {
  return typeof navigator !== "undefined" && Boolean(navigator.gpu);
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
  let pointerX = -1000;
  let pointerY = -1000;
  let pointerActive = false;
  let pointerInside = false;
  let pointerIsMouse = false;
  let sawMouse = false;
  let honey: readonly [number, number, number] = toLinearHoney(HONEY_RGB);
  let glyphPixels: Uint8ClampedArray | undefined;
  let glyphWidth = 0;
  let glyphHeight = 0;

  const glyphCanvas = document.createElement("canvas");
  const glyphCtx = glyphCanvas.getContext("2d", { willReadFrequently: true });
  if (!glyphCtx) return null;

  const paintGlyph = () => {
    if (!gpu || !glyph || disposed || !sim || !scene) return;
    const style = getComputedStyle(textEl);
    honey = toLinearHoney(parseCssRgb(style.color));
    const width = Math.max(1, glyph.width);
    const height = Math.max(1, glyph.height);
    const cssWidth = Math.max(1, canvas.clientWidth);
    const cssHeight = Math.max(1, canvas.clientHeight);
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

    const pixels = glyphCtx.getImageData(0, 0, width, height).data;
    glyphPixels = pixels;
    glyphWidth = width;
    glyphHeight = height;
    sim.updateLedLayout(scene, layoutGlyphLeds(pixels, width, height));
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

  const glyphContains = (clientX: number, clientY: number, rect: DOMRect) => {
    if (!glyphPixels || glyphWidth <= 0 || glyphHeight <= 0) return false;
    const x = ((clientX - rect.left) * glyphWidth) / Math.max(1, rect.width);
    const y = ((clientY - rect.top) * glyphHeight) / Math.max(1, rect.height);
    if (x < 0 || y < 0 || x >= glyphWidth || y >= glyphHeight) return false;
    const ix = Math.min(glyphWidth - 1, Math.max(0, Math.floor(x)));
    const iy = Math.min(glyphHeight - 1, Math.max(0, Math.floor(y)));
    return (glyphPixels[(iy * glyphWidth + ix) * 4 + 3] ?? 0) >= ALPHA_CUTOFF;
  };

  const brushState = (rect: DOMRect): BrushState => {
    const dprX = (scene?.size[0] ?? rect.width) / Math.max(1, rect.width);
    const dprY = (scene?.size[1] ?? rect.height) / Math.max(1, rect.height);
    if (!pointerActive) {
      return {
        ...DEFAULT_BRUSH,
        x: -1000,
        y: -1000,
        glowRadius: DEFAULT_BRUSH.glowRadius * dprX,
        active: false,
        inside: false,
        isMouse: false,
      };
    }
    return {
      ...DEFAULT_BRUSH,
      x: (pointerX - rect.left) * dprX,
      y: (pointerY - rect.top) * dprY,
      glowRadius: DEFAULT_BRUSH.glowRadius * dprX,
      active: true,
      inside: pointerInside,
      isMouse: pointerIsMouse,
    };
  };

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
    const now = performance.now() / 1000;
    const rect = canvas.getBoundingClientRect();
    sim.tickLeds(scene, now, brushState(rect), honey);
    sim.renderLighting(scene, glyph);
    sim.presentScene(scene, canvasSurface, glyph, honey);
  };

  const tick = () => {
    if (disposed) return;
    try {
      draw();
    } catch {
      dispose();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const updatePointer = (event: PointerEvent) => {
    const isMouse = event.pointerType === "mouse";
    if (isMouse) sawMouse = true;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerIsMouse = isMouse;
    pointerActive = isMouse ? sawMouse : event.buttons > 0;
    pointerInside = glyphContains(
      event.clientX,
      event.clientY,
      canvas.getBoundingClientRect(),
    );
  };

  const onPointerMove = (event: PointerEvent) => {
    updatePointer(event);
  };
  const onPointerDown = (event: PointerEvent) => {
    updatePointer(event);
  };
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      updatePointer(event);
      return;
    }
    pointerActive = false;
    pointerInside = false;
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
