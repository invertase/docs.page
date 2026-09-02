export interface RenderSize {
  width: number;
  height: number;
}

export const LEDS_PER_EDGE = 24;
export const HEX_SIDES = 6;
export const TRIANGLE_HEIGHT_RATIO = (180 / 630) * 0.8;
export const HERO_CANVAS_MAX_CSS = 720;
const MIN_SIM_HEIGHT = 360;
const LED_RADIUS_TO_TRIANGLE_HEIGHT = 0.0236;
const LED_NORMAL_HALF_THICKNESS_TO_RADIUS = 2;
const LED_TANGENT_GAP_PX = 1;
const LED_CORNER_TRIM_EPSILON_PX = 1;
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
  const inradius = circumradius * (Math.sqrt(3) / 2);
  const sideLength = circumradius;
  const center = { x: size.width * 0.5, y: size.height * 0.5 };
  return {
    center,
    vertices: hexVertices(center, circumradius),
    height,
    circumradius,
    inradius,
    sideLength,
  };
}

function hexLedRadius(size: RenderSize) {
  return canonicalHexGeometry(size).height * LED_RADIUS_TO_TRIANGLE_HEIGHT;
}

function hexLedNormalHalfThickness(size: RenderSize) {
  return hexLedRadius(size) * LED_NORMAL_HALF_THICKNESS_TO_RADIUS;
}

function hexLedCornerTrim(size: RenderSize) {
  const rawTrim =
    hexLedNormalHalfThickness(size) / Math.sqrt(3) +
    LED_CORNER_TRIM_EPSILON_PX;
  const sideLength = canonicalHexGeometry(size).sideLength;
  return Math.min(rawTrim, sideLength * 0.45);
}

function hexLedShapeDimensions(size: RenderSize, perEdge: number): HexLedShape {
  const geometry = canonicalHexGeometry(size);
  const cornerTrim = hexLedCornerTrim(size);
  const trimmedSideLength = Math.max(0, geometry.sideLength - cornerTrim * 2);
  const centerSpacing = trimmedSideLength / Math.max(1, perEdge);
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
  const { vertices, center } = geometry;
  const ledSize = { width: size.width, height: size.height * meshScale };
  const ledShape = hexLedShapeDimensions(ledSize, perEdge);
  const positions: LedPosition[] = [];
  for (let e = 0; e < HEX_SIDES; e++) {
    const a = vertices[e];
    const b = vertices[(e + 1) % HEX_SIDES];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const edgeLength = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const trimT = edgeLength > 0 ? ledShape.cornerTrim / edgeLength : 0;
    const slotT = edgeLength > 0 ? ledShape.centerSpacing / edgeLength : 0;
    for (let i = 0; i < perEdge; i++) {
      const t = trimT + (i + 0.5) * slotT;
      positions.push({ x: a.x + dx * t, y: a.y + dy * t, angle });
    }
  }
  return { center, positions, geometry, ledShape };
}
