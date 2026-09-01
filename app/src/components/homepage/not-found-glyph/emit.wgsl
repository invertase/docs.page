// Honey LED emitters along the 404 outline.
// Structure from triangle-led-front shaders/led-emitters.wgsl (rev 90b65bf4…):
// LED storage + intensity mix. Official LEDS_PER_EDGE=24; 404 seats along
// traced contours instead. Clip uses the glyph SDF instead of triangle_sdf.

struct Config {
  resolution: vec2f,
  tunables: vec4f,
  honey: vec4f,
  shape: vec4f,
};

struct Led {
  pos_brightness: vec4f,
  color: vec4f,
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var<storage, read> leds: array<Led>;
@group(0) @binding(2) var sdf_tex: texture_2d<f32>;
@group(0) @binding(3) var sdf_samp: sampler;

fn srgb_to_linear(color: vec3f) -> vec3f {
  let low = color / 12.92;
  let high = pow((color + 0.055) / 1.055, vec3f(2.4));
  return select(high, low, color <= vec3f(0.04045));
}

fn oriented_box(pixel: vec2f, center: vec2f, angle: f32, half_t: f32, half_n: f32) -> f32 {
  let dir = vec2f(cos(angle), sin(angle));
  let nrm = vec2f(-dir.y, dir.x);
  let local = pixel - center;
  let q = abs(vec2f(dot(local, dir), dot(local, nrm))) - vec2f(half_t, half_n);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scene_size = vec2f(textureDimensions(sdf_tex));
  let pixel = uv * scene_size;
  let half_texel = 0.5 / scene_size;
  let sdf_uv = clamp(uv, half_texel, vec2f(1.0) - half_texel);
  let sdf = textureSampleLevel(sdf_tex, sdf_samp, sdf_uv, 0.0).r;
  if (sdf - cfg.tunables.w > 0.0) {
    return vec4f(0.0);
  }

  let count = u32(clamp(cfg.shape.z, 0.0, 144.0));
  let half_t = cfg.shape.x;
  let half_n = cfg.shape.y;
  var coverage = 0.0;
  var brightness = 0.0;
  for (var i = 0u; i < count; i = i + 1u) {
    let led = leds[i];
    let box = oriented_box(
      pixel,
      led.pos_brightness.xy,
      led.pos_brightness.w,
      half_t,
      half_n,
    );
    let cover = 1.0 - smoothstep(-0.6, 0.8, box);
    if (cover > coverage) {
      coverage = cover;
      brightness = clamp(led.pos_brightness.z, 0.0, 1.0);
    }
  }

  if (coverage <= 0.001) {
    return vec4f(0.0);
  }

  let intensity = mix(cfg.tunables.y, cfg.tunables.z, brightness);
  let honey = srgb_to_linear(cfg.honey.xyz);
  let emit = honey * cfg.tunables.x * intensity * coverage;
  return vec4f(emit, coverage);
}
