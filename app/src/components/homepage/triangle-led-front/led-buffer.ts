import {
  HEX_SIDES,
  HERO_STATE_MODES,
  LEDS_PER_EDGE,
  NOISE_ROTATION_START_SECONDS,
  hexEdgeLedLayout,
  sdfHexPointyRounded,
  type BrushState,
  type HeroStateMode,
  type HeroStateSettings,
  type HoverRgbTintSettings,
  type RenderSize,
  type SceneTunables,
} from './settings';

const LED_FLOATS = 8;
const LED_COUNT = LEDS_PER_EDGE * HEX_SIDES;
const PERIMETER_SCALE = HEX_SIDES / 3;
const COLOR_OFFSET = 4;
const MAX_FRAME_DELTA = 0.1;
const CLICK_SPEED_BOOST_PEAK = 10;
const INACTIVE_EDGE_BRIGHTNESS_FACTOR = 0.125;
// docs.page honey #E69135 (sRGB 230,145,53) → IEC 61966-2-1 linear.
const HONEY_LINEAR = { r: 0.791298, g: 0.283149, b: 0.035601 };
// docs.page periwinkle #5368BD (sRGB 83,104,189) → linear, then scaled so
// luma matches honey (0.373) at the same ledIntensity.
const PERIWINKLE_LINEAR = { r: 0.209497, g: 0.33527, b: 1.232469 };

const LINE_CENTERS_START = [
  6,
  6 + LEDS_PER_EDGE * 2,
  6 + LEDS_PER_EDGE * 4,
] as const;
const LINE_VELOCITIES = [
  -3.302 * PERIMETER_SCALE,
  -2.355 * PERIMETER_SCALE,
  -1.636 * PERIMETER_SCALE,
] as const;
const LINE_SIZE_MIN = LEDS_PER_EDGE * PERIMETER_SCALE;
const LINE_SIZE_MAX = LEDS_PER_EDGE * 1.7 * PERIMETER_SCALE;
const LINE_SIZE_MID = (LINE_SIZE_MIN + LINE_SIZE_MAX) / 2;
const LINE_SIZE_AMP = (LINE_SIZE_MAX - LINE_SIZE_MIN) / 2;
const LINE_SIZE_FREQ = [0.41, 0.31, 0.23] as const;
const LINE_SIZE_PHASE = [0, 2.1, 4.2] as const;
const LINE_FADE_FREQ = [0.52, 0.38, 0.28] as const;
const LINE_FADE_PHASE = [Math.PI / 2, 0.4, -0.6] as const;
const HOVER_FADE_SECONDS = 0.3;
const HOVER_HYSTERESIS = 1.2;

interface Point {
  x: number;
  y: number;
}

export interface LedGeometryState {
  data: Float32Array;
  currentState: Float32Array;
  targetState: Float32Array;
  deployingState: Float32Array;
  normals: Float32Array;
  triangleHeight: number;
  deployEdgeCenters: readonly [Point, Point, Point];
  hexVertices: readonly [Point, Point, Point, Point, Point, Point];
  hexCenter: Point;
  hexCircumradius: number;
  hexFillet: number;
  lastMode: HeroStateMode | undefined;
  lastEdgeIndex: number | undefined;
  transitionStart: number;
  transitionDuration: number;
  transitionActive: boolean;
  animationClock: number;
  lastFrameTime: number | undefined;
  lineCenters: Float32Array;
  lineVelocities: Float32Array;
  glowState: Float32Array;
  glowDecaying: boolean;
  hoverTransition: number;
  hoverActive: boolean;
}

export interface HoverDeployAnimationState {
  factor: number;
  tint: Pick<
    HoverRgbTintSettings,
    | 'amount'
    | 'radius'
    | 'power'
    | 'edgeRedLinear'
    | 'edgeGreenLinear'
    | 'edgeBlueLinear'
    | 'edgeOverlap'
  >;
}

