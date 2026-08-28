// 22px page-lattice specks under a wide pointer head. The 1px cores seed the
// cascade; a short gaussian halo makes them read as glowing honey, not idle grid.

struct Dots {
  origin: vec2f,
  css_size: vec2f,
  pointer: vec2f,
  enabled: f32,
  _pad0: f32,
  honey: vec4f,
  speck_glow: f32,
  page_cell: f32,
  dot_radius: f32,
  head_inner: f32,
  head_outer: f32,
  _pad1: f32,
  _pad2: vec2f,
  trail: array<vec4f, 12>,
};

@group(0) @binding(0) var<uniform> dots: Dots;

fn srgb_to_linear(color: vec3f) -> vec3f {
  let low = color / 12.92;
  let high = pow((color + 0.055) / 1.055, vec3f(2.4));
  return select(high, low, color <= vec3f(0.04045));
}

fn filled_circle(dist: f32, radius: f32) -> f32 {
  return 1.0 - smoothstep(radius - 0.4, radius + 0.4, dist);
}

fn glowing_speck(dist: f32, radius: f32, glow: f32) -> f32 {
  let core = filled_circle(dist, radius);
  let sigma = max(glow, 0.35);
  let halo = exp(-0.5 * (dist * dist) / (sigma * sigma)) * 0.55;
  return min(1.0, max(core, halo));
}

fn snap_center(world: vec2f, cell: f32) -> vec2f {
  return (floor(world / cell) + 0.5) * cell;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let css_size = max(dots.css_size, vec2f(1.0));
  let world = dots.origin + uv * css_size;
  let dist_pointer = length(world - dots.pointer);

  let page_center = snap_center(world, dots.page_cell);
  let head_gate = dots.enabled * (1.0 - smoothstep(
    dots.head_inner,
    dots.head_outer,
    dist_pointer,
  ));

  let page_speck = glowing_speck(
    length(world - page_center),
    dots.dot_radius,
    dots.speck_glow,
  ) * head_gate;

  var trail_mask = 0.0;
  for (var i = 0; i < 12; i = i + 1) {
    let trail_sample = dots.trail[i];
    let trail_page = snap_center(trail_sample.xy, dots.page_cell);
    trail_mask = max(
      trail_mask,
      trail_sample.z * glowing_speck(
        length(world - trail_page),
        dots.dot_radius,
        dots.speck_glow,
      ),
    );
  }

  let coverage = max(page_speck, trail_mask);
  let honey = srgb_to_linear(dots.honey.xyz);
  return vec4f(honey * coverage, coverage);
}
