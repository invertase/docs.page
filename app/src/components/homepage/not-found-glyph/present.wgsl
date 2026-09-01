import { rc_atlas_texel, rc_block_size, rc_ray_count } from "./rc-directions.wgsl";

// Black occluder + outside-only honey wrap. Inside mask is glyph alpha via
// textureLoad, same test as jfa-init (rev 90b65bf4… floor occluder idea).
// Intensity scale is DIRECT_TRIANGLE_INTENSITY_SCALE = 50.

struct Present {
  /** x: intensity scale (50), w: direction block side. */
  display: vec4f,
  honey: vec4f,
};

@group(0) @binding(0) var<uniform> present: Present;
@group(0) @binding(1) var cascade_tex: texture_2d<f32>;
@group(0) @binding(2) var emitter_tex: texture_2d<f32>;
@group(0) @binding(3) var glyph_tex: texture_2d<f32>;
@group(0) @binding(4) var glyph_samp: sampler;
@group(0) @binding(5) var sdf_tex: texture_2d<f32>;

const LUMA = vec3f(0.2126, 0.7152, 0.0722);
const WRAP_PX: f32 = 96.0;

fn resolve_probe(probe: vec2f) -> vec3f {
  let block = rc_block_size(0.0, present.display.w);
  let rays = rc_ray_count(0.0, present.display.w);
  let atlas_size = vec2f(textureDimensions(cascade_tex));
  let clamped_probe = clamp(probe, vec2f(0.0), atlas_size / block - 1.0);
  var total = vec3f(0.0);
  for (var i = 0.0; i < rays; i = i + 1.0) {
    total += textureLoad(cascade_tex, vec2i(rc_atlas_texel(clamped_probe, i, block)), 0).rgb;
  }
  return total / rays;
}

fn resolve_cascade0(pixel: vec2f) -> vec3f {
  let position = pixel - 0.5;
  let base = floor(position);
  let blend = fract(position);
  let top = mix(resolve_probe(base), resolve_probe(base + vec2f(1.0, 0.0)), blend.x);
  let bottom = mix(resolve_probe(base + vec2f(0.0, 1.0)), resolve_probe(base + vec2f(1.0)), blend.x);
  return mix(top, bottom, blend.y);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene_size = vec2f(textureDimensions(glyph_tex));
  let pixel = uv * scene_size;
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), scene_size - 1.0));
  // Same inside test as jfa-init — not bilinear glyph_a, not unsigned-SDF wrap.
  let inside = textureLoad(glyph_tex, texel, 0).a > 0.5;
  if (inside) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  let honey = present.honey.xyz;
  let half_texel = 0.5 / scene_size;
  let scene_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let emitter = textureLoad(emitter_tex, texel, 0);
  let irradiance = max(resolve_cascade0(pixel), vec3f(0.0)) * present.display.x;
  let sdf = textureLoad(sdf_tex, texel, 0).r;
  let wrap = exp(-max(sdf, 0.0) / WRAP_PX);
  let surface = smoothstep(
    0.0,
    0.02,
    max(max(emitter.r, emitter.g), emitter.b),
  );
  let light = dot(irradiance, LUMA);
  let bloom = pow(clamp(light / 8.85, 0.0, 1.0), 0.05) * 0.65;
  let energy = min(wrap * (0.28 + bloom + surface) + surface + bloom, 1.35);
  let colour = honey * energy;
  let alpha = clamp(energy * wrap + surface, 0.0, 1.0);
  return vec4f(colour, alpha);
}
