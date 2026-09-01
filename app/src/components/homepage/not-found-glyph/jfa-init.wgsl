// Seeds the jump flood from the filled Lexend 404. The glyph is the occluder;
// LED emitters are a separate HDR target.

@group(0) @binding(0) var glyph: texture_2d<f32>;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let size = vec2f(textureDimensions(glyph));
  let pixel = clamp(floor(uv * size), vec2f(0.0), size - 1.0);
  let mask = textureLoad(glyph, vec2i(pixel), 0).a;
  if (mask > 0.5) {
    return vec4f(pixel + 0.5, 0.0, 1.0);
  }
  return vec4f(0.0);
}
