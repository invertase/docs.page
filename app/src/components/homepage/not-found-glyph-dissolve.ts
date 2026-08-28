/**
 * Pointer-driven 2D dissolve for the site 404 glyph.
 *
 * vgpu (WebGPU) would need a WGSL loader and has no fallback in this Pages
 * app, so this uses a small WebGL fragment shader instead. Under the pointer,
 * 1px honey circles pack tighter than the page lattice; along the trail they
 * space out onto that 22px / 1px spot grid. Ink is lifted only inside each
 * speck. The glyph body stays a smooth filled texture.
 */

/** Matches `.homepage-spot-grid` in homepage.module.css */
export const SPOT_GRID_CELL_PX = 22;
export const SPOT_GRID_DOT_RADIUS_PX = 1;

/** Packed cluster under the pointer (CSS px). Trail spreads to 22px. */
const DENSE_CELL_PX = 7;

/** Locked brand honey from the Shaders room. */
export const HONEY_RGB = [230 / 255, 145 / 255, 53 / 255] as const;

/** Which dense cells light — not a body-fade radius. */
const HEAD_INNER_PX = 6;
const HEAD_OUTER_PX = 34;
const TRAIL_LIFE_MS = 260;
const TRAIL_COUNT = 12;
const TRAIL_RECORD_PX = 6;

const VERTEX_SRC = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

uniform sampler2D uGlyph;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uOrigin;
uniform vec2 uPointer;
uniform float uActive;
uniform vec4 uTrail[12];
uniform float uDenseCell;
uniform float uDotRadius;
uniform vec3 uHoney;
uniform float uHeadInner;
uniform float uHeadOuter;

