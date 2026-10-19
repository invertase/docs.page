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

@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {
  let pixel = in.pos.xy;
  let hex_dist = sdf_rounded_box(
    pixel,
    cfg.triangle.xy,
    cfg.led_clip.zw,
    cfg.triangle.w,
  );
  // Positive expansion reveals emitter pixels outside the chip rect.
  if (hex_dist - cfg.led_clip.x > 0.0) {
    discard;
  }

  let raw_index = u32(max(round(in.led_index), 0.0));
  let i = min(raw_index, arrayLength(&leds) - 1u);
  let n01 = clamp(leds[i].pos_brightness.z, 0.0, 1.0);
  let intensity = mix(cfg.tunables.y, cfg.tunables.z, n01);
  let emit = leds[i].color.rgb * cfg.tunables.x * intensity;
  // Alpha (the LED SDF) is masked off by the pipeline writeMask (0x7 = RGB only) — the fullscreen
  // prepass owns the SDF — so the led_dist that used to go here is never written. Skip computing it.
  return vec4f(emit, 0.0);
}
