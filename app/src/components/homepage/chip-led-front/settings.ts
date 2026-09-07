export interface RenderSize {
  width: number;
  height: number;
}

export const LEDS_PER_EDGE = 24;
export const HEX_SIDES = 6;
export const LED_COUNT = LEDS_PER_EDGE * HEX_SIDES;
/** CSS pad so the 404-style radiance bloom can sit outside the chip box. */
export const CHIP_BLOOM_CSS = 22;
export const TRIANGLE_HEIGHT_RATIO = 1;
export const HERO_CANVAS_MAX_CSS = 720;
const MIN_SIM_HEIGHT = 360;
const LED_RADIUS_TO_TRIANGLE_HEIGHT = 0.0236;
const LED_NORMAL_HALF_THICKNESS_TO_RADIUS = 2;
const LED_TANGENT_GAP_PX = 1;

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

export function setChipFrame(next: Partial<ChipFrame>) {
  chipFrame = {
    ...chipFrame,
    ...next,
  };
}

export function setHeroSceneScale(_scale: number) {
  // Chip geometry is the measured rounded-rect; do not inherit the hex zoom.
}

export function resolveHeroSceneScale(baseZoom: number) {
  return baseZoom;
}

let lastChipRect = { halfWidth: 1, halfHeight: 1 };

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
  // Same CSS-space near-bloom as the 404 hex (~9px): hex used circumradius≈200
  // at factor 1. Scale that into sim pixels for this canvas.
  const circumradius = 200 * scaleY;
  lastChipRect = { halfWidth: halfW, halfHeight: halfH };
  const corners: HexVertices = [
    { x: center.x - halfW + fillet, y: center.y - halfH },
    { x: center.x + halfW - fillet, y: center.y - halfH },
    { x: center.x + halfW, y: center.y - halfH + fillet },
    { x: center.x + halfW, y: center.y + halfH - fillet },
    { x: center.x + halfW - fillet, y: center.y + halfH },
    { x: center.x - halfW + fillet, y: center.y + halfH },
  ];
  return {
    center,
    vertices: corners,
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

export function ledMeshGeometry(size: RenderSize) {
  return canonicalHexGeometry(size);
}

export function hexEdgeLedLayout(size: RenderSize, perEdge: number): HexLayout {
  const geometry = canonicalHexGeometry(size);
  const count = Math.max(1, perEdge * HEX_SIDES);
  const positions = sampleRoundedRect(
    geometry.center.x - geometry.halfWidth,
    geometry.center.y - geometry.halfHeight,
    geometry.halfWidth * 2,
    geometry.halfHeight * 2,
    geometry.fillet,
    count,
  );
  const perimeter =
    2 *
      (geometry.halfWidth * 2 + geometry.halfHeight * 2 - 4 * geometry.fillet) +
    2 * Math.PI * geometry.fillet;
  const centerSpacing = perimeter / count;
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

function sampleRoundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  count: number,
): LedPosition[] {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const straightW = Math.max(0, width - 2 * r);
  const straightH = Math.max(0, height - 2 * r);
  const arc = r * (Math.PI / 2);
  const segments: Array<
    | {
        kind: "line";
        x0: number;
        y0: number;
        dx: number;
        dy: number;
        len: number;
      }
    | {
        kind: "arc";
        cx: number;
        cy: number;
        a0: number;
        sweep: number;
        r: number;
        len: number;
      }
  > = [
    { kind: "line", x0: x + r, y0: y, dx: 1, dy: 0, len: straightW },
    {
      kind: "arc",
      cx: x + width - r,
      cy: y + r,
      a0: -Math.PI / 2,
      sweep: Math.PI / 2,
      r,
      len: arc,
    },
    { kind: "line", x0: x + width, y0: y + r, dx: 0, dy: 1, len: straightH },
    {
      kind: "arc",
      cx: x + width - r,
      cy: y + height - r,
      a0: 0,
      sweep: Math.PI / 2,
      r,
      len: arc,
    },
    {
      kind: "line",
      x0: x + width - r,
      y0: y + height,
      dx: -1,
      dy: 0,
      len: straightW,
    },
    {
      kind: "arc",
      cx: x + r,
      cy: y + height - r,
      a0: Math.PI / 2,
      sweep: Math.PI / 2,
      r,
      len: arc,
    },
    { kind: "line", x0: x, y0: y + height - r, dx: 0, dy: -1, len: straightH },
    {
      kind: "arc",
      cx: x + r,
      cy: y + r,
      a0: Math.PI,
      sweep: Math.PI / 2,
      r,
      len: arc,
    },
  ];
  const perimeter = segments.reduce((sum, segment) => sum + segment.len, 0);
  const sites: LedPosition[] = [];
  if (perimeter <= 0 || count <= 0) return sites;
  for (let i = 0; i < count; i++) {
    let remaining = ((i + 0.5) / count) * perimeter;
    for (const segment of segments) {
      if (
        remaining > segment.len &&
        segment !== segments[segments.length - 1]
      ) {
        remaining -= segment.len;
        continue;
      }
      if (segment.kind === "line") {
        sites.push({
          x: segment.x0 + segment.dx * remaining,
          y: segment.y0 + segment.dy * remaining,
          angle: Math.atan2(segment.dy, segment.dx),
        });
      } else {
        const t = segment.len > 0 ? remaining / segment.len : 0;
        const angle = segment.a0 + segment.sweep * t;
        sites.push({
          x: segment.cx + Math.cos(angle) * segment.r,
          y: segment.cy + Math.sin(angle) * segment.r,
          angle: angle + Math.PI / 2,
        });
      }
      break;
    }
  }
  return sites;
}
