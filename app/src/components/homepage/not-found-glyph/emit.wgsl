// Pointer-activated lattice: filled 1px honey circles. Packed tight under the
// cursor, then the same specks sit on the page 22px grid along the wake.

struct Dots {
  origin: vec2f,
  css_size: vec2f,
  pointer: vec2f,
  enabled: f32,
  _pad0: f32,
  honey: vec4f,
  dense_cell: f32,
  page_cell: f32,
  dot_radius: f32,
  head_inner: f32,
  head_outer: f32,
  _pad1: f32,
  _pad2: vec2f,
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

fn filled_circle(dist: f32, radius: f32) -> f32 {
  return 1.0 - smoothstep(radius - 0.4, radius + 0.4, dist);
}

fn snap_center(world: vec2f, cell: f32) -> vec2f {
  return (floor(world / cell) + 0.5) * cell;
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
  let dist_pointer = length(world - dots.pointer);

  let dense_center = snap_center(world, dots.dense_cell);
  let page_center = snap_center(world, dots.page_cell);
  let dense_uv = (dense_center - dots.origin) / css_size;
  let page_uv = (page_center - dots.origin) / css_size;
  let dense_ink = step(0.12, sample_glyph(dense_uv));
  let page_ink = step(0.12, sample_glyph(page_uv));

  let head_gate = dots.enabled * (1.0 - smoothstep(
    dots.head_inner,
    dots.head_outer,
    dist_pointer,
  ));
  let to_page = smoothstep(dots.head_inner, dots.head_outer, dist_pointer);

  let dense_speck = filled_circle(
    length(world - dense_center),
    dots.dot_radius,
  ) * dense_ink * head_gate * (1.0 - to_page);

  let page_speck = filled_circle(
    length(world - page_center),
    dots.dot_radius,
  ) * page_ink * head_gate * to_page;

  var trail_mask = 0.0;
  for (var i = 0; i < 12; i = i + 1) {
    let trail_sample = dots.trail[i];
    let trail_page = snap_center(trail_sample.xy, dots.page_cell);
    trail_mask = max(
      trail_mask,
      trail_sample.z * filled_circle(length(world - trail_page), dots.dot_radius),
    );
  }

  let coverage = max(dense_speck, max(page_speck, trail_mask));
  let honey = srgb_to_linear(dots.honey.xyz);
  return vec4f(honey * coverage, coverage);
}
