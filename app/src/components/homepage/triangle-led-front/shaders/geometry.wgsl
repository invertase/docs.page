fn sdf_segment(p: vec2f, a: vec2f, b: vec2f) -> f32 {
  let pa = p - a;
  let ba = b - a;
  let h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// Exact pointy-top hex (IQ flat-top, x/y swapped). `circumradius` is center → vertex.
export fn sdf_hex_pointy(p: vec2f, center: vec2f, circumradius: f32) -> f32 {
  let r = circumradius * 0.8660254037844386;
  let k = vec3f(-0.8660254037844386, 0.5, 0.5773502691896258);
  var q = abs((p - center).yx);
  q = q - 2.0 * min(dot(k.xy, q), 0.0) * k.xy;
  q = q - vec2f(clamp(q.x, -k.z * r, k.z * r), r);
  return length(q) * sign(q.y);
}

// Fillet corners while keeping the six flats. `fillet` is world-space radius.
export fn sdf_hex_pointy_rounded(
  p: vec2f,
  center: vec2f,
  circumradius: f32,
  fillet: f32,
) -> f32 {
  let radius = max(fillet, 0.0);
  let inner = max(circumradius - radius * 1.1547005383792517, 1e-4);
  return sdf_hex_pointy(p, center, inner) - radius;
}

export fn sdf_triangle_vertices(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> f32 {
  let d = min(min(sdf_segment(p, a, b), sdf_segment(p, b, c)), sdf_segment(p, c, a));
  let edge0 = b - a;
  let edge1 = c - b;
  let edge2 = a - c;
  let side0 = edge0.x * (p.y - a.y) - edge0.y * (p.x - a.x);
  let side1 = edge1.x * (p.y - b.y) - edge1.y * (p.x - b.x);
  let side2 = edge2.x * (p.y - c.y) - edge2.y * (p.x - c.x);
  let inside = (side0 <= 0.0 && side1 <= 0.0 && side2 <= 0.0) || (side0 >= 0.0 && side1 >= 0.0 && side2 >= 0.0);
  return select(d, -d, inside);
}
