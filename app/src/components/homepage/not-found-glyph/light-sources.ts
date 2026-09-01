/**
 * LED emitter pass from triangle-led-front light-sources-raw.ts (rev 90b65bf4…).
 * Quads + storage + draw + bundle. Seats come from the Lexend outline, not
 * three triangle edges. No corner-miter / RGB / floor chrome.
 */

import {
  type Bundle,
  bundle,
  type Draw,
  draw,
  type Frame,
  type FramePass,
  type Gpu,
  geometry,
  type Target,
  target,
} from "vgpu";

import {
  LED_EMITTER_MESH_EXPANSION_PX,
  LED_SDF_CROP_EXPANSION_PX,
  type SceneTunables,
} from "./led-buffer";
import ledEmittersWgsl from "./led-emitters.wgsl";
import { type GlyphLedLayout, MAX_LEDS } from "./outline";

const LIGHT_SOURCES_FORMAT: GPUTextureFormat = "rgba16float";
const FLOATS_PER_VERTEX = 3;
const VERTICES_PER_LED = 6;

export type LightSources = {
  readonly texture: Target;
  readonly ready: Promise<unknown>;
  updateMesh: (layout: GlyphLedLayout) => void;
  encode: (args: {
    frame: Frame;
    tunables: SceneTunables;
    sdf: Target;
    sdfSampler: GPUSampler;
    ledStorage: unknown;
  }) => void;
  destroy: () => void;
};

export function createLightSources(
  gpu: Gpu,
  size: readonly [number, number],
  ledStorage: unknown,
): LightSources {
  const simSize = { width: size[0], height: size[1] };
  const colorTarget = target(gpu, {
    size: [simSize.width, simSize.height],
    format: LIGHT_SOURCES_FORMAT,
    label: "404-led-emitters",
  });

  const ledVertices = new Float32Array(
    MAX_LEDS * VERTICES_PER_LED * FLOATS_PER_VERTEX,
  );
  const ledGeometry = geometry(gpu, {
    label: "404-led-emitters",
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
    label: "404-led-emitters-pass",
    geometry: ledGeometry,
    writeMask: ["r", "g", "b"],
    set: { cfg: initialLightSourcesUniform(), leds: ledStorage },
  });

  const ready = ledEmittersDraw.compile(colorTarget);
  let vertexCount = 0;
  let emittersBundle = recordBundle(
    gpu,
    colorTarget,
    ledEmittersDraw,
    vertexCount,
  );

  return {
    texture: colorTarget,
    ready,
    updateMesh(layout) {
      const next = ledEmitterVertexData(layout, LED_EMITTER_MESH_EXPANSION_PX);
      ledVertices.fill(0);
      ledVertices.set(next);
      ledGeometry.write(ledVertices.buffer as ArrayBuffer);
      vertexCount =
        Math.min(MAX_LEDS, layout.positions.length) * VERTICES_PER_LED;
      emittersBundle = recordBundle(
        gpu,
        colorTarget,
        ledEmittersDraw,
        vertexCount,
      );
    },
    encode({ frame, tunables, sdf, sdfSampler, ledStorage: storage }) {
      ledEmittersDraw.set({
        cfg: lightSourcesUniform(simSize, tunables),
        leds: storage,
        sdf_tex: sdf,
        sdf_samp: sdfSampler,
      });
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

function recordBundle(
  gpu: Gpu,
  colorTarget: Target,
  ledEmittersDraw: Draw,
  vertices: number,
): Bundle {
  return bundle(
    gpu,
    { target: colorTarget, label: "404-led-emitters" },
    (recorded) => recorded.draw(ledEmittersDraw, { vertices }),
  );
}

function lightSourcesUniform(
  size: { width: number; height: number },
  tunables: SceneTunables,
) {
  return {
    resolution: [size.width, size.height],
    tunables: [
      tunables.ledIntensity,
      tunables.brightnessMin,
      tunables.brightnessMax,
      0,
    ],
    triangle: [0, 0, 0, 0],
    led_clip: [LED_SDF_CROP_EXPANSION_PX, 0, 0, 0],
  };
}

function initialLightSourcesUniform() {
  return {
    resolution: [0, 0],
    tunables: [0, 0, 0, 0],
    triangle: [0, 0, 0, 0],
    led_clip: [0, 0, 0, 0],
  };
}

export function ledEmitterVertexData(
  layout: GlyphLedLayout,
  pad: number,
): Float32Array {
  const { tangentHalfLength, normalHalfThickness } = layout.shape;
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

  const count = Math.min(MAX_LEDS, layout.positions.length);
  for (let ledIndex = 0; ledIndex < count; ledIndex++) {
    const led = layout.positions[ledIndex]!;
    const basis = edgeBasis(led.angle);
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
