import { rc_atlas_texel, rc_block_size, rc_ray_count } from "./rc-directions.wgsl";

// Black occluder + LED rim from triangle-led-front main-scene-floor.wgsl
// (rev 90b65bf4…). No floor grain, tonemap, RGB tints, or demo fade.

struct Present {
  display: vec4f,
  honey: vec4f,
};

@group(0) @binding(0) var<uniform> present: Present;
@group(0) @binding(1) var cascade_tex: texture_2d<f32>;
@group(0) @binding(2) var emitter_tex: texture_2d<f32>;
@group(0) @binding(3) var glyph_tex: texture_2d<f32>;
@group(0) @binding(4) var glyph_samp: sampler;

const OCCLUDER_INTERIOR: f32 = 0.995;
const LUMA = vec3f(0.2126, 0.7152, 0.0722);

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
  let scene_size = vec2f(textureDimensions(emitter_tex));
  let pixel = uv * scene_size;
  let half_texel = 0.5 / scene_size;
  let scene_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), scene_size - 1.0));

  let glyph_a = textureSampleLevel(glyph_tex, glyph_samp, scene_uv, 0.0).a;
  // Official interior early-out: deep inside the occluder is opaque black.
  if (glyph_a > OCCLUDER_INTERIOR) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }

  let emitter = textureLoad(emitter_tex, texel, 0);
  let irradiance = max(resolve_cascade0(pixel), vec3f(0.0));
  // LED surface from emitter RGB, not .w — official writeMask is RGB only and
  // the target is cleared to alpha 1000.
  let surface = smoothstep(
    0.0,
    0.02,
    max(max(emitter.r, emitter.g), emitter.b),
  );

  var colour = irradiance;
  colour = mix(colour, emitter.rgb, surface);

  let occluder = clamp(glyph_a, 0.0, 1.0);
  colour = mix(colour, vec3f(0.0), occluder);

  let glow_a = clamp(max(dot(colour, LUMA), surface), 0.0, 1.0);
  let alpha = max(occluder, glow_a);
  return vec4f(colour, alpha);
}
