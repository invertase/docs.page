export interface RenderSize {
  width: number;
  height: number;
}

export const LEDS_PER_EDGE = 24;
export const HEX_SIDES = 6;
export const LED_COUNT = LEDS_PER_EDGE * HEX_SIDES;
/** CSS pad so hex-style bloom can sit outside the chip box. */
export const CHIP_BLOOM_CSS = 32;
export const TRIANGLE_HEIGHT_RATIO = (180 / 630) * 0.8 * 1.6 * 1.5 * 1.5 * 0.8;
export const HERO_CANVAS_MAX_CSS = 720;
const MIN_SIM_HEIGHT = 360;
const LED_RADIUS_TO_TRIANGLE_HEIGHT = 0.0236;
const LED_NORMAL_HALF_THICKNESS_TO_RADIUS = 2;
const LED_TANGENT_GAP_PX = 1;
const LED_MESH_INSET_PX = 5;

export const LED_SDF_CROP_EXPANSION_PX = 2;
export const LED_EMITTER_MESH_EXPANSION_PX = 1;
export const NOISE_ROTATION_START_SECONDS = 10;
export const BRIGHTNESS_MIN_HOVER_MULTIPLIER = 4;
export const BRIGHTNESS_MIN_HOVER_SMOOTHING = 0.2;

export const HERO_STATE_MODES = {
  edge: "edge",
  lines: "lines",
} as const;
export type HeroStateMode =
  (typeof HERO_STATE_MODES)[keyof typeof HERO_STATE_MODES];

export interface HeroStateSettings {
  mode: HeroStateMode;
  transitionDuration: number;
  edgeIndex: number;
  edgeHighlightBrightness: number;
}

export const HERO_STATE_DEFAULTS: HeroStateSettings = {
  mode: HERO_STATE_MODES.lines,
  transitionDuration: 0.25,
  edgeIndex: 0,
  edgeHighlightBrightness: 0.4,
};

export interface BrushSettings {
  glowEnabled?: boolean;
  glowRadius?: number;
  glowStrength?: number;
  glowSmoothing?: number;
  glowFacingEnabled?: boolean;
  glowFacingFullDeg?: number;
  glowFacingZeroDeg?: number;
  linesFadeDistance?: number;
}

export interface BrushState extends BrushSettings {
  x: number;
  y: number;
  active: boolean;
  inside?: boolean;
  isMouse?: boolean;
}

export interface SceneTunables {
  ledIntensity: number;
  brightnessMin: number;
  brightnessMinDark: number;
  brightnessMax: number;
}

export const DEFAULT_BRUSH: BrushSettings = {
  glowEnabled: true,
  glowRadius: 165,
  glowStrength: 1,
  glowSmoothing: 0.23,
  glowFacingEnabled: true,
  glowFacingFullDeg: 90,
  glowFacingZeroDeg: 100,
  linesFadeDistance: 0.6,
};

export const TUNABLE_DEFAULTS = {
  // Honey linear luma is ~0.373 vs white 1. Scale so the rest rim matches
  // the signed-off white glow energy on all three edges.
  ledIntensity: 2.68,
  brightnessMin: 0.09,
  brightnessMinDark: 0.05,
  brightnessMax: 1,
} as const;

interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface HoverRgbTintSettings {
  enabled: boolean;
  amount: number;
  radius: number;
  power: number;
  responseSmoothing: number;
  edgeRedLinear: Rgb;
  edgeGreenLinear: Rgb;
  edgeBlueLinear: Rgb;
  edgeOverlap: number;
}

export const HOVER_RGB_TINT_DEFAULTS: HoverRgbTintSettings = {
  enabled: true,
  amount: 1,
  radius: 173,
  power: 3,
  responseSmoothing: 0.2,
  edgeRedLinear: { r: 0.896269, g: 0.027321, b: 0.051269 },
  edgeGreenLinear: { r: 0, g: 0.40724, b: 0.048172 },
  edgeBlueLinear: { r: 0, g: 0.278894, b: 1 },
  edgeOverlap: 1,
};

export function simulationFloorFactor(cssHeight: number) {
  return Math.max(1, MIN_SIM_HEIGHT / Math.max(1, cssHeight));
}

interface LedPosition {
  x: number;
  y: number;
  angle?: number;
}

export type HexVertex = LedPosition;
export type HexVertices = readonly [
  HexVertex,
  HexVertex,
  HexVertex,
  HexVertex,
  HexVertex,
  HexVertex,
];

export interface HexGeometry {
  center: LedPosition;
  vertices: HexVertices;
  height: number;
  circumradius: number;
  inradius: number;
  sideLength: number;
  fillet: number;
  halfWidth: number;
  halfHeight: number;
}

