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

// Outer silhouette of Lexend Light '4' (unit height, y-down). Used for rim LEDs / rays.
const FOUR_SILHOUETTE_N: u32 = 11u;

fn four_unit_point(i: u32) -> vec2f {
  var pts = array<vec2f, 11>(
    vec2f(0.1029, 0.5),
    vec2f(0.2114, 0.5),
    vec2f(0.2114, 0.2286),
    vec2f(0.3857, 0.2286),
    vec2f(0.3857, 0.1229),
    vec2f(0.2114, 0.1229),
    vec2f(0.2114, -0.5),
    vec2f(0.1243, -0.5),
    vec2f(-0.3857, 0.1229),
    vec2f(-0.3329, 0.2286),
    vec2f(0.1029, 0.2286),
  );
  return pts[i];
}

fn sdf_box(p: vec2f, center: vec2f, half: vec2f) -> f32 {
  let d = abs(p - center) - half;
  return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0);
}

fn sdf_oriented_box(p: vec2f, a: vec2f, b: vec2f, th: f32) -> f32 {
  let ba = b - a;
  let l = max(length(ba), 1e-8);
  let dir = ba / l;
  let q = p - (a + b) * 0.5;
  let r = vec2f(dir.x * q.x + dir.y * q.y, -dir.y * q.x + dir.x * q.y);
  let d = abs(r) - vec2f(l * 0.5, th);
  return length(max(d, vec2f(0.0))) + min(max(d.x, d.y), 0.0);
}

// Stem ∪ bar ∪ diagonal — solid black at the join (not a holey polyline).
export fn sdf_four(p: vec2f, center: vec2f, height: f32) -> f32 {
  let h = max(height, 1e-4);
  let q = (p - center) / h;
  let stem = sdf_box(q, vec2f(0.15715, 0.0), vec2f(0.05425, 0.5));
  let bar = sdf_box(q, vec2f(0.0264, 0.17575), vec2f(0.3593, 0.05285));
  let diag = sdf_oriented_box(
    q,
    vec2f(0.16785, -0.5),
    vec2f(-0.3593, 0.1757),
    0.05425,
  );
  return min(stem, min(bar, diag)) * h;
}

export fn four_world_point(i: u32, center: vec2f, height: f32) -> vec2f {
  return center + four_unit_point(i % FOUR_SILHOUETTE_N) * height;
}

export fn four_silhouette_n() -> u32 {
  return FOUR_SILHOUETTE_N;
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
