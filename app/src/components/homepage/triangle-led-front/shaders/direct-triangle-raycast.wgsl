struct Config {
  hex_center_r: vec4f,
  hex_target: vec4f,
  size_steps: vec4f,
  params: vec4f,
  target_info: vec4f,
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var light_sources_tex: texture_2d<f32>;

struct VSOut { @builtin(position) pos: vec4f };
struct Interval { start: f32, length: f32, valid: bool };
struct TraceHit { rgb: vec3f, distance: f32, hit: bool };

const MAX_RAYS: u32 = 24u;
// Jitter amplitude as a fraction of one stratum width. 1.0 = full-width: adjacent
// strata can swap which discrete LED they sample, maximizing per-pixel variance (the
// clumpy chroma/luma noise at low ray counts). The half-res→full cubic upsample
// already protects against banding, so we attenuate the jitter and let regular
// stratification carry the signal — each ray stays near its stratum center and
// randomization only dithers residual stratum boundaries.
const JITTER_AMPLITUDE: f32 = 0.7;
const PI: f32 = 3.141592653589793;
const EPSILON: f32 = 1e-5;

@vertex fn vs_main(@builtin(vertex_index) vi: u32) -> VSOut {
  var p = array<vec2f, 3>(vec2f(-1.0, -3.0), vec2f(-1.0, 1.0), vec2f(3.0, 1.0));
  var out: VSOut;
  out.pos = vec4f(p[vi], 0.0, 1.0);
  return out;
}

fn hex_center() -> vec2f { return cfg.hex_center_r.xy; }
fn hex_radius() -> f32 { return cfg.hex_center_r.z; }

fn hex_vertices(center: vec2f, R: f32) -> array<vec2f, 6> {
  var verts: array<vec2f, 6>;
  for (var i = 0u; i < 6u; i = i + 1u) {
    let a = -1.5707963267948966 + f32(i) * 1.0471975511965976;
    verts[i] = center + R * vec2f(cos(a), sin(a));
  }
  return verts;
}

fn cross2(a: vec2f, b: vec2f) -> f32 {
  return a.x * b.y - a.y * b.x;
}

fn wrap_pi(angle: f32) -> f32 {
  return atan2(sin(angle), cos(angle));
}

fn point_in_hex(p: vec2f, verts: array<vec2f, 6>) -> bool {
  var pos = 0u;
  var neg = 0u;
  for (var i = 0u; i < 6u; i = i + 1u) {
    let a = verts[i];
    let b = verts[(i + 1u) % 6u];
    let side = cross2(b - a, p - a);
    if (side >= -EPSILON) { pos = pos + 1u; }
    if (side <= EPSILON) { neg = neg + 1u; }
  }
  return pos == 6u || neg == 6u;
}

fn segment_distance(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let e = b - a;
  let v = p - a;
  let h = clamp(dot(v, e) / max(dot(e, e), EPSILON), 0.0, 1.0);
  return length(v - e * h);
}

fn hex_edge_distance(p: vec2f, verts: array<vec2f, 6>) -> f32 {
  var d = 1e30;
  for (var i = 0u; i < 6u; i = i + 1u) {
    d = min(d, segment_distance(p, verts[i], verts[(i + 1u) % 6u]));
  }
  return d;
}

fn angular_interval(p: vec2f, verts: array<vec2f, 6>, center: vec2f) -> Interval {
  if (hex_radius() <= EPSILON) {
    return Interval(0.0, 0.0, false);
  }
  if (point_in_hex(p, verts)) {
    return Interval(0.0, 0.0, false);
  }
  if (hex_edge_distance(p, verts) <= cfg.size_steps.w) {
    return Interval(0.0, 0.0, false);
  }

  let center_angle = atan2(center.y - p.y, center.x - p.x);
  var min_rel = 4.0;
  var max_rel = -4.0;
  for (var i = 0u; i < 6u; i = i + 1u) {
    let rel = wrap_pi(atan2(verts[i].y - p.y, verts[i].x - p.x) - center_angle);
    min_rel = min(min_rel, rel);
    max_rel = max(max_rel, rel);
  }
  let length = max_rel - min_rel;
  if (!(length > EPSILON) || length >= PI) {
    return Interval(0.0, 0.0, false);
  }
  return Interval(wrap_pi(center_angle + min_rel), length, true);
}

// Interleaved gradient noise (Jimenez) → [0,1] with blue-noise-like spectrum: spatially
// high-frequency, so the per-pixel ray jitter it drives reads as fine grain (not white-noise
// clumps) and is removed far better by the half-res→full cubic upsample + the floor dither.
fn ign(p: vec2f) -> f32 {
  return fract(52.9829189 * fract(dot(p, vec2f(0.06711056, 0.00583715))));
}

fn load_light_source(sample_pos: vec2f) -> vec4f {
  let dims = textureDimensions(light_sources_tex);
  let inside =
    sample_pos.x >= 0.0 && sample_pos.x < f32(dims.x) &&
    sample_pos.y >= 0.0 && sample_pos.y < f32(dims.y);
  if (!inside) {
    return vec4f(0.0, 0.0, 0.0, 1000.0);
  }
  let px = clamp(vec2i(floor(sample_pos)), vec2i(0), vec2i(dims) - vec2i(1));
  return textureLoad(light_sources_tex, px, 0);
}

// Per-edge ray/segment invariants that don't change across the ray sweep (they depend only on the
// pixel origin and the fixed triangle edge): the edge vector, the origin->edge offset, and their
// 2D cross. Precomputed once per pixel and reused for all MAX_RAYS directions.
struct EdgePrecomp { e: vec2f, diff: vec2f, cross_diff_e: f32 };

fn precompute_edge(origin: vec2f, p: vec2f, q: vec2f) -> EdgePrecomp {
  let e = q - p;
  let diff = p - origin;
  return EdgePrecomp(e, diff, cross2(diff, e));
}

// Closed-form ray (origin + t*dir, t > minStep) vs segment — dir-dependent part only; returns
// t >= 0 at the hit or -1 (miss/parallel). One reciprocal feeds both t and u.
fn ray_segment_t(dir: vec2f, pre: EdgePrecomp) -> f32 {
  let denom = cross2(dir, pre.e);
  if (abs(denom) < EPSILON) { return -1.0; }
  let inv = 1.0 / denom;
  let t = pre.cross_diff_e * inv;
  let u = cross2(pre.diff, dir) * inv;
  if (t < cfg.size_steps.z || u < 0.0 || u > 1.0) { return -1.0; }
  return t;
}

// Analytic: the LEDs sit on the triangle edges, and angular_interval already aimed this ray
// into the triangle's arc, so the nearest ray<->edge intersection is the first lit edge it
// can reach (nearest => the near edge occludes the far edges for free). One sample of the
// LED color there replaces the SDF sphere-march — no SDF / .w channel needed at all.
fn trace_light_source(origin: vec2f, dir: vec2f, pres: array<EdgePrecomp, 6>) -> TraceHit {
  var t = 1e30;
  for (var i = 0u; i < 6u; i = i + 1u) {
    let ti = ray_segment_t(dir, pres[i]);
    if (ti >= 0.0) { t = min(t, ti); }
  }
  if (t > 1e29) { return TraceHit(vec3f(0.0), 0.0, false); }

  let source = load_light_source(origin + dir * t);
  let source_active = max(max(source.r, source.g), source.b) > cfg.params.w;
  if (source_active) {
    return TraceHit(source.rgb, t, true);
  }
  return TraceHit(vec3f(0.0), 0.0, false);
}

@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {
  let target_scale = max(cfg.target_info.x, 1e-4);
  let pixel_sim = in.pos.xy / target_scale;
  let center = hex_center();
  let verts = hex_vertices(center, hex_radius());
  let interval = angular_interval(pixel_sim, verts, center);
  if (!interval.valid) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  let jitter = (ign(in.pos.xy) - 0.5) * JITTER_AMPLITUDE;
  // The ray angle is exactly linear in i: angle = interval.start + interval.length * t with
  // t = (i + 0.5 + jitter) / MAX_RAYS. The closed-form clamp never triggers because jitter ∈
  // [-0.35, 0.35] (JITTER_AMPLITUDE 0.7) keeps t strictly inside (0, 1) for every i. So sweep
  // the direction by rotating it one fixed angular step per ray — 2 trig calls per pixel
  // instead of 2 per ray (MAX_RAYS=24). The hit point (origin + dir*t) is invariant to any
  // tiny magnitude drift since the ray/segment t absorbs it; only the angle matters, and that
  // accumulates only ~MAX_RAYS ULP over the sweep.
  let inv_rays = 1.0 / f32(MAX_RAYS);
  let step_angle = interval.length * inv_rays;
  let start_angle = interval.start + interval.length * (0.5 + jitter) * inv_rays;
  let step_c = cos(step_angle);
  let step_s = sin(step_angle);
  var dir = vec2f(cos(start_angle), sin(start_angle));
  // Hoist the per-edge ray/segment invariants out of the ray loop (origin + edges are fixed).
  var pres: array<EdgePrecomp, 6>;
  for (var e = 0u; e < 6u; e = e + 1u) {
    pres[e] = precompute_edge(pixel_sim, verts[e], verts[(e + 1u) % 6u]);
  }
  var sum = vec3f(0.0);
  for (var i = 0u; i < MAX_RAYS; i = i + 1u) {
    let hit = trace_light_source(pixel_sim, dir, pres);
    if (hit.hit) {
      // Geometric spreading on distance NORMALIZED to the scene size (target_info.y =
      // ref_height / sim_height) so the radiance is resolution-independent — raw sim-px
      // distance made shorter render targets read brighter/whiter. Beer-Lambert absorption
      // (params.x already per-sim-height) eats far light through the smoke/atmosphere.
      let falloff_dist = hit.distance * cfg.target_info.y;
      let distance_weight =
        pow(max(falloff_dist, 1.0), -cfg.params.y) * exp(-cfg.params.x * hit.distance);
      sum += hit.rgb * distance_weight;
    }
    // Rotate the direction by one angular step for the next ray.
    dir = vec2f(dir.x * step_c - dir.y * step_s, dir.x * step_s + dir.y * step_c);
  }

  // Match the cascade path's directional average semantics: angular sample mean,
  // independent of ray count. `params.z` remains the visual calibration knob.
  let radiance = (sum / f32(MAX_RAYS)) * cfg.params.z;
  return vec4f(radiance, 1.0);
}