interface HexLedShape {
  normalHalfThickness: number;
  tangentHalfLength: number;
  cornerTrim: number;
  centerSpacing: number;
}

export interface HexLayout {
  center: LedPosition;
  positions: LedPosition[];
  geometry: HexGeometry;
  ledShape: HexLedShape;
}

export interface ChipFrame {
  canvasWidth: number;
  canvasHeight: number;
  radius: number;
  padX: number;
  padY: number;
}

const defaultChipFrame: ChipFrame = {
  canvasWidth: 400,
  canvasHeight: 80,
  radius: 12,
  padX: CHIP_BLOOM_CSS,
  padY: CHIP_BLOOM_CSS,
};

let chipFrame: ChipFrame = { ...defaultChipFrame };
let lastChipRect = { halfWidth: 1, halfHeight: 1 };

export function setChipFrame(next: Partial<ChipFrame>) {
  chipFrame = {
    ...chipFrame,
    ...next,
  };
}

export function setHeroSceneScale(_scale: number) {
  // Chip outline is measured from the rounded-xl box — do not inherit hex zoom.
}

export function resolveHeroSceneScale(baseZoom: number) {
  return baseZoom;
}

export function canonicalHexGeometry(size: RenderSize): HexGeometry {
  const scaleX = size.width / Math.max(1, chipFrame.canvasWidth);
  const scaleY = size.height / Math.max(1, chipFrame.canvasHeight);
  const padX = chipFrame.padX * scaleX;
  const padY = chipFrame.padY * scaleY;
  const fillet = Math.max(0, chipFrame.radius * Math.min(scaleX, scaleY));
  const halfW = Math.max(1, size.width * 0.5 - padX);
  const halfH = Math.max(1, size.height * 0.5 - padY);
  const center = { x: size.width * 0.5, y: size.height * 0.5 };
  const height = halfH * 2;
  // Same bloom scale the hex uses on a canvas of this sim height (#542).
  const circumradius = size.height * TRIANGLE_HEIGHT_RATIO * 0.5;
  lastChipRect = { halfWidth: halfW, halfHeight: halfH };
  const vertices: HexVertices = [
    { x: center.x - halfW + fillet, y: center.y - halfH },
    { x: center.x + halfW - fillet, y: center.y - halfH },
    { x: center.x + halfW, y: center.y - halfH + fillet },
    { x: center.x + halfW, y: center.y + halfH - fillet },
    { x: center.x + halfW - fillet, y: center.y + halfH },
    { x: center.x - halfW + fillet, y: center.y + halfH },
  ];
  return {
    center,
    vertices,
    height,
    circumradius,
    inradius: halfH,
    sideLength: halfW * 2,
    fillet,
    halfWidth: halfW,
    halfHeight: halfH,
  };
}

export function sdfHexPointyRounded(
  point: LedPosition,
  center: LedPosition,
  _circumradius: number,
  fillet: number,
) {
  return sdfRoundedBox(
    point,
    center,
    lastChipRect.halfWidth,
    lastChipRect.halfHeight,
    fillet,
  );
}

export function sdfRoundedBox(
  point: LedPosition,
  center: LedPosition,
  halfW: number,
  halfH: number,
  fillet: number,
) {
  const radius = Math.max(0, Math.min(fillet, halfW, halfH));
  const qx = Math.abs(point.x - center.x) - (halfW - radius);
  const qy = Math.abs(point.y - center.y) - (halfH - radius);
  const ox = Math.max(qx, 0);
  const oy = Math.max(qy, 0);
  return Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius;
}

function hexLedRadius(size: RenderSize) {
  return canonicalHexGeometry(size).height * LED_RADIUS_TO_TRIANGLE_HEIGHT;
}

function hexLedNormalHalfThickness(size: RenderSize) {
  return hexLedRadius(size) * LED_NORMAL_HALF_THICKNESS_TO_RADIUS;
}

function ledMeshInsetPx(geometry: HexGeometry) {
  const refHeight = HERO_CANVAS_MAX_CSS * TRIANGLE_HEIGHT_RATIO;
  return (LED_MESH_INSET_PX * Math.min(geometry.height, refHeight)) / refHeight;
}

