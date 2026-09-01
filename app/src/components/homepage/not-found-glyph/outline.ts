/**
 * Marching-squares contours of the live Lexend 404 raster, then LED seats
 * along those polylines — same role as triangleEdgeLedLayout / LEDS_PER_EDGE
 * in vgpu triangle-led-front (rev 90b65bf4…), but the path is the glyph
 * outline instead of three analytic edges.
 */

export const LEDS_PER_EDGE = 24;
export const MAX_LEDS = 144;
export const LED_SPACING_PX = 14;
const ALPHA_CUTOFF = 128;
const LED_RADIUS_TO_HEIGHT = 0.0236;
const LED_NORMAL_HALF_TO_RADIUS = 2;
const LED_TANGENT_GAP_PX = 1;

export type Point = { x: number; y: number };

export type LedSeat = {
  x: number;
  y: number;
  angle: number;
  nx: number;
  ny: number;
};

export type LedShape = {
  normalHalfThickness: number;
  tangentHalfLength: number;
  centerSpacing: number;
};

export type GlyphLedLayout = {
  positions: LedSeat[];
  shape: LedShape;
};

export function layoutGlyphLeds(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): GlyphLedLayout {
  const loops = traceAlphaContours(pixels, width, height);
  const spacing = LED_SPACING_PX;
  const radius = Math.max(2, height * LED_RADIUS_TO_HEIGHT);
  const shape: LedShape = {
    normalHalfThickness: radius * LED_NORMAL_HALF_TO_RADIUS,
    tangentHalfLength: Math.max(0.75, spacing * 0.5 - LED_TANGENT_GAP_PX * 0.5),
    centerSpacing: spacing,
  };

  const positions: LedSeat[] = [];
  for (const loop of loops) {
    const seats = placeLedsOnLoop(loop, spacing, pixels, width, height);
    for (const seat of seats) {
      if (positions.length >= MAX_LEDS) break;
      positions.push(seat);
    }
    if (positions.length >= MAX_LEDS) break;
  }

  return { positions, shape };
}

function alphaAt(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
): number {
  const ix = Math.min(width - 1, Math.max(0, Math.floor(x)));
  const iy = Math.min(height - 1, Math.max(0, Math.floor(y)));
  return pixels[(iy * width + ix) * 4 + 3] ?? 0;
}

function filled(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
): boolean {
  if (x < 0 || y < 0 || x >= width || y >= height) return false;
  return (pixels[(y * width + x) * 4 + 3] ?? 0) >= ALPHA_CUTOFF;
}

function traceAlphaContours(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): Point[][] {
  const segments: [Point, Point][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tl = filled(pixels, width, height, x, y) ? 1 : 0;
      const tr = filled(pixels, width, height, x + 1, y) ? 2 : 0;
      const br = filled(pixels, width, height, x + 1, y + 1) ? 4 : 0;
      const bl = filled(pixels, width, height, x, y + 1) ? 8 : 0;
      const code = tl | tr | br | bl;
      const top = { x: x + 0.5, y };
      const right = { x: x + 1, y: y + 0.5 };
      const bottom = { x: x + 0.5, y: y + 1 };
      const left = { x, y: y + 0.5 };
      switch (code) {
        case 1:
        case 14:
          segments.push([left, top]);
          break;
        case 2:
        case 13:
          segments.push([top, right]);
          break;
        case 3:
        case 12:
          segments.push([left, right]);
          break;
        case 4:
        case 11:
          segments.push([right, bottom]);
          break;
        case 5:
          segments.push([left, top]);
          segments.push([right, bottom]);
          break;
        case 6:
        case 9:
          segments.push([top, bottom]);
          break;
        case 7:
        case 8:
          segments.push([left, bottom]);
          break;
        case 10:
          segments.push([top, right]);
          segments.push([left, bottom]);
          break;
        default:
          break;
      }
    }
  }
  return stitchLoops(segments);
}

function stitchLoops(segments: [Point, Point][]): Point[][] {
  const unused = segments.map((segment) => [...segment] as [Point, Point]);
  const loops: Point[][] = [];

  const takeMatching = (point: Point): Point | undefined => {
    const index = unused.findIndex(
      ([a, b]) => near(a, point) || near(b, point),
    );
    if (index < 0) return undefined;
    const [a, b] = unused.splice(index, 1)[0]!;
    return near(a, point) ? b : a;
  };

  while (unused.length > 0) {
    const seed = unused.pop()!;
    const loop = [seed[0], seed[1]];
    let guard = unused.length + 2;
    while (guard-- > 0) {
      const next = takeMatching(loop[loop.length - 1]!);
      if (!next) break;
      if (near(next, loop[0]!)) {
        loop.push(loop[0]!);
        break;
      }
      loop.push(next);
    }
    if (loop.length >= 8) loops.push(loop);
  }
  return loops.sort((a, b) => polylineLength(b) - polylineLength(a));
}

function near(a: Point, b: Point): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) < 0.6;
}

function polylineLength(points: Point[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += Math.hypot(
      points[i]!.x - points[i - 1]!.x,
      points[i]!.y - points[i - 1]!.y,
    );
  }
  return length;
}

function placeLedsOnLoop(
  loop: Point[],
  spacing: number,
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): LedSeat[] {
  const closed =
    loop.length > 1 &&
    Math.hypot(
      loop[0]!.x - loop[loop.length - 1]!.x,
      loop[0]!.y - loop[loop.length - 1]!.y,
    ) < 1.5;
  const pts = closed ? loop.slice(0, -1) : loop;
  if (pts.length < 3) return [];

  const lengths: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]!;
    const b = pts[(i + 1) % pts.length]!;
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    lengths.push(seg);
    total += seg;
  }
  if (total < spacing) return [];

  const count = Math.max(1, Math.floor(total / spacing));
  const step = total / count;
  const seats: LedSeat[] = [];
  const remaining = step * 0.5;
  let index = 0;
  let walked = 0;

  for (let n = 0; n < count; n++) {
    const target = remaining + n * step;
    while (index < lengths.length && walked + (lengths[index] ?? 0) < target) {
      walked += lengths[index] ?? 0;
      index += 1;
    }
    const seg = Math.max(1e-4, lengths[index % lengths.length] ?? 1);
    const t = (target - walked) / seg;
    const a = pts[index % pts.length]!;
    const b = pts[(index + 1) % pts.length]!;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    let nx = -Math.sin(angle);
    let ny = Math.cos(angle);
    const probe = alphaAt(pixels, width, height, x + nx * 2, y + ny * 2);
    if (probe >= ALPHA_CUTOFF) {
      nx = -nx;
      ny = -ny;
    }
    seats.push({ x, y, angle, nx, ny });
  }
  return seats;
}
