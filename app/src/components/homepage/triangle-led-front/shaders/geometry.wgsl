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

// Lexend Light '4' in unit space (height 1, y-down, origin at bbox center).
fn four_unit_point(i: u32) -> vec2f {
  var pts = array<vec2f, 12>(
    vec2f(0.1029, 0.5),
    vec2f(0.1029, -0.3671),
    vec2f(0.1343, -0.3571),
    vec2f(-0.28, 0.1486),
    vec2f(-0.2914, 0.1229),
    vec2f(0.3857, 0.1229),
    vec2f(0.3857, 0.2286),
    vec2f(-0.3329, 0.2286),
    vec2f(-0.3857, 0.1229),
    vec2f(0.1243, -0.5),
    vec2f(0.2114, -0.5),
    vec2f(0.2114, 0.5),
  );
  return pts[i];
}

export fn sdf_four(p: vec2f, center: vec2f, height: f32) -> f32 {
  let h = max(height, 1e-4);
  let q = (p - center) / h;
  var d = dot(q - four_unit_point(0u), q - four_unit_point(0u));
  var s = 1.0;
  for (var i = 0u; i < 12u; i = i + 1u) {
    let a = four_unit_point(i);
    let b = four_unit_point((i + 1u) % 12u);
    let e = b - a;
    let w = q - a;
    let btm = w - e * clamp(dot(w, e) / max(dot(e, e), 1e-8), 0.0, 1.0);
    d = min(d, dot(btm, btm));
    let c0 = q.y >= a.y;
    let c1 = q.y < b.y;
    let c2 = e.x * w.y > e.y * w.x;
    if ((c0 && c1 && c2) || (!c0 && !c1 && !c2)) {
      s = -s;
    }
  }
  return s * sqrt(d) * h;
}

export fn four_world_point(i: u32, center: vec2f, height: f32) -> vec2f {
  return center + four_unit_point(i) * height;
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
