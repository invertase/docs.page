// Vertex LED emitters from triangle-led-front shaders/led-emitters.wgsl
// (rev 90b65bf4…). Clip uses the Lexend glyph SDF instead of triangle_sdf.

struct Config {
  resolution: vec2f,
  tunables: vec4f,
  triangle: vec4f,
  led_clip: vec4f,
};
struct Led {
  pos_brightness: vec4f,
  color: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var<storage, read> leds: array<Led>;
@group(0) @binding(2) var sdf_tex: texture_2d<f32>;
@group(0) @binding(3) var sdf_samp: sampler;

struct VSIn {
  @location(0) position: vec2f,
  @location(1) led_index: f32,
};
struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) led_index: f32,
};

@vertex fn vs_main(in: VSIn) -> VSOut {
  var out: VSOut;
  let clip = (in.position / cfg.resolution) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0);
  out.pos = vec4f(clip, 0.0, 1.0);
  out.led_index = in.led_index;
  return out;
}

@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {
  let pixel = in.pos.xy;
  let scene_size = vec2f(textureDimensions(sdf_tex));
  let half_texel = 0.5 / scene_size;
  let sdf_uv = clamp(pixel / scene_size, half_texel, vec2f(1.0) - half_texel);
  let sdf = textureSampleLevel(sdf_tex, sdf_samp, sdf_uv, 0.0).r;
  // Positive expansion reveals emitter pixels outside the glyph, same test as
  // official `tri_dist - cfg.led_clip.x > 0.0`.
  if (sdf - cfg.led_clip.x > 0.0) {
    discard;
  }

  let raw_index = u32(max(round(in.led_index), 0.0));
  let i = min(raw_index, arrayLength(&leds) - 1u);
  let n01 = clamp(leds[i].pos_brightness.z, 0.0, 1.0);
  let intensity = mix(cfg.tunables.y, cfg.tunables.z, n01);
  let emit = leds[i].color.rgb * cfg.tunables.x * intensity;
  // Alpha is masked off by the pipeline writeMask (RGB only).
  return vec4f(emit, 0.0);
}
