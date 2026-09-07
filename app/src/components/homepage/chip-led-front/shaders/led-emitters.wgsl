struct Config {
  // xy = CSS resolution (layout / uniforms). z = devicePixelRatio. w unused.
  resolution: vec4f,
  tunables: vec4f,
  triangle: vec4f,
  // x = outer crop (CSS px), y = fillet, z = capsule half-length, w = capsule radius.
  led_clip: vec4f,
};
struct Led {
  pos_brightness: vec4f,
  color: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var<storage, read> leds: array<Led>;

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
  let clip = (in.position / cfg.resolution.xy) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0);
  out.pos = vec4f(clip, 0.0, 1.0);
  out.led_index = in.led_index;
  return out;
}

fn sdf_rounded_box(
  p: vec2f,
  center: vec2f,
  half_extents: vec2f,
  fillet: f32,
) -> f32 {
  let radius = max(0.0, min(fillet, min(half_extents.x, half_extents.y)));
  let q = abs(p - center) - half_extents + vec2f(radius);
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn sd_oriented_capsule(p: vec2f, center: vec2f, half_len: f32, radius: f32, angle: f32) -> f32 {
  let c = cos(angle);
  let s = sin(angle);
  let dlt = p - center;
  let local = vec2f(c * dlt.x + s * dlt.y, -s * dlt.x + c * dlt.y);
  let qx = local.x - clamp(local.x, -half_len, half_len);
  return length(vec2f(qx, local.y)) - radius;
}

@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {
  let dpr = max(cfg.resolution.z, 1.0);
  // Framebuffer is CSS × DPR; SDF / LED layout stay in CSS pixels.
  let pixel = in.pos.xy / dpr;
  let hex_dist = sdf_rounded_box(
    pixel,
    cfg.triangle.xy,
    cfg.triangle.zw,
    cfg.led_clip.y,
  );
  // ~1 device pixel of AA in CSS space so the hard rim isn't a staircase.
  let aa = max(0.45, 1.0 / dpr);
  let outer = cfg.led_clip.x;
  let box_alpha = 1.0 - smoothstep(outer - aa, outer + aa, hex_dist);
  if (box_alpha <= 0.001) {
    discard;
  }

  let raw_index = u32(max(round(in.led_index), 0.0));
  let i = min(raw_index, arrayLength(&leds) - 1u);
  let led = leds[i];
  let n01 = clamp(led.pos_brightness.z, 0.0, 1.0);
  let intensity = mix(cfg.tunables.y, cfg.tunables.z, n01);
  var emit = led.color.rgb * cfg.tunables.x * intensity;
  let half_len = max(cfg.led_clip.z, 0.0);
  let radius = max(cfg.led_clip.w, 0.35);
  let cap = sd_oriented_capsule(
    pixel,
    led.pos_brightness.xy,
    half_len,
    radius,
    led.pos_brightness.w,
  );
  let cap_alpha = 1.0 - smoothstep(-aa, aa, cap);
  // writeMask is RGB-only — fade the colour, not alpha.
  emit *= box_alpha * max(cap_alpha, 0.0);
  return vec4f(emit, 0.0);
}
