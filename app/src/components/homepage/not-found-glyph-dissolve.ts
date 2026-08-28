/**
 * Pointer-driven 2D dissolve for the site 404 glyph.
 *
 * vgpu (WebGPU) would need a WGSL loader and has no fallback in this Pages
 * app, so this uses a small WebGL fragment shader instead. Specks lock to the
 * landing 22px / 1px spot grid (homepage.module.css). Ink is lifted only in
 * small discs around lattice cells that sit on the 404 stroke near the pointer
 * — not a circular body fade. Those cells light honey; a short cell trail heals.
 */

/** Matches `.homepage-spot-grid` in homepage.module.css */
export const SPOT_GRID_CELL_PX = 22;
export const SPOT_GRID_DOT_RADIUS_PX = 1;

/** Locked brand honey from the Shaders room. */
export const HONEY_RGB = [230 / 255, 145 / 255, 53 / 255] as const;

/**
 * Activate lattice cells whose center is this close to the pointer (CSS px).
 * This is not a body-fade radius — fill is only removed in tiny discs.
 */
const CELL_NEAR_INNER_PX = 8;
const CELL_NEAR_OUTER_PX = 32;
/** Disc that lifts ink around an activated cell. Not a 22px tile. */
const PUNCH_INNER_PX = 2.2;
const PUNCH_OUTER_PX = 6.5;
/** Single-row wake: half a cell so neighbours stay off. */
const TRAIL_RADIUS_PX = 11;
const TRAIL_LIFE_MS = 240;
const TRAIL_COUNT = 12;
/** Keep about 5–6 lit cells (~110–130px), then they fade. */
const TRAIL_CELLS = 6;

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
uniform float uGridCell;
uniform float uDotRadius;
uniform vec3 uHoney;
uniform float uNearInner;
uniform float uNearOuter;
uniform float uPunchInner;
uniform float uPunchOuter;
uniform float uTrailRadius;

void main() {
  vec2 uv = vec2(gl_FragCoord.x / uResolution.x, 1.0 - gl_FragCoord.y / uResolution.y);
  float glyph = texture2D(uGlyph, uv).a;

  vec2 fragCss = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y) / uDpr;
  vec2 world = uOrigin + fragCss;

  // Same 22px / 1px lattice as the page spot grid.
  vec2 cellCenter = (floor(world / uGridCell) + 0.5) * uGridCell;
  float toDot = length(world - cellCenter);
  float core = 1.0 - smoothstep(uDotRadius * 0.3, uDotRadius, toDot);
  float halo = 1.0 - smoothstep(uDotRadius, uDotRadius + 0.65, toDot);
  float speck = max(core, halo * 0.45);

  vec2 cellUv = (cellCenter - uOrigin) * uDpr / uResolution;
  float onInk = step(0.15, texture2D(uGlyph, cellUv).a);

  // Gate the *cell*, not the fragment — no circular body melt.
  float near = uActive * (1.0 - smoothstep(uNearInner, uNearOuter, length(cellCenter - uPointer)));
  float trail = 0.0;
  for (int i = 0; i < 12; i++) {
    float str = uTrail[i].z;
    trail = max(
      trail,
      str * (1.0 - smoothstep(0.0, uTrailRadius, length(cellCenter - uTrail[i].xy)))
    );
  }
  float activate = onInk * max(near, trail);

  float punch = activate * (1.0 - smoothstep(uPunchInner, uPunchOuter, toDot));
  float body = glyph * (1.0 - punch);
  float dots = speck * activate;
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
  const uGridCell = gl.getUniformLocation(program, "uGridCell");
  const uDotRadius = gl.getUniformLocation(program, "uDotRadius");
  const uHoney = gl.getUniformLocation(program, "uHoney");
  const uNearInner = gl.getUniformLocation(program, "uNearInner");
  const uNearOuter = gl.getUniformLocation(program, "uNearOuter");
  const uPunchInner = gl.getUniformLocation(program, "uPunchInner");
  const uPunchOuter = gl.getUniformLocation(program, "uPunchOuter");
  const uTrailRadius = gl.getUniformLocation(program, "uTrailRadius");

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

  const packTrail = (now: number) => {
    trailData.fill(0);
    const cutoff = now - TRAIL_LIFE_MS;
    while (trail.length > 0 && trail[trail.length - 1].t < cutoff) {
      trail.pop();
    }
    const count = Math.min(TRAIL_COUNT, trail.length);
    for (let i = 0; i < count; i++) {
      const sample = trail[i];
      const age = (now - sample.t) / TRAIL_LIFE_MS;
      const fade = Math.max(0, 1 - age);
      trailData[i * 4] = sample.x;
      trailData[i * 4 + 1] = sample.y;
      trailData[i * 4 + 2] = fade;
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
    gl.uniform1f(uGridCell, SPOT_GRID_CELL_PX);
    gl.uniform1f(uDotRadius, SPOT_GRID_DOT_RADIUS_PX);
    gl.uniform3f(uHoney, honey[0], honey[1], honey[2]);
    gl.uniform1f(uNearInner, CELL_NEAR_INNER_PX);
    gl.uniform1f(uNearOuter, CELL_NEAR_OUTER_PX);
    gl.uniform1f(uPunchInner, PUNCH_INNER_PX);
    gl.uniform1f(uPunchOuter, PUNCH_OUTER_PX);
    gl.uniform1f(uTrailRadius, TRAIL_RADIUS_PX);
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

  const snapCell = (v: number) =>
    (Math.floor(v / SPOT_GRID_CELL_PX) + 0.5) * SPOT_GRID_CELL_PX;

  const noteTrail = (clientX: number, clientY: number, over: boolean) => {
    if (!over) return;
    const t = performance.now();
    const x = snapCell(clientX);
    const y = snapCell(clientY);
    const head = trail[0];
    if (!head || head.x !== x || head.y !== y) {
      trail.unshift({ x, y, t });
    } else {
      head.t = t;
    }
    if (trail.length > TRAIL_CELLS) trail.length = TRAIL_CELLS;
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