/** Parallel-offset the chip rect the way #542 scales the hex in by `LED_MESH_INSET_PX`. */
function insetChipGeometry(geometry: HexGeometry): HexGeometry {
  const inset = ledMeshInsetPx(geometry);
  const halfW = Math.max(1, geometry.halfWidth - inset);
  const halfH = Math.max(1, geometry.halfHeight - inset);
  const fillet = Math.max(0, Math.min(geometry.fillet - inset, halfW, halfH));
  const { center } = geometry;
  return {
    ...geometry,
    halfWidth: halfW,
    halfHeight: halfH,
    fillet,
    inradius: halfH,
    sideLength: halfW * 2,
    height: halfH * 2,
    vertices: [
      { x: center.x - halfW + fillet, y: center.y - halfH },
      { x: center.x + halfW - fillet, y: center.y - halfH },
      { x: center.x + halfW, y: center.y - halfH + fillet },
      { x: center.x + halfW, y: center.y + halfH - fillet },
      { x: center.x + halfW - fillet, y: center.y + halfH },
      { x: center.x - halfW + fillet, y: center.y + halfH },
    ],
  };
}

export function ledMeshGeometry(size: RenderSize) {
  return insetChipGeometry(canonicalHexGeometry(size));
}

/**
 * Same per-edge walk as #542 `hexEdgeLedLayout`: each side is a straight plus
 * the trailing circular fillet, then `perEdge`-equivalent samples along that
 * sector. 4 rect sides × 90° arcs instead of 6 hex sides × 60° arcs.
 */
export function hexEdgeLedLayout(size: RenderSize, perEdge: number): HexLayout {
  const geometry = insetChipGeometry(canonicalHexGeometry(size));
  const perSide = Math.max(1, Math.round((perEdge * HEX_SIDES) / 4));
  const positions = hexStyleRoundedRectLeds(geometry, perSide);
  const straight = Math.max(0, geometry.sideLength - geometry.fillet * 2);
  const sector = straight + geometry.fillet * (Math.PI / 2);
  const centerSpacing = sector / perSide;
  const ledShape = {
    normalHalfThickness: hexLedNormalHalfThickness(size),
    tangentHalfLength: Math.max(
      0,
      centerSpacing * 0.5 - LED_TANGENT_GAP_PX * 0.5,
    ),
    cornerTrim: geometry.fillet,
    centerSpacing,
  };
  return { center: geometry.center, positions, geometry, ledShape };
}

function hexStyleRoundedRectLeds(
  geometry: HexGeometry,
  perSide: number,
): LedPosition[] {
  const { center, halfWidth: hw, halfHeight: hh, fillet } = geometry;
  const verts = [
    { x: center.x - hw, y: center.y - hh },
    { x: center.x + hw, y: center.y - hh },
    { x: center.x + hw, y: center.y + hh },
    { x: center.x - hw, y: center.y + hh },
  ];
  const positions: LedPosition[] = [];
  const trim = fillet;
  for (let e = 0; e < 4; e++) {
    const v0 = verts[e];
    const v1 = verts[(e + 1) % 4];
    const v2 = verts[(e + 2) % 4];
    if (!v0 || !v1 || !v2) continue;
    const edge = unit2(v1.x - v0.x, v1.y - v0.y);
    const edgeNext = unit2(v2.x - v1.x, v2.y - v1.y);
    const p0 = { x: v0.x + edge.x * trim, y: v0.y + edge.y * trim };
    const p1 = { x: v1.x - edge.x * trim, y: v1.y - edge.y * trim };
    const pOut = { x: v1.x + edgeNext.x * trim, y: v1.y + edgeNext.y * trim };
    const straightLen = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const arcLen = fillet * (Math.PI / 2);
    const sectorLen = straightLen + arcLen;
    const sx = v1.x >= center.x ? 1 : -1;
    const sy = v1.y >= center.y ? 1 : -1;
    const arcCenter = {
      x: center.x + sx * (hw - fillet),
      y: center.y + sy * (hh - fillet),
    };
    const a0 = Math.atan2(p1.y - arcCenter.y, p1.x - arcCenter.x);
    let sweep = Math.atan2(pOut.y - arcCenter.y, pOut.x - arcCenter.x) - a0;
    sweep = Math.atan2(Math.sin(sweep), Math.cos(sweep));
    for (let i = 0; i < perSide; i++) {
      const s = ((i + 0.5) / perSide) * sectorLen;
      if (fillet <= 1e-6 || s <= straightLen) {
        const t = straightLen > 0 ? Math.min(s, straightLen) / straightLen : 0;
        positions.push({
          x: p0.x + (p1.x - p0.x) * t,
          y: p0.y + (p1.y - p0.y) * t,
          angle: Math.atan2(edge.y, edge.x),
        });
      } else {
        const a = a0 + sweep * ((s - straightLen) / Math.max(arcLen, 1e-6));
        positions.push({
          x: arcCenter.x + fillet * Math.cos(a),
          y: arcCenter.y + fillet * Math.sin(a),
          angle: Math.atan2(sweep * Math.cos(a), sweep * -Math.sin(a)),
        });
      }
    }
  }
  return positions;
}

function unit2(x: number, y: number) {
  const length = Math.hypot(x, y);
  if (length <= 0) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
}