export function buildLedGeometry(
  size: RenderSize,
  previous?: LedGeometryState,
): LedGeometryState {
  const layout = hexEdgeLedLayout(size, LEDS_PER_EDGE);
  const data = new Float32Array(layout.positions.length * LED_FLOATS);
  const currentState = new Float32Array(data.length);
  const targetState = new Float32Array(data.length);
  const deployingState = new Float32Array(data.length);
  const normals = new Float32Array(layout.positions.length * 2);
  for (const [i, p] of layout.positions.entries()) {
    const base = i * LED_FLOATS;
    const x = p.x;
    const y = p.y;
    const angle = p.angle ?? 0;
    data[base] = x;
    data[base + 1] = y;
    data[base + 2] = 0;
    data[base + 3] = angle;
    data[base + COLOR_OFFSET] = HONEY_LINEAR.r;
    data[base + COLOR_OFFSET + 1] = HONEY_LINEAR.g;
    data[base + COLOR_OFFSET + 2] = HONEY_LINEAR.b;
    data[base + COLOR_OFFSET + 3] = 0;
    const rx = x - layout.center.x;
    const ry = y - layout.center.y;
    let nx = -Math.sin(angle);
    let ny = Math.cos(angle);
    if (nx * rx + ny * ry < 0) {
      nx = -nx;
      ny = -ny;
    }
    normals[i * 2] = nx;
    normals[i * 2 + 1] = ny;
  }
  currentState.set(data);
  targetState.set(data);
  deployingState.set(data);
  return {
    data,
    currentState,
    targetState,
    deployingState,
    normals,
    triangleHeight: layout.geometry.height,
    deployEdgeCenters: [
      midpoint(layout.geometry.vertices[0], layout.geometry.vertices[1]),
      midpoint(layout.geometry.vertices[2], layout.geometry.vertices[3]),
      midpoint(layout.geometry.vertices[4], layout.geometry.vertices[5]),
    ],
    hexVertices: layout.geometry.vertices,
    hexCenter: layout.center,
    hexCircumradius: layout.geometry.circumradius,
    hexFillet: layout.geometry.fillet,
    lastMode: previous?.lastMode,
    lastEdgeIndex: previous?.lastEdgeIndex,
    transitionStart: 0,
    transitionDuration: 0,
    transitionActive: false,
    animationClock: previous?.animationClock ?? 0,
    lastFrameTime: previous?.lastFrameTime,
    lineCenters: previous?.lineCenters ?? Float32Array.from(LINE_CENTERS_START),
    lineVelocities:
      previous?.lineVelocities ?? Float32Array.from(LINE_VELOCITIES),
    glowState:
      previous?.glowState?.length === LED_COUNT
        ? previous.glowState
        : new Float32Array(LED_COUNT),
    glowDecaying: previous?.glowDecaying ?? false,
    hoverTransition: previous?.hoverTransition ?? 0,
    hoverActive: previous?.hoverActive ?? false,
  };
}

