import { rc_atlas_texel, rc_block_size, rc_ray_count } from "./rc-directions.wgsl";

struct Present {
  /** x: speck lift, y: orb gain, z: pointer enabled, w: direction block side. */
  display: vec4f,
  honey: vec4f,
  /** xy: pointer in scene pixels, z: inner radius, w: outer radius. */
  orb: vec4f,
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

fn soft_disc(dist: f32, radius: f32, blur: f32) -> f32 {
  return 1.0 - smoothstep(max(radius - blur, 0.0), radius + blur * 0.2, dist);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene_size = vec2f(textureDimensions(emitter_tex));
  let pixel = uv * scene_size;
  let half_texel = 0.5 / scene_size;
  let scene_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let texel = vec2i(clamp(floor(pixel), vec2f(0.0), scene_size - 1.0));

  let glyph_a = textureSampleLevel(glyph_tex, glyph_samp, scene_uv, 0.0).a;
  let dots_a = clamp(textureLoad(emitter_tex, texel, 0).a, 0.0, 1.0);
  let honey = present.honey.xyz;
  let lift = present.display.x;
  let orb_gain = present.display.y;
  let enabled = present.display.z;
  let inner = present.orb.z;
  let outer = present.orb.w;
  let dist = length(pixel - present.orb.xy);
  let blur = max(outer - inner, 1.0);

  // Figma: honey ellipses at 50% + 27% LINEAR_DODGE, ~103px blur, ~220–250px across.
  let disc = soft_disc(dist, outer * 0.55, blur);
  let bloom = exp(-0.5 * (dist * dist) / ((blur * 0.52) * (blur * 0.52)));
  let glow_k = enabled * orb_gain * (0.50 * disc + 0.27 * bloom);

  // Dark ellipse (~219px, ~53px blur): type fades where the orb is strong.
  let dissolve = enabled * soft_disc(dist, outer * 0.88, blur * 0.53);
  let body = glyph_a * (1.0 - dissolve);

  let irradiance = resolve_cascade0(pixel);
  let energy = min(dot(max(irradiance, vec3f(0.0)), vec3f(0.333)) * 0.9, 0.72);
  let field = max(glow_k, energy);
  let halo = honey * field * (1.0 - body);
  let specks = honey * (lift + energy * 1.65) * dots_a;
  let premul = honey * body + specks + halo;
  let alpha = max(body, max(dots_a, field * (1.0 - body)));
  return vec4f(premul, alpha);
}
