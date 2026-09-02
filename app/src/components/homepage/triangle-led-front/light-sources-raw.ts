import type { Bundle, Frame, FramePass, Gpu, Target } from 'vgpu';

import ledEmittersWgsl from './shaders/led-emitters.wgsl';
import {
  LEDS_PER_EDGE,
  LED_EMITTER_MESH_EXPANSION_PX,
  LED_SDF_CROP_EXPANSION_PX,
  canonicalHexGeometry,
  hexEdgeLedLayout,
  type RenderSize,
  type SceneTunables as LightTunables,
} from './settings';
import { bundle, draw, geometry, target } from "vgpu";

const LIGHT_SOURCES_FORMAT: GPUTextureFormat = 'rgba16float';

export interface LightSourcesRaw {
  readonly texture: Target;
  readonly ready: Promise<unknown>;
  encode(args: {
    frame: Frame;
    tunables: LightTunables;
  }): void;
  destroy(): void;
}

interface CreateLightSourcesRawOptions {
  size: readonly [number, number];
  ledStorage: unknown;
  hex?: ReturnType<typeof canonicalHexGeometry>;
}

export function createLightSourcesRaw(
  gpu: Gpu,
  opts: CreateLightSourcesRawOptions,
): LightSourcesRaw {
  const simSize: RenderSize = { width: opts.size[0], height: opts.size[1] };
  const hex = opts.hex ?? canonicalHexGeometry(simSize);

  const colorTarget = target(gpu, {
    size: [simSize.width, simSize.height],
    format: LIGHT_SOURCES_FORMAT,
    label: 'triangle-led-front-light-sources',
  });

  const ledVertices = ledEmitterVertexData(
    simSize,
    LED_EMITTER_MESH_EXPANSION_PX,
  );
  const ledGeometry = geometry(gpu, {
    label: 'triangle-led-front-led-emitters',
    buffers: [{
      data: ledVertices.buffer as ArrayBuffer,
      stride: 12,
      attributes: {
        position: 'float32x2',
        led_index: 'float32',
      },
    }],
  });

  const ledEmittersDraw = draw(gpu, {
    shader: ledEmittersWgsl,
    label: 'triangle-led-front-led-emitters-pass',
    geometry: ledGeometry,
    writeMask: ['r', 'g', 'b'],
    set: { cfg: initialLightSourcesUniform(), leds: opts.ledStorage },
  });

  const ready = ledEmittersDraw.compile(colorTarget);
  const emittersBundle = bundle(gpu, { target: colorTarget, label: 'triangle-led-front-led-emitters' },
    (recorded) => recorded.draw(ledEmittersDraw),
  );

  return {
    texture: colorTarget,
    ready,
    encode({ frame, tunables }) {
      const uniformData = lightSourcesUniform(
        simSize,
        tunables,
        hex,
      );
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
  tunables: LightTunables,
  hex: ReturnType<typeof canonicalHexGeometry>,
) {
  return {
    resolution: [size.width, size.height],
    tunables: [
      tunables.ledIntensity,
      tunables.brightnessMin,
      tunables.brightnessMax,
      0,
    ],
    triangle: [
      hex.center.x,
      hex.center.y,
      hex.circumradius,
      hex.fillet,
    ],
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

function ledEmitterVertexData(
  size: RenderSize,
  pad: number,
): Float32Array {
  const layout = hexEdgeLedLayout(size, LEDS_PER_EDGE);
  const { tangentHalfLength, normalHalfThickness } = layout.ledShape;
  const paddedHalfLength = tangentHalfLength + pad;
  const paddedHalfThickness = normalHalfThickness + pad;
  const values: number[] = [];

  const pushVertex = (
    ledIndex: number,
    x: number,
    y: number,
  ) => {
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