export function computeLeds(
  leds: LedGeometryState,
  time: number,
  tunables: SceneTunables,
  settings: HeroStateSettings,
  hoverDeploy?: HoverDeployAnimationState,
  brush?: BrushState,
) {
  const firstFrame = leds.lastFrameTime === undefined;
  const frameDelta =
    leds.lastFrameTime === undefined
      ? 0
      : Math.max(0, Math.min(time - leds.lastFrameTime, MAX_FRAME_DELTA));
  leds.lastFrameTime = time;
  const clickBoost =
    1 +
    (CLICK_SPEED_BOOST_PEAK - 1) *
      Math.sin(clamp01(hoverDeploy?.factor ?? 0) * Math.PI);
  const boostedDelta = frameDelta * clickBoost;
  if (firstFrame) leds.animationClock = NOISE_ROTATION_START_SECONDS;
  leds.animationClock += boostedDelta;
  const animTime = leds.animationClock;

  const edgeIndex = sanitizeEdgeIndex(settings.edgeIndex);
  const edgeChanged =
    settings.mode === HERO_STATE_MODES.edge &&
    leds.lastEdgeIndex !== undefined &&
    edgeIndex !== leds.lastEdgeIndex;
  const modeEntry =
    leds.lastMode === undefined || settings.mode !== leds.lastMode;
  if (leds.lastMode === undefined) {
    leds.lastMode = settings.mode;
    leds.lastEdgeIndex = edgeIndex;
    leds.transitionActive = false;
  } else if (settings.mode !== leds.lastMode || edgeChanged) {
    leds.currentState.set(leds.data);
    leds.transitionStart = time;
    leds.transitionDuration = Math.max(0, settings.transitionDuration);
    leds.transitionActive = leds.transitionDuration > 0;
    leds.lastMode = settings.mode;
    leds.lastEdgeIndex = edgeIndex;
  }
  if (modeEntry && settings.mode === HERO_STATE_MODES.lines) {
    leds.lineCenters.set(LINE_CENTERS_START);
  }

  if (settings.mode === HERO_STATE_MODES.edge) {
    updateEdge(
      leds.targetState,
      edgeIndex,
      tunables.brightnessMin * INACTIVE_EDGE_BRIGHTNESS_FACTOR,
      settings.edgeHighlightBrightness,
    );
  } else {
    updateLines(leds, leds.targetState, animTime, boostedDelta);
  }

  const linesHoverEnabled =
    settings.mode === HERO_STATE_MODES.lines &&
    (brush?.linesFadeDistance ?? 0) > 0;
  let hoverTransition = 0;
  if (linesHoverEnabled) {
    let hoverTarget = 0;
    if (
      brush?.active === true &&
      brush.isMouse === true &&
      brush.inside !== true
    ) {
      const enter = (brush.linesFadeDistance ?? 0) * leds.triangleHeight;
      const distance = sdfHexPointyRounded(
        { x: brush.x, y: brush.y },
        leds.hexCenter,
        leds.hexCircumradius,
        leds.hexFillet,
      );
      if (!leds.hoverActive && distance < enter) leds.hoverActive = true;
      else if (leds.hoverActive && distance > enter * HOVER_HYSTERESIS)
        leds.hoverActive = false;
      hoverTarget = leds.hoverActive ? 1 : 0;
    } else {
      leds.hoverActive = false;
    }
    if (leds.hoverTransition > 0.0001 || hoverTarget > 0) {
      const alpha =
        HOVER_FADE_SECONDS > 0
          ? 1 - Math.exp(-frameDelta / HOVER_FADE_SECONDS)
          : 1;
      leds.hoverTransition += (hoverTarget - leds.hoverTransition) * alpha;
    }
    hoverTransition = clamp01(leds.hoverTransition);
    if (hoverTransition > 0.0001) {
      const linesFade = 1 - hoverTransition;
      for (let i = 0; i < LED_COUNT; i++) {
        leds.targetState[i * LED_FLOATS + 2] *= linesFade;
      }
    }
  } else if (leds.hoverTransition !== 0 || leds.hoverActive) {
    leds.hoverTransition = 0;
    leds.hoverActive = false;
  }

  if (leds.transitionActive) {
    const progress = clamp01(
      (time - leds.transitionStart) / leds.transitionDuration,
    );
    lerpLedState(
      leds.data,
      leds.currentState,
      leds.targetState,
      easeInQuad(progress),
    );
    if (progress >= 1) leds.transitionActive = false;
  } else {
    leds.data.set(leds.targetState);
  }

  const deployFactor = clamp01(hoverDeploy?.factor ?? 0);
  if (deployFactor > 0) {
    updateDeployingRgb(leds, leds.deployingState);
    lerpLedState(leds.data, leds.data, leds.deployingState, deployFactor);
  }

  const hoverGate = linesHoverEnabled ? hoverTransition : 1;
  const glowStrength = brush?.glowStrength ?? 0;
  const glowRadius = brush?.glowRadius ?? 0;
  const glowOn =
    brush?.active === true &&
    brush.isMouse === true &&
    brush.glowEnabled === true &&
    glowStrength > 0 &&
    glowRadius > 0;
  if (glowOn || leds.glowDecaying) {
    const smoothing = brush?.glowSmoothing ?? 0;
    const alpha = smoothing > 0 ? 1 - Math.exp(-frameDelta / smoothing) : 1;
    const px = brush?.x ?? 0;
    const py = brush?.y ?? 0;
    const facingOn = brush?.glowFacingEnabled === true;
    const facingCosFull = Math.cos(
      ((brush?.glowFacingFullDeg ?? 90) * Math.PI) / 180,
    );
    const facingCosZero = Math.cos(
      ((brush?.glowFacingZeroDeg ?? 100) * Math.PI) / 180,
    );
    const facingDenom = facingCosFull - facingCosZero;
    let anyActive = false;
    for (let i = 0; i < LED_COUNT; i++) {
      const base = i * LED_FLOATS;
      let target = 0;
      if (glowOn) {
        const dx = (leds.data[base] ?? 0) - px;
        const dy = (leds.data[base + 1] ?? 0) - py;
        const distance = Math.hypot(dx, dy);
        target = glowStrength * (1 - smoothstep(0, glowRadius, distance));
        if (facingOn && target > 0 && distance > 1e-4) {
          const cos =
            (leds.normals[i * 2] ?? 0) * (-dx / distance) +
            (leds.normals[i * 2 + 1] ?? 0) * (-dy / distance);
          const facing =
            facingDenom > 1e-6
              ? clamp01((cos - facingCosZero) / facingDenom)
              : cos >= facingCosFull
                ? 1
                : 0;
          target *= facing;
        }
      }
      const eased =
        (leds.glowState[i] ?? 0) +
        (target - (leds.glowState[i] ?? 0)) * alpha;
      leds.glowState[i] = eased;
      if (eased > 0.0001) {
        anyActive = true;
        const lift = eased * hoverGate;
        if (lift > 0.0001)
          leds.data[base + 2] = mix(leds.data[base + 2] ?? 0, 1, lift);
      }
    }
    leds.glowDecaying = glowOn || anyActive;
  }
}

