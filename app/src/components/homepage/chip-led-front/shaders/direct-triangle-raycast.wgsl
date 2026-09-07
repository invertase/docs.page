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
fn rect_half() -> vec2f { return max(cfg.hex_center_r.zw, vec2f(1.0)); }
fn hex_fillet() -> f32 { return max(cfg.target_info.z, 0.0); }

fn sdf_hex_rounded(p: vec2f) -> f32 {
  let radius = min(hex_fillet(), min(rect_half().x, rect_half().y));
  let q = abs(p - hex_center()) - rect_half() + vec2f(radius);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn cross2(a: vec2f, b: vec2f) -> f32 {
  return a.x * b.y - a.y * b.x;
}

fn wrap_pi(angle: f32) -> f32 {
  return atan2(sin(angle), cos(angle));
}

fn unit2(v: vec2f) -> vec2f {
  let len = length(v);
  if (len <= EPSILON) { return vec2f(0.0); }
  return v / len;
}

struct OutlineSeg { a: vec2f, b: vec2f };
struct OutlineArc { center: vec2f, radius: f32, a0: f32, sweep: f32 };

const RECT_SIDES: u32 = 4u;

fn rect_vertices() -> array<vec2f, 4> {
  let c = hex_center();
  let h = rect_half();
  return array<vec2f, 4>(
    c + vec2f(-h.x, -h.y),
    c + vec2f(h.x, -h.y),
    c + vec2f(h.x, h.y),
    c + vec2f(-h.x, h.y),
  );
}

fn rounded_outline(verts: array<vec2f, 4>) -> array<OutlineSeg, 4> {
  var segs: array<OutlineSeg, 4>;
  let trim = hex_fillet();
  for (var i = 0u; i < RECT_SIDES; i = i + 1u) {
    let v0 = verts[i];
    let v1 = verts[(i + 1u) % RECT_SIDES];
    let edge = unit2(v1 - v0);
    segs[i] = OutlineSeg(v0 + edge * trim, v1 - edge * trim);
  }
  return segs;
}

fn rounded_arcs(verts: array<vec2f, 4>, segs: array<OutlineSeg, 4>) -> array<OutlineArc, 4> {
  var arcs: array<OutlineArc, 4>;
  let fillet = hex_fillet();
  let half = rect_half();
  let center = hex_center();
  for (var i = 0u; i < RECT_SIDES; i = i + 1u) {
    let corner = verts[(i + 1u) % RECT_SIDES];
    let p1 = segs[i].b;
    let p_out = segs[(i + 1u) % RECT_SIDES].a;
    let sx = select(-1.0, 1.0, corner.x >= center.x);
    let sy = select(-1.0, 1.0, corner.y >= center.y);
    let arc_center = center + vec2f(sx * (half.x - fillet), sy * (half.y - fillet));
    let a0 = atan2(p1.y - arc_center.y, p1.x - arc_center.x);
    let sweep = wrap_pi(atan2(p_out.y - arc_center.y, p_out.x - arc_center.x) - a0);
    arcs[i] = OutlineArc(arc_center, fillet, a0, sweep);
  }
  return arcs;
}

fn angular_interval(
  p: vec2f,
  segs: array<OutlineSeg, 4>,
  arcs: array<OutlineArc, 4>,
  center: vec2f,
) -> Interval {
  if (min(rect_half().x, rect_half().y) <= EPSILON) {
    return Interval(0.0, 0.0, false);
  }
  if (sdf_hex_rounded(p) <= 0.0) {
    return Interval(0.0, 0.0, false);
  }
  if (abs(sdf_hex_rounded(p)) <= cfg.size_steps.w) {
    return Interval(0.0, 0.0, false);
  }

  let center_angle = atan2(center.y - p.y, center.x - p.x);
  var min_rel = 4.0;
  var max_rel = -4.0;
  for (var i = 0u; i < RECT_SIDES; i = i + 1u) {
    let a = segs[i].a;
    let b = segs[i].b;
    min_rel = min(min_rel, wrap_pi(atan2(a.y - p.y, a.x - p.x) - center_angle));
    max_rel = max(max_rel, wrap_pi(atan2(a.y - p.y, a.x - p.x) - center_angle));
    min_rel = min(min_rel, wrap_pi(atan2(b.y - p.y, b.x - p.x) - center_angle));
    max_rel = max(max_rel, wrap_pi(atan2(b.y - p.y, b.x - p.x) - center_angle));
    let mid = arcs[i].a0 + arcs[i].sweep * 0.5;
    let c = arcs[i].center + arcs[i].radius * vec2f(cos(mid), sin(mid));
    min_rel = min(min_rel, wrap_pi(atan2(c.y - p.y, c.x - p.x) - center_angle));
    max_rel = max(max_rel, wrap_pi(atan2(c.y - p.y, c.x - p.x) - center_angle));
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

fn load_light_source(sample_pos_css: vec2f) -> vec4f {
  let dpr = max(cfg.target_info.w, 1.0);
  let sample_pos = sample_pos_css * dpr;
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
fn angle_on_arc(p: vec2f, arc: OutlineArc) -> bool {
  let rel = wrap_pi(atan2(p.y - arc.center.y, p.x - arc.center.x) - arc.a0);
  if (arc.sweep >= 0.0) {
    return rel >= -EPSILON && rel <= arc.sweep + EPSILON;
  }
  return rel <= EPSILON && rel >= arc.sweep - EPSILON;
}

fn ray_arc_t(origin: vec2f, dir: vec2f, arc: OutlineArc) -> f32 {
  if (arc.radius <= EPSILON) { return -1.0; }
  let oc = origin - arc.center;
  let b = dot(dir, oc);
  let disc = b * b - dot(oc, oc) + arc.radius * arc.radius;
  if (disc < 0.0) { return -1.0; }
  let s = sqrt(disc);
  var best = 1e30;
  let t0 = -b - s;
  let t1 = -b + s;
  if (t0 >= cfg.size_steps.z && angle_on_arc(origin + dir * t0, arc)) {
    best = min(best, t0);
  }
  if (t1 >= cfg.size_steps.z && angle_on_arc(origin + dir * t1, arc)) {
    best = min(best, t1);
  }
  if (best > 1e29) { return -1.0; }
  return best;
}

fn trace_light_source(
  origin: vec2f,
  dir: vec2f,
  pres: array<EdgePrecomp, 4>,
  arcs: array<OutlineArc, 4>,
) -> TraceHit {
  var t = 1e30;
  for (var i = 0u; i < RECT_SIDES; i = i + 1u) {
    let ti = ray_segment_t(dir, pres[i]);
    if (ti >= 0.0) { t = min(t, ti); }
    let ta = ray_arc_t(origin, dir, arcs[i]);
    if (ta >= 0.0) { t = min(t, ta); }
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
  let dpr = max(cfg.target_info.w, 1.0);
  // Raycast target is 0.5 × presentation (CSS × DPR). Layout stays CSS.
  let pixel_sim = in.pos.xy / (target_scale * dpr);
  let center = hex_center();
  let verts = rect_vertices();
  let segs = rounded_outline(verts);
  let arcs = rounded_arcs(verts, segs);
  let interval = angular_interval(pixel_sim, segs, arcs, center);
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
  var pres: array<EdgePrecomp, 4>;
  for (var e = 0u; e < RECT_SIDES; e = e + 1u) {
    pres[e] = precompute_edge(pixel_sim, segs[e].a, segs[e].b);
  }
  var sum = vec3f(0.0);
  for (var i = 0u; i < MAX_RAYS; i = i + 1u) {
    let hit = trace_light_source(pixel_sim, dir, pres, arcs);
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
