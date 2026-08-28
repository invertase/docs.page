import { rc_atlas_texel, rc_block_size, rc_ray_count } from "./rc-directions.wgsl";

struct Present {
  /** x: speck lift, y: shove in scene px, z: pointer enabled, w: direction block side. */
  display: vec4f,
  honey: vec4f,
  /** xy: pointer in scene pixels, z: inner radius, w: outer radius. */
  warp: vec4f,
  /** xy: recent motion in scene pixels. */
  smear: vec4f,
};

@group(0) @binding(0) var<uniform> present: Present;
@group(0) @binding(1) var cascade_tex: texture_2d<f32>;
@group(0) @binding(2) var emitter_tex: texture_2d<f32>;
@group(0) @binding(3) var glyph_tex: texture_2d<f32>;
@group(0) @binding(4) var glyph_samp: sampler;

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

fn sample_glyph(uv: vec2f, half_texel: vec2f) -> f32 {
  return textureSampleLevel(
    glyph_tex,
    glyph_samp,
    clamp(uv, half_texel, vec2f(1.0) - half_texel),
    0.0,
  ).a;
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene_size = vec2f(textureDimensions(emitter_tex));
  let pixel = uv * scene_size;
  let half_texel = 0.5 / scene_size;
  let scene_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), scene_size - 1.0));

  let enabled = present.display.z;
  let inner = present.warp.z;
  let outer = present.warp.w;
  let delta = pixel - present.warp.xy;
  let dist = length(delta);
  let falloff = enabled * pow(1.0 - smoothstep(inner, outer, dist), 1.6);
  let radial = delta * inverseSqrt(dist * dist + 1.0e-4);
  let motion = present.smear.xy;
  let motion_len = length(motion);
  let along = motion * inverseSqrt(motion_len * motion_len + 1.0e-4);
  let push = normalize(radial * 0.7 + along * 0.55 * min(motion_len * 0.12, 1.0) + vec2f(1.0e-5, 0.0));
  let shove_px = push * present.display.y * falloff;
  let displaced_uv = scene_uv - shove_px / scene_size;

  let origin_a = sample_glyph(scene_uv, half_texel);
  let glyph_a = sample_glyph(displaced_uv, half_texel);
  var smear_a = 0.0;
  for (var tap = 1; tap < 5; tap = tap + 1) {
    let t = 1.0 + f32(tap) * 0.32;
    let tap_uv = scene_uv - (shove_px * t) / scene_size;
    let weight = falloff * (1.0 - f32(tap) / 5.0);
    smear_a = max(smear_a, sample_glyph(tap_uv, half_texel) * weight * 0.5);
  }

  let body = max(origin_a, glyph_a);
  let tail = smear_a * (1.0 - body);
  let dots_a = clamp(textureLoad(emitter_tex, texel, 0).a, 0.0, 1.0);
  let honey = present.honey.xyz;
  let lift = present.display.x;
  let gap = 1.0 - body;

  let irradiance = resolve_cascade0(pixel);
  let energy = min(dot(max(irradiance, vec3f(0.0)), vec3f(0.333)) * 0.45, 0.35);
  let halo = honey * energy * gap;
  let specks = honey * lift * dots_a * gap;
  let premul = honey * body + honey * 0.55 * tail + specks + halo;
  let alpha = max(body, max(tail, max(dots_a * gap, energy * gap)));
  return vec4f(premul, alpha);
}