function updateLines(
  leds: LedGeometryState,
  target: Float32Array,
  animTime: number,
  boostedDelta: number,
) {
  for (let k = 0; k < 3; k++) {
    leds.lineCenters[k] = wrapIndex(
      (leds.lineCenters[k] ?? 0) +
        (leds.lineVelocities[k] ?? 0) * boostedDelta,
    );
  }
  const fadeTime = animTime - NOISE_ROTATION_START_SECONDS;
  const halfByBand: number[] = [];
  const plateauByBand: number[] = [];
  const fadeByBand: number[] = [];
  for (let k = 0; k < 3; k++) {
    const size =
      LINE_SIZE_MID +
      LINE_SIZE_AMP *
        Math.sin(
          fadeTime * (LINE_SIZE_FREQ[k] ?? 0) +
            (LINE_SIZE_PHASE[k] ?? 0),
        );
    const half = Math.max(1, size * 0.5);
    halfByBand[k] = half;
    plateauByBand[k] = half * 0.5;
    fadeByBand[k] =
      0.5 +
      0.5 *
        Math.sin(
          fadeTime * (LINE_FADE_FREQ[k] ?? 0) +
            (LINE_FADE_PHASE[k] ?? 0),
        );
  }
  for (let i = 0; i < LED_COUNT; i++) {
    let coverage = 0;
    for (let k = 0; k < 3; k++) {
      const distance = Math.abs(
        signedWrappedDistance(i, leds.lineCenters[k] ?? 0, LED_COUNT),
      );
      const half = halfByBand[k] ?? 1;
      const plateau = plateauByBand[k] ?? 0;
      let profile = 0;
      if (distance <= plateau) {
        profile = 1;
      } else {
        profile = clamp01(1 - (distance - plateau) / (half - plateau));
      }
      coverage = Math.max(coverage, profile * (fadeByBand[k] ?? 0));
    }
    writeLed(target, i, clamp01(coverage), HONEY_LINEAR.r, HONEY_LINEAR.g, HONEY_LINEAR.b);
  }
}

function updateEdge(
  target: Float32Array,
  edgeIndex: number,
  baseBrightness: number,
  highlightBrightness: number,
) {
  const start = edgeIndex * LEDS_PER_EDGE;
  const end = start + LEDS_PER_EDGE;
  const base = clamp01(baseBrightness);
  const highlight = clamp01(highlightBrightness);
  for (let i = 0; i < LED_COUNT; i++) {
    writeLed(
      target,
      i,
      i >= start && i < end ? highlight : base,
      HONEY_LINEAR.r,
      HONEY_LINEAR.g,
      HONEY_LINEAR.b,
    );
  }
}

function updateDeployingRgb(
  leds: LedGeometryState,
  target: Float32Array,
) {
  target.set(leds.data);
  for (let i = 0; i < LED_COUNT; i++) {
    writeLedColor(
      target,
      i,
      PERIWINKLE_LINEAR.r,
      PERIWINKLE_LINEAR.g,
      PERIWINKLE_LINEAR.b,
    );
  }
}

function midpoint(a: Point, b: Point) {
  return { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 };
}

function lerpLedState(
  target: Float32Array,
  from: Float32Array,
  to: Float32Array,
  t: number,
) {
  for (let i = 0; i < target.length; i++) {
    const a = from[i] ?? 0;
    target[i] = a + ((to[i] ?? 0) - a) * t;
  }
}

function writeLed(
  target: Float32Array,
  i: number,
  brightness: number,
  r: number,
  g: number,
  b: number,
) {
  const base = i * LED_FLOATS;
  target[base + 2] = brightness;
  target[base + COLOR_OFFSET] = r;
  target[base + COLOR_OFFSET + 1] = g;
  target[base + COLOR_OFFSET + 2] = b;
}

function writeLedColor(
  target: Float32Array,
  i: number,
  r: number,
  g: number,
  b: number,
) {
  const base = i * LED_FLOATS;
  target[base + COLOR_OFFSET] = r;
  target[base + COLOR_OFFSET + 1] = g;
  target[base + COLOR_OFFSET + 2] = b;
}

function signedWrappedDistance(a: number, b: number, period: number) {
  return ((((a - b) % period) + period + period / 2) % period) - period / 2;
}

function wrapIndex(value: number) {
  return ((value % LED_COUNT) + LED_COUNT) % LED_COUNT;
}

function sanitizeEdgeIndex(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(HEX_SIDES - 1, Math.round(value)));
}

function easeInQuad(t: number) {
  const x = clamp01(t);
  return x * x;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