float circle(float dist, float radius) {
  return 1.0 - smoothstep(radius * 0.45, radius, dist);
}

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
  float glyph = texture2D(uGlyph, uv).a;

  vec2 fragCss = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  vec2 world = uOrigin + fragCss;

  vec2 denseCenter = (floor(world / uDenseCell) + 0.5) * uDenseCell;
  vec2 denseUv = (denseCenter - uOrigin) * uDpr / uResolution;
  float denseInk = step(0.12, texture2D(uGlyph, denseUv).a);
  float headGate = uActive * (1.0 - smoothstep(uHeadInner, uHeadOuter, length(denseCenter - uPointer)));
  float head = circle(length(world - denseCenter), uDotRadius) * denseInk * headGate;

  float trail = 0.0;
  for (int i = 0; i < 12; i++) {
    float str = uTrail[i].z;
    trail = max(trail, str * circle(length(world - uTrail[i].xy), uDotRadius));
  }

  float dots = max(head, trail);
  float body = glyph * (1.0 - dots);
  float alpha = max(body, dots);
  gl_FragColor = vec4(uHoney * alpha, alpha);
}
`;

export type GlyphDissolveHandle = {
  dispose: () => void;
};

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }

  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function parseCssRgb(color: string): readonly [number, number, number] {
  const rgb = color.match(/rgba?\(\s*([\d.]+)[,\s/]+([\d.]+)[,\s/]+([\d.]+)/);
  if (rgb) {
    return [Number(rgb[1]) / 255, Number(rgb[2]) / 255, Number(rgb[3]) / 255];
  }
  return HONEY_RGB;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function activateProgram(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): void {
  // Biome's hooks rule treats `gl.useProgram` as a React hook.
  gl.useProgram.bind(gl)(program);
}

export function createGlyphDissolve(
  canvas: HTMLCanvasElement,
  textEl: HTMLElement,
): GlyphDissolveHandle | null {
  if (prefersReducedMotion()) return null;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const program = createProgram(gl);
  if (!program) return null;

  const quad = gl.createBuffer();
  const texture = gl.createTexture();
  if (!quad || !texture) {
    gl.deleteProgram(program);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const uGlyph = gl.getUniformLocation(program, "uGlyph");
  const uResolution = gl.getUniformLocation(program, "uResolution");
  const uDpr = gl.getUniformLocation(program, "uDpr");
  const uOrigin = gl.getUniformLocation(program, "uOrigin");
  const uPointer = gl.getUniformLocation(program, "uPointer");
  const uActive = gl.getUniformLocation(program, "uActive");
  const uTrail =
    gl.getUniformLocation(program, "uTrail[0]") ??
    gl.getUniformLocation(program, "uTrail");
  const uDenseCell = gl.getUniformLocation(program, "uDenseCell");
  const uDotRadius = gl.getUniformLocation(program, "uDotRadius");
  const uHoney = gl.getUniformLocation(program, "uHoney");
  const uHeadInner = gl.getUniformLocation(program, "uHeadInner");
  const uHeadOuter = gl.getUniformLocation(program, "uHeadOuter");

  const glyphCanvas = document.createElement("canvas");
  const glyphCtx = glyphCanvas.getContext("2d");
  if (!glyphCtx) {
    gl.deleteBuffer(quad);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    return null;
  }

  let disposed = false;
  let raf = 0;
  let active = 0;
  let targetActive = 0;
  let pointerX = 0;
  let pointerY = 0;
  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;
  let honey = HONEY_RGB;
  let lastTs = performance.now();
  const trail: { x: number; y: number; t: number }[] = [];
  const trailData = new Float32Array(TRAIL_COUNT * 4);

  const paintGlyph = () => {
    const style = getComputedStyle(textEl);
    honey = parseCssRgb(style.color);

    glyphCanvas.width = Math.max(1, Math.round(cssWidth * dpr));
    glyphCanvas.height = Math.max(1, Math.round(cssHeight * dpr));
    glyphCtx.setTransform(1, 0, 0, 1, 0, 0);
    glyphCtx.clearRect(0, 0, glyphCanvas.width, glyphCanvas.height);
    glyphCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    glyphCtx.fillStyle = "#fff";
    glyphCtx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} / ${style.lineHeight} ${style.fontFamily}`;
    glyphCtx.textAlign = "center";
    glyphCtx.textBaseline = "middle";
    glyphCtx.fillText("404", cssWidth / 2, cssHeight / 2);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      glyphCanvas,
    );
  };

  const resize = () => {
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextW = Math.max(1, textEl.clientWidth);
    const nextH = Math.max(1, textEl.clientHeight);
    if (nextW === cssWidth && nextH === cssHeight && nextDpr === dpr) {
      return;
    }
    cssWidth = nextW;
    cssHeight = nextH;
    dpr = nextDpr;
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    gl.viewport(0, 0, canvas.width, canvas.height);
    paintGlyph();
  };

  const snapTo = (v: number, cell: number) =>
    (Math.floor(v / cell) + 0.5) * cell;

  const packTrail = (now: number) => {
    trailData.fill(0);
    const cutoff = now - TRAIL_LIFE_MS;
    while (trail.length > 0 && trail[trail.length - 1].t < cutoff) {
      trail.pop();
    }
    const seen = new Set<string>();
    let slot = 0;
    for (let i = 0; i < trail.length && slot < TRAIL_COUNT; i++) {
      const sample = trail[i];
      const age = Math.min(1, (now - sample.t) / TRAIL_LIFE_MS);
      const fade = Math.max(0, 1 - age);
      const spread = age * age * (3 - 2 * age);
      const t = spread * spread;
      const denseX = snapTo(sample.x, DENSE_CELL_PX);
      const denseY = snapTo(sample.y, DENSE_CELL_PX);
      const pageX = snapTo(sample.x, SPOT_GRID_CELL_PX);
      const pageY = snapTo(sample.y, SPOT_GRID_CELL_PX);
      const x = denseX + (pageX - denseX) * t;
      const y = denseY + (pageY - denseY) * t;
      const key =
        t > 0.55
          ? `${Math.round(pageX / SPOT_GRID_CELL_PX)}:${Math.round(pageY / SPOT_GRID_CELL_PX)}`
          : `${Math.round(denseX / DENSE_CELL_PX)}:${Math.round(denseY / DENSE_CELL_PX)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      trailData[slot * 4] = x;
      trailData[slot * 4 + 1] = y;
      trailData[slot * 4 + 2] = fade;
      slot += 1;
    }
  };

  const draw = () => {
    if (disposed || gl.isContextLost()) return;

    const now = performance.now();
    packTrail(now);
    const rect = canvas.getBoundingClientRect();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    activateProgram(gl, program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uGlyph, 0);
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.uniform1f(uDpr, dpr);
    gl.uniform2f(uOrigin, rect.left, rect.top);
    gl.uniform2f(uPointer, pointerX, pointerY);
    gl.uniform1f(uActive, active);
    if (uTrail) gl.uniform4fv(uTrail, trailData);
    gl.uniform1f(uDenseCell, DENSE_CELL_PX);
    gl.uniform1f(uDotRadius, SPOT_GRID_DOT_RADIUS_PX);
    gl.uniform3f(uHoney, honey[0], honey[1], honey[2]);
    gl.uniform1f(uHeadInner, HEAD_INNER_PX);
    gl.uniform1f(uHeadOuter, HEAD_OUTER_PX);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const tick = (ts: number) => {
    if (disposed) return;
    const dt = Math.min(0.05, Math.max(0, (ts - lastTs) / 1000));
    lastTs = ts;
    active += (targetActive - active) * (1 - Math.exp(-dt * 14));
    if (Math.abs(active) < 0.001 && targetActive === 0) active = 0;
    draw();
    raf = requestAnimationFrame(tick);
  };

  const noteTrail = (clientX: number, clientY: number, over: boolean) => {
    if (!over) return;
    const t = performance.now();
    const head = trail[0];
    if (
      !head ||
      Math.hypot(clientX - head.x, clientY - head.y) >= TRAIL_RECORD_PX
    ) {
      trail.unshift({ x: clientX, y: clientY, t });
    } else {
      head.x = clientX;
      head.y = clientY;
      head.t = t;
    }
    if (trail.length > TRAIL_COUNT) trail.length = TRAIL_COUNT;
  };

  const updatePointer = (clientX: number, clientY: number) => {
    pointerX = clientX;
    pointerY = clientY;
    const rect = canvas.getBoundingClientRect();
    const over =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;
    targetActive = over ? 1 : 0;
    noteTrail(clientX, clientY, over);
  };

  const onPointerMove = (event: PointerEvent) => {
    updatePointer(event.clientX, event.clientY);
  };

  const onPointerDown = (event: PointerEvent) => {
    updatePointer(event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerType === "mouse") {
      updatePointer(event.clientX, event.clientY);
      return;
    }
    targetActive = 0;
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const onContextRestored = () => {
    resize();
    lastTs = performance.now();
    raf = requestAnimationFrame(tick);
  };

  resize();
  draw();

  const observer = new ResizeObserver(() => {
    resize();
  });
  observer.observe(textEl);

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  raf = requestAnimationFrame(tick);

  const fontsReady = document.fonts?.ready?.then(() => {
    if (!disposed) paintGlyph();
  });
  void fontsReady;

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl.deleteBuffer(quad);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    },
  };
}
