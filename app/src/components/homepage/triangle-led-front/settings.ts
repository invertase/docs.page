export interface RenderSize {
  width: number;
  height: number;
}

export const LEDS_PER_EDGE = 24;
export const HEX_SIDES = 6;
export const TRIANGLE_HEIGHT_RATIO = (180 / 630) * 0.8 * 1.6 * 1.5 * 1.5 * 0.8;
/** Corner fillet as a fraction of hex circumradius. 0.25 is visible without blobbing. */
export const HEX_FILLET_RATIO = 0.25;
const SQRT3 = Math.sqrt(3);
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
  edge: 'edge',
  lines: 'lines',
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

let heroSceneScale = 1;

export function setHeroSceneScale(scale: number) {
  heroSceneScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export function resolveHeroSceneScale(
  baseZoom: number,
  cssHeight: number,
  mobile = false,
) {
  if (mobile) return baseZoom;
  if (!Number.isFinite(cssHeight) || cssHeight <= 0) return baseZoom;
  return baseZoom * Math.min(1, 560 / cssHeight);
}

function hexVertexAt(center: LedPosition, circumradius: number, i: number): HexVertex {
  const angle = -Math.PI / 2 + i * (Math.PI / 3);
  return {
    x: center.x + circumradius * Math.cos(angle),
    y: center.y + circumradius * Math.sin(angle),
  };
}

function hexVertices(center: LedPosition, circumradius: number): HexVertices {
  return [
    hexVertexAt(center, circumradius, 0),
    hexVertexAt(center, circumradius, 1),
    hexVertexAt(center, circumradius, 2),
    hexVertexAt(center, circumradius, 3),
    hexVertexAt(center, circumradius, 4),
    hexVertexAt(center, circumradius, 5),
  ];
}

export function canonicalHexGeometry(size: RenderSize): HexGeometry {
  const height = size.height * TRIANGLE_HEIGHT_RATIO * heroSceneScale;
  const circumradius = height * 0.5;
  const inradius = circumradius * (SQRT3 / 2);
  const sideLength = circumradius;
  const fillet = hexFilletRadius(circumradius);
  const center = { x: size.width * 0.5, y: size.height * 0.5 };
  return {
    center,
    vertices: hexVertices(center, circumradius),
    height,
    circumradius,
    inradius,
    sideLength,
    fillet,
  };
}

export function hexFilletRadius(circumradius: number) {
  return Math.max(0, circumradius * HEX_FILLET_RATIO);
}

export function sdfHexPointy(
  point: LedPosition,
  center: LedPosition,
  circumradius: number,
) {
  const inradius = circumradius * (SQRT3 / 2);
  const kx = -SQRT3 / 2;
  const ky = 0.5;
  const kz = 1 / SQRT3;
  let px = Math.abs(point.y - center.y);
  let py = Math.abs(point.x - center.x);
  const fold = 2 * Math.min(kx * px + ky * py, 0);
  px -= fold * kx;
  py -= fold * ky;
  px -= Math.min(Math.max(px, -kz * inradius), kz * inradius);
  py -= inradius;
  return Math.hypot(px, py) * Math.sign(py || 1);
}

export function sdfHexPointyRounded(
  point: LedPosition,
  center: LedPosition,
  circumradius: number,
  fillet: number,
) {
  const radius = Math.max(0, fillet);
  const inner = Math.max(circumradius - hexFilletInset(radius), 1e-4);
  return sdfHexPointy(point, center, inner) - radius;
}

function hexFilletTrim(fillet: number) {
  return fillet / SQRT3;
}

function hexFilletInset(fillet: number) {
  return fillet * (2 / SQRT3);
}

function hexLedRadius(size: RenderSize) {
  return canonicalHexGeometry(size).height * LED_RADIUS_TO_TRIANGLE_HEIGHT;
}

function hexLedNormalHalfThickness(size: RenderSize) {
  return hexLedRadius(size) * LED_NORMAL_HALF_THICKNESS_TO_RADIUS;
}

function hexLedShapeDimensions(size: RenderSize, perEdge: number): HexLedShape {
  const geometry = canonicalHexGeometry(size);
  const cornerTrim = hexFilletTrim(geometry.fillet);
  const straight = Math.max(0, geometry.sideLength - cornerTrim * 2);
  const sector = straight + geometry.fillet * (Math.PI / 3);
  const centerSpacing = sector / Math.max(1, perEdge);
  const normalHalfThickness = hexLedNormalHalfThickness(size);
  const tangentHalfLength = Math.max(
    0,
    centerSpacing * 0.5 - LED_TANGENT_GAP_PX * 0.5,
  );
  return {
    normalHalfThickness,
    tangentHalfLength,
    cornerTrim,
    centerSpacing,
  };
}

function scaleHexGeometry(geometry: HexGeometry, scale: number): HexGeometry {
  const center = geometry.center;
  const toward = (point: LedPosition) => ({
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  });
  return {
    center,
    vertices: [
      toward(geometry.vertices[0]),
      toward(geometry.vertices[1]),
      toward(geometry.vertices[2]),
      toward(geometry.vertices[3]),
      toward(geometry.vertices[4]),
      toward(geometry.vertices[5]),
    ],
    height: geometry.height * scale,
    circumradius: geometry.circumradius * scale,
    inradius: geometry.inradius * scale,
    sideLength: geometry.sideLength * scale,
    fillet: geometry.fillet * scale,
  };
}

function ledMeshScale(base: HexGeometry) {
  const refHeight = HERO_CANVAS_MAX_CSS * TRIANGLE_HEIGHT_RATIO;
  const inset =
    (LED_MESH_INSET_PX * Math.min(base.height, refHeight)) / refHeight;
  return base.inradius > inset ? (base.inradius - inset) / base.inradius : 1;
}

export function ledMeshGeometry(size: RenderSize) {
  const base = canonicalHexGeometry(size);
  return scaleHexGeometry(base, ledMeshScale(base));
}

export function hexEdgeLedLayout(size: RenderSize, perEdge: number): HexLayout {
  const base = canonicalHexGeometry(size);
  const meshScale = ledMeshScale(base);
  const geometry = scaleHexGeometry(base, meshScale);
  const { vertices, center, fillet, circumradius } = geometry;
  const ledSize = { width: size.width, height: size.height * meshScale };
  const ledShape = hexLedShapeDimensions(ledSize, perEdge);
  const positions: LedPosition[] = [];
  const trim = hexFilletTrim(fillet);
  const inset = hexFilletInset(fillet);
  const radius = Math.max(circumradius, 1e-4);
  for (let e = 0; e < HEX_SIDES; e++) {
    const v0 = vertices[e];
    const v1 = vertices[(e + 1) % HEX_SIDES];
    const v2 = vertices[(e + 2) % HEX_SIDES];
    if (!v0 || !v1 || !v2) continue;
    const edge = unit2(v1.x - v0.x, v1.y - v0.y);
    const edgeNext = unit2(v2.x - v1.x, v2.y - v1.y);
    const p0 = { x: v0.x + edge.x * trim, y: v0.y + edge.y * trim };
    const p1 = { x: v1.x - edge.x * trim, y: v1.y - edge.y * trim };
    const pOut = { x: v1.x + edgeNext.x * trim, y: v1.y + edgeNext.y * trim };
    const straightLen = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    const arcLen = fillet * (Math.PI / 3);
    const sectorLen = straightLen + arcLen;
    const arcCenter = {
      x: center.x + ((v1.x - center.x) * (radius - inset)) / radius,
      y: center.y + ((v1.y - center.y) * (radius - inset)) / radius,
    };
    const a0 = Math.atan2(p1.y - arcCenter.y, p1.x - arcCenter.x);
    let sweep =
      Math.atan2(pOut.y - arcCenter.y, pOut.x - arcCenter.x) - a0;
    sweep = Math.atan2(Math.sin(sweep), Math.cos(sweep));
    for (let i = 0; i < perEdge; i++) {
      const s = ((i + 0.5) / perEdge) * sectorLen;
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
  return { center, positions, geometry, ledShape };
}

function unit2(x: number, y: number) {
  const length = Math.hypot(x, y);
  if (length <= 0) return { x: 0, y: 0 };
  return { x: x / length, y: y / length };
}
