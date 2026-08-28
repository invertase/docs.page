import {
  type Effect,
  effect,
  frame,
  type Gpu,
  type Surface,
  sampler,
  type Target,
  target,
} from "vgpu";

import emitWgsl from "./emit.wgsl";
import jfaInitWgsl from "./jfa-init.wgsl";
import jfaPassWgsl from "./jfa-pass.wgsl";
import presentWgsl from "./present.wgsl";
import radianceCascadeWgsl from "./radiance-cascade.wgsl";
import sdfFinalizeWgsl from "./sdf-finalize.wgsl";

type Output = Surface | Target;
type Vec2 = readonly [number, number];

const HDR_FORMAT: GPUTextureFormat = "rgba16float";
const SEED_FORMAT: GPUTextureFormat = "rgba32float";
const RC_INTERVAL0 = 2;
const DIRECTION_BASE = 2;

export type DotsUniforms = {
  origin: readonly [number, number];
  css_size: readonly [number, number];
  pointer: readonly [number, number];
  enabled: number;
  honey: readonly [number, number, number, number];
  dense_cell: number;
  page_cell: number;
  dot_radius: number;
  head_inner: number;
  head_outer: number;
  trail: readonly (readonly [number, number, number, number])[];
};

export function createScene(gpu: Gpu, requestedSize: Vec2) {
  const width = Math.max(1, Math.floor(requestedSize[0]));
  const height = Math.max(1, Math.floor(requestedSize[1]));
  const size: Vec2 = [width, height];
  const cascadeCount = Math.min(
    4,
    Math.max(
      3,
      Math.ceil(
        Math.log(1 + (3 * Math.hypot(width, height)) / RC_INTERVAL0) /
          Math.log(4),
      ),
    ),
  );
  const coarsest = 2 ** (cascadeCount - 1);
  const atlas: Vec2 = [
    Math.ceil(width / coarsest) * coarsest * DIRECTION_BASE,
    Math.ceil(height / coarsest) * coarsest * DIRECTION_BASE,
  ];
  const jumpCount = Math.ceil(Math.log2(Math.max(width, height, 2)));
  const jumps = [
    ...Array.from({ length: jumpCount }, (_, index) =>
      Math.max(1, 2 ** (jumpCount - index - 1)),
    ),
    1,
    1,
  ];
  const created: Target[] = [];
  const own = (resource: Target) => {
    created.push(resource);
    return resource;
  };

  try {
    const emitter = own(target(gpu, { size, format: HDR_FORMAT }));
    const jfa: [Target, Target] = [
      own(target(gpu, { size, format: SEED_FORMAT })),
      own(target(gpu, { size, format: SEED_FORMAT })),
    ];
    const sdf = own(target(gpu, { size, format: HDR_FORMAT }));
    const cascades: [Target, Target] = [
      own(target(gpu, { size: atlas, format: HDR_FORMAT })),
      own(target(gpu, { size: atlas, format: HDR_FORMAT })),
    ];
    return {
      gpu,
      size,
      atlas,
      directionBase: DIRECTION_BASE,
      cascadeCount,
      jumps,
      emitter,
      jfa,
      sdf,
      cascades,
      effects: {
        emit: effect(gpu, emitWgsl, { label: "404-emit" }),
        jfaInit: effect(gpu, jfaInitWgsl, { label: "404-jfa-init" }),
        jfaSteps: jumps.map(() =>
          effect(gpu, jfaPassWgsl, { label: "404-jfa-step" }),
        ),
        sdfFinalize: effect(gpu, sdfFinalizeWgsl, { label: "404-sdf" }),
        cascade: Array.from({ length: cascadeCount }, () =>
          effect(gpu, radianceCascadeWgsl, { label: "404-cascade" }),
        ),
        present: effect(gpu, presentWgsl, { label: "404-present" }),
      },
      sampler: sampler(gpu, {
        minFilter: "linear",
        magFilter: "linear",
        addressModeU: "clamp-to-edge",
        addressModeV: "clamp-to-edge",
      }),
    };
  } catch (error) {
    try {
      destroyTargets(created);
    } catch {
      // Preserve the allocation error after best-effort rollback.
    }
    throw error;
  }
}

export type GlyphScene = ReturnType<typeof createScene>;

