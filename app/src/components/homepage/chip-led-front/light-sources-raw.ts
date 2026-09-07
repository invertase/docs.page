import type { Frame, FramePass, Gpu, Target } from "vgpu";
import { bundle, draw, geometry, target } from "vgpu";
import {
  canonicalHexGeometry,
  hexEdgeLedLayout,
  LED_EMITTER_MESH_EXPANSION_PX,
  LED_SDF_CROP_EXPANSION_PX,
  LEDS_PER_EDGE,
  type SceneTunables as LightTunables,
  type RenderSize,
} from "./settings";
import ledEmittersWgsl from "./shaders/led-emitters.wgsl";

const LIGHT_SOURCES_FORMAT: GPUTextureFormat = "rgba16float";

export interface LightSourcesRaw {
  readonly texture: Target;
  readonly ready: Promise<unknown>;
  encode(args: { frame: Frame; tunables: LightTunables }): void;
  destroy(): void;
}

interface CreateLightSourcesRawOptions {
  /** CSS layout size — LED positions and uniforms stay in CSS pixels. */
  size: readonly [number, number];
  /** Canvas backing store (CSS × DPR), same pixels as the surface. */
  bufferSize: readonly [number, number];
  dpr: number;
  ledStorage: unknown;
  hex?: ReturnType<typeof canonicalHexGeometry>;
}

export function createLightSourcesRaw(
  gpu: Gpu,
  opts: CreateLightSourcesRawOptions,
): LightSourcesRaw {
  const cssSize: RenderSize = { width: opts.size[0], height: opts.size[1] };
  const bufferWidth = Math.max(1, Math.floor(opts.bufferSize[0]));
  const bufferHeight = Math.max(1, Math.floor(opts.bufferSize[1]));
  const dpr = Math.max(
    0.001,
    bufferWidth / Math.max(1, cssSize.width) || opts.dpr,
  );
  const hex = opts.hex ?? canonicalHexGeometry(cssSize);

  const colorTarget = target(gpu, {
    size: [bufferWidth, bufferHeight],
    format: LIGHT_SOURCES_FORMAT,
    label: "triangle-led-front-light-sources",
  });

  const ledVertices = ledEmitterVertexData(
    cssSize,
    LED_EMITTER_MESH_EXPANSION_PX,
  );
  const ledGeometry = geometry(gpu, {
    label: "triangle-led-front-led-emitters",
    buffers: [
      {
        data: ledVertices.buffer as ArrayBuffer,
        stride: 12,
        attributes: {
          position: "float32x2",
          led_index: "float32",
        },
      },
    ],
  });

  const ledEmittersDraw = draw(gpu, {
    shader: ledEmittersWgsl,
    label: "triangle-led-front-led-emitters-pass",
    geometry: ledGeometry,
    writeMask: ["r", "g", "b"],
    set: { cfg: initialLightSourcesUniform(), leds: opts.ledStorage },
  });

  const ready = ledEmittersDraw.compile(colorTarget);
  const emittersBundle = bundle(
    gpu,
    { target: colorTarget, label: "triangle-led-front-led-emitters" },
    (recorded) => recorded.draw(ledEmittersDraw),
  );

  return {
    texture: colorTarget,
    ready,
    encode({ frame, tunables }) {
      const uniformData = lightSourcesUniform(cssSize, dpr, tunables, hex);
      ledEmittersDraw.set({ cfg: uniformData });
      frame.pass(
        { target: colorTarget, clear: [0, 0, 0, 1000] },
        (pass: FramePass) => pass.bundles(emittersBundle),
      );
    },
    destroy() {
      (colorTarget as { destroy?: () => void }).destroy?.();
      ledGeometry.destroy();
    },
  };
}

function lightSourcesUniform(
  size: RenderSize,
  dpr: number,
  tunables: LightTunables,
  hex: ReturnType<typeof canonicalHexGeometry>,
) {
  const layout = hexEdgeLedLayout(size, LEDS_PER_EDGE);
  return {
    resolution: [size.width, size.height, dpr, 0],
    tunables: [
      tunables.ledIntensity,
      tunables.brightnessMin,
      tunables.brightnessMax,
      0,
    ],
    triangle: [hex.center.x, hex.center.y, hex.halfWidth, hex.halfHeight],
    led_clip: [
      LED_SDF_CROP_EXPANSION_PX,
      hex.fillet,
      layout.ledShape.tangentHalfLength,
      layout.ledShape.normalHalfThickness,
    ],
  };
}

function initialLightSourcesUniform() {
  return {
    resolution: [0, 0, 1, 0],
    tunables: [0, 0, 0, 0],
    triangle: [0, 0, 0, 0],
    led_clip: [0, 0, 0, 0],
  };
}

function ledEmitterVertexData(size: RenderSize, pad: number): Float32Array {
  const layout = hexEdgeLedLayout(size, LEDS_PER_EDGE);
  const { tangentHalfLength, normalHalfThickness } = layout.ledShape;
  const paddedHalfLength = tangentHalfLength + pad;
  const paddedHalfThickness = normalHalfThickness + pad;
  const values: number[] = [];

  const pushVertex = (ledIndex: number, x: number, y: number) => {
    values.push(x, y, ledIndex);
  };

  const pushQuad = (
    ledIndex: number,
    center: { x: number; y: number },
    edgeDir: { x: number; y: number },
    edgeNormal: { x: number; y: number },
    startT: number,
    endT: number,
    minN: number,
    maxN: number,
  ) => {
    const corners = [
      { t: startT, n: minN },
      { t: endT, n: minN },
      { t: endT, n: maxN },
      { t: startT, n: maxN },
    ] as const;
    const indices = [0, 1, 2, 0, 2, 3] as const;
    for (const cornerIndex of indices) {
      const corner = corners[cornerIndex];
      pushVertex(
        ledIndex,
        center.x + edgeDir.x * corner.t + edgeNormal.x * corner.n,
        center.y + edgeDir.y * corner.t + edgeNormal.y * corner.n,
      );
    }
  };

  for (const [ledIndex, led] of layout.positions.entries()) {
    const basis = edgeBasis(led.angle ?? 0);
    pushQuad(
      ledIndex,
      led,
      basis.dir,
      basis.normal,
      -paddedHalfLength,
      paddedHalfLength,
      -paddedHalfThickness,
      paddedHalfThickness,
    );
  }

  return new Float32Array(values);
}

function edgeBasis(angle: number) {
  const dir = { x: Math.cos(angle), y: Math.sin(angle) };
  return { dir, normal: { x: -dir.y, y: dir.x } };
}
