import { clock, frameLoop, type Gpu, type Surface, surface } from "vgpu";
import { createHeroRenderer, type HeroRenderer } from "./scene-renderer";
import { DEFAULT_BRUSH, type RenderSize } from "./settings";
import { brushState } from "./sim-sizing";

interface RendererOptions {
  readonly canvas: HTMLCanvasElement;
  /** Copy hold / copied tick — same periwinkle deploy as the 404 hex hold. */
  readonly rgbDeployActive?: () => boolean;
}

export function createRenderer(options: RendererOptions) {
  let disposed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let scene: HeroRenderer | undefined;
  let loop: { stop(): void } | undefined;
  let observer: ResizeObserver | undefined;
  let resizeFrame = 0;
  let resizeGeneration = 0;
  let pendingSize: RenderSize | undefined;
  let lastDpr = typeof window === "undefined" ? 1 : window.devicePixelRatio;

  const fail = (error: unknown): never => {
    dispose();
    throw error;
  };
  const applyResize = () => {
    resizeFrame = 0;
    const size = pendingSize;
    pendingSize = undefined;
    if (disposed || !size || !scene || !canvasSurface) return;
    const generation = ++resizeGeneration;
    try {
      scene.rebuild({
        width: size.width,
        height: size.height,
        dpr: canvasSurface.dpr,
      });
      scene.setOutputTarget(canvasSurface);
      void scene.prewarm().catch((error: unknown) => {
        if (disposed || generation !== resizeGeneration) return;
        fail(error);
      });
    } catch (error) {
      if (disposed || generation !== resizeGeneration) return;
      fail(error);
    }
  };
  const resize = (size: RenderSize) => {
    if (disposed || size.width <= 0 || size.height <= 0) return;
    pendingSize = size;
    if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
  };
  const measure = () => {
    const rect = options.canvas.getBoundingClientRect();
    resize({ width: rect.width, height: rect.height });
  };
  const onWindowResize = () => {
    if (window.devicePixelRatio === lastDpr) return;
    lastDpr = window.devicePixelRatio;
    measure();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    resizeGeneration++;
    loop?.stop();
    loop = undefined;
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = 0;
    pendingSize = undefined;
    observer?.disconnect();
    observer = undefined;
    if (typeof window !== "undefined")
      window.removeEventListener("resize", onWindowResize);
    scene?.destroy();
    scene = undefined;
    canvasSurface?.dispose();
    canvasSurface = undefined;
    gpu?.dispose();
    gpu = undefined;
  };
  const initialize = async () => {
    const { init } = await import("vgpu");
    if (disposed) return;
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    canvasSurface = surface(gpu, options.canvas, {
      dpr: [1, 2],
      alphaMode: "premultiplied",
      clearColor: [0, 0, 0, 0],
    });
    const nextScene = createHeroRenderer(gpu, {
      theme: "dark",
      css: cssSizeOf(options.canvas, canvasSurface.dpr),
    });
    scene = nextScene;
    nextScene.setOutputTarget(canvasSurface);
    await nextScene.prewarm();
    if (disposed) {
      nextScene.destroy();
      return;
    }
    observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(options.canvas);
    window.addEventListener("resize", onWindowResize);
    measure();
    const time = clock(gpu);
    const idleBrush = brushState(DEFAULT_BRUSH);
    loop = frameLoop(gpu, (currentFrame) => {
      if (disposed || !scene || !gpu) return;
      scene.setBrush(idleBrush);
      scene.setRgbDeployActive(options.rgbDeployActive?.() === true);
      scene.renderFrame(currentFrame, { time: time.time, dt: time.deltaTime });
    });
  };
  const ready = initialize().catch((error: unknown) => {
    if (disposed) return;
    fail(error);
  });
  return { ready, resize, dispose };
}

function cssSizeOf(canvas: HTMLCanvasElement, dpr: Surface["dpr"]) {
  const rect = canvas.getBoundingClientRect();
  return {
    width: Math.max(1, rect.width || canvas.clientWidth || canvas.width / dpr),
    height: Math.max(
      1,
      rect.height || canvas.clientHeight || canvas.height / dpr,
    ),
    dpr,
  };
}