export async function prepareScene(
  scene: GlyphScene,
  outputFormat: GPUTextureFormat,
): Promise<void> {
  await Promise.all([
    scene.effects.emit.compile({ colors: [HDR_FORMAT] }),
    scene.effects.jfaInit.compile({ colors: [SEED_FORMAT] }),
    ...scene.effects.jfaSteps.map((shader) =>
      shader.compile({ colors: [SEED_FORMAT] }),
    ),
    scene.effects.sdfFinalize.compile({ colors: [HDR_FORMAT] }),
    ...scene.effects.cascade.map((shader) =>
      shader.compile({ colors: [HDR_FORMAT] }),
    ),
    scene.effects.present.compile({ colors: [outputFormat] }),
  ]);
}

export function destroyScene(scene: GlyphScene): void {
  destroyTargets([scene.emitter, ...scene.jfa, scene.sdf, ...scene.cascades]);
}

function destroyTargets(targets: readonly Target[]): void {
  let firstError: unknown;
  for (let index = targets.length - 1; index >= 0; index--) {
    try {
      (targets[index] as Target & { destroy?: () => void }).destroy?.();
    } catch (error) {
      firstError ??= error;
    }
  }
  if (firstError) throw firstError;
}

function buildChain(scene: GlyphScene, dots: DotsUniforms, glyph: GPUTexture) {
  const { effects } = scene;
  const passes: { readonly target: Target; readonly effect: Effect }[] = [];

  effects.emit.set({
    dots,
    glyph,
    glyph_samp: scene.sampler,
  });
  passes.push({ target: scene.emitter, effect: effects.emit });

  effects.jfaInit.set({ emitter: scene.emitter });
  passes.push({ target: scene.jfa[0], effect: effects.jfaInit });
  let seedRead = scene.jfa[0];
  let seedWrite = scene.jfa[1];
  scene.jumps.forEach((jump, index) => {
    const shader = effects.jfaSteps[index]!;
    shader.set({ jfa: { jump: [jump, 0, 0, 0] }, seeds: seedRead });
    passes.push({ target: seedWrite, effect: shader });
    [seedRead, seedWrite] = [seedWrite, seedRead];
  });
  scene.jfa = [seedRead, seedWrite];

  effects.sdfFinalize.set({ seeds: seedRead });
  passes.push({ target: scene.sdf, effect: effects.sdfFinalize });

  let atlasWrite = scene.cascades[0];
  let atlasRead = scene.cascades[1];
  for (let cascade = scene.cascadeCount - 1; cascade >= 0; cascade--) {
    const shader = effects.cascade[cascade]!;
    shader.set({
      rc: {
        state: [
          cascade,
          cascade < scene.cascadeCount - 1 ? 1 : 0,
          scene.directionBase,
          0,
        ],
      },
      sdf_tex: scene.sdf,
      sdf_samp: scene.sampler,
      emitter_tex: scene.emitter,
      emitter_samp: scene.sampler,
      upper_tex: atlasRead,
    });
    passes.push({ target: atlasWrite, effect: shader });
    [atlasRead, atlasWrite] = [atlasWrite, atlasRead];
  }
  scene.cascades = [atlasRead, atlasWrite];
  return passes;
}

export function renderLighting(
  scene: GlyphScene,
  dots: DotsUniforms,
  glyph: GPUTexture,
): void {
  const passes = buildChain(scene, dots, glyph);
  frame(scene.gpu, (currentFrame) => {
    for (const pass of passes) {
      currentFrame.pass(
        { target: pass.target, clear: [0, 0, 0, 0] },
        (encoder) => encoder.draw(pass.effect),
      );
    }
  });
}

export function presentScene(
  scene: GlyphScene,
  output: Output,
  glyph: GPUTexture,
  honey: readonly [number, number, number],
): void {
  scene.effects.present.set({
    present: {
      display: [1.12, 0, 0, scene.directionBase],
      honey: [honey[0], honey[1], honey[2], 1],
    },
    cascade_tex: scene.cascades[0],
    emitter_tex: scene.emitter,
    glyph_tex: glyph,
    glyph_samp: scene.sampler,
  });
  frame(scene.gpu, (currentFrame) => {
    currentFrame.pass({ target: output, clear: [0, 0, 0, 0] }, (encoder) =>
      encoder.draw(scene.effects.present),
    );
  });
}
