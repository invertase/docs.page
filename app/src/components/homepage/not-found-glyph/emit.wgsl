// Pointer-activated lattice: every visible speck is a circular HDR emitter
// and occluder. RGB is linear honey radiance; alpha is the circle mask.

struct Dots {
  origin: vec2f,
  css_size: vec2f,
  pointer: vec2f,
  enabled: f32,
  _pad0: f32,
  honey: vec4f,
  dense_cell: f32,
  dot_radius: f32,
  head_inner: f32,
  head_outer: f32,
  trail: array<vec4f, 12>,
};

@group(0) @binding(0) var<uniform> dots: Dots;
@group(0) @binding(1) var glyph: texture_2d<f32>;
@group(0) @binding(2) var glyph_samp: sampler;

fn srgb_to_linear(color: vec3f) -> vec3f {
  let low = color / 12.92;
  let high = pow((color + 0.055) / 1.055, vec3f(2.4));
  return select(high, low, color <= vec3f(0.04045));
}

fn circle(dist: f32, radius: f32) -> f32 {
  return 1.0 - smoothstep(radius * 0.45, radius, dist);
}

fn sample_glyph(uv: vec2f) -> f32 {
  let size = vec2f(textureDimensions(glyph));
  let half_texel = 0.5 / size;
  return textureSampleLevel(
    glyph,
    glyph_samp,
    clamp(uv, half_texel, vec2f(1.0) - half_texel),
    0.0,
  ).a;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let css_size = max(dots.css_size, vec2f(1.0));
  let world = dots.origin + uv * css_size;

  let dense_center = (floor(world / dots.dense_cell) + 0.5) * dots.dense_cell;
  let dense_uv = (dense_center - dots.origin) / css_size;
  let dense_ink = step(0.12, sample_glyph(dense_uv));
  let head_gate = dots.enabled * (1.0 - smoothstep(
    dots.head_inner,
    dots.head_outer,
    length(dense_center - dots.pointer),
  ));
  let head = circle(length(world - dense_center), dots.dot_radius) * dense_ink * head_gate;

  var trail = 0.0;
  for (var i = 0; i < 12; i = i + 1) {
    let trail_sample = dots.trail[i];
    trail = max(trail, trail_sample.z * circle(length(world - trail_sample.xy), dots.dot_radius));
  }

  let mask = max(head, trail);
  let honey = srgb_to_linear(dots.honey.xyz);
  return vec4f(honey * 8.5 * mask, mask);
}
