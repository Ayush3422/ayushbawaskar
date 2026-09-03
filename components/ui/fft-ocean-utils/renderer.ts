import { butterflyTable } from "./fft";
import { initialSpectrum } from "./spectrum";
import {
  butterflyTexture,
  floatTexture,
  framebufferFor,
  link,
} from "./gl";
import { gridMesh, lookAt, multiply, perspective } from "./mesh";
import {
  BUTTERFLY_FS,
  NORMAL_FS,
  OCEAN_FS,
  OCEAN_VS,
  QUAD_VS,
  RESOLVE_FS,
  TIME_SPECTRUM_FS,
} from "./shaders";

export interface OceanRenderer {
  /** Resolves once init has settled, successfully or not. Never rejects. */
  ready: Promise<void>;
  dispose(): void;
  setDepth(depth: number): void;
}

/** FFT resolution. 256 is 8 butterfly stages per direction. */
const N = 256;
/** Patch size in metres. */
const L = 512;
const GRID_SEGMENTS = 255;
/** The wave patch is repeated this many times per axis to push the horizon out. */
const TILES = 3;
const CHOPPINESS = 1.1;

const SPECTRUM = {
  windSpeed: 14,
  windDirX: 1,
  windDirZ: 0,
  amplitude: 4e-7,
  smallWave: 1,
};

/** Depth at which the camera passes through the surface. */
const SURFACE_CROSSING = 120;
/** Depth by which the water has gone fully black. */
const FULL_DARK = 4000;

/**
 * A renderer that failed to initialise. The page keeps its CSS fallback and
 * nothing throws — losing the ocean must never lose the site.
 */
function inertRenderer(): OceanRenderer {
  return {
    ready: Promise.resolve(),
    dispose: () => {},
    setDepth: () => {},
  };
}

export function createRenderer({
  canvas,
  depth = 0,
}: {
  canvas: HTMLCanvasElement;
  depth?: number;
}): OceanRenderer {
  let gl: WebGL2RenderingContext | null = null;

  try {
    gl = canvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      depth: true,
      powerPreference: "high-performance",
    }) as WebGL2RenderingContext | null;
  } catch {
    return inertRenderer();
  }

  if (!gl || !gl.getExtension("EXT_color_buffer_float")) {
    return inertRenderer();
  }

  const g = gl;
  const stages = Math.log2(N);

  let raf = 0;
  let disposed = false;
  let currentDepth = depth;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const programs: WebGLProgram[] = [];
  const textures: WebGLTexture[] = [];
  const framebuffers: WebGLFramebuffer[] = [];
  const buffers: WebGLBuffer[] = [];
  const vaos: WebGLVertexArrayObject[] = [];

  const track = <T>(list: T[], item: T): T => {
    list.push(item);
    return item;
  };

  let start = 0;

  const init = () => {
    // ---- programs -------------------------------------------------------
    const pTime = track(programs, link(g, QUAD_VS, TIME_SPECTRUM_FS));
    const pButterfly = track(programs, link(g, QUAD_VS, BUTTERFLY_FS));
    const pResolve = track(programs, link(g, QUAD_VS, RESOLVE_FS));
    const pNormal = track(programs, link(g, QUAD_VS, NORMAL_FS));
    const pOcean = track(programs, link(g, OCEAN_VS, OCEAN_FS));

    // ---- fullscreen quad ------------------------------------------------
    const quadVao = track(vaos, g.createVertexArray()!);
    g.bindVertexArray(quadVao);
    const quadBuf = track(buffers, g.createBuffer()!);
    g.bindBuffer(g.ARRAY_BUFFER, quadBuf);
    g.bufferData(
      g.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      g.STATIC_DRAW,
    );
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    g.bindVertexArray(null);

    // ---- ocean grid -----------------------------------------------------
    const { positions, indices } = gridMesh(GRID_SEGMENTS);
    const oceanVao = track(vaos, g.createVertexArray()!);
    g.bindVertexArray(oceanVao);
    const posBuf = track(buffers, g.createBuffer()!);
    g.bindBuffer(g.ARRAY_BUFFER, posBuf);
    g.bufferData(g.ARRAY_BUFFER, positions, g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 2, g.FLOAT, false, 0, 0);
    const idxBuf = track(buffers, g.createBuffer()!);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, idxBuf);
    g.bufferData(g.ELEMENT_ARRAY_BUFFER, indices, g.STATIC_DRAW);
    g.bindVertexArray(null);

    // ---- textures -------------------------------------------------------
    const h0Tex = track(
      textures,
      floatTexture(g, N, initialSpectrum(N, L, SPECTRUM)),
    );
    const bfTex = track(
      textures,
      butterflyTexture(g, stages, N, butterflyTable(N)),
    );

    const heightA = track(textures, floatTexture(g, N, null));
    const heightB = track(textures, floatTexture(g, N, null));
    const choppyXA = track(textures, floatTexture(g, N, null));
    const choppyXB = track(textures, floatTexture(g, N, null));
    const choppyZA = track(textures, floatTexture(g, N, null));
    const choppyZB = track(textures, floatTexture(g, N, null));
    const dispTex = track(textures, floatTexture(g, N, null));
    const normalTex = track(textures, floatTexture(g, N, null));

    const fbTime = track(
      framebuffers,
      framebufferFor(g, heightA, choppyXA, choppyZA),
    );
    const single = (t: WebGLTexture) =>
      track(framebuffers, framebufferFor(g, t));

    const fb: Record<string, WebGLFramebuffer> = {
      heightA: single(heightA),
      heightB: single(heightB),
      choppyXA: single(choppyXA),
      choppyXB: single(choppyXB),
      choppyZA: single(choppyZA),
      choppyZB: single(choppyZB),
      disp: single(dispTex),
      normal: single(normalTex),
    };

    const bind = (tex: WebGLTexture, unit: number) => {
      g.activeTexture(g.TEXTURE0 + unit);
      g.bindTexture(g.TEXTURE_2D, tex);
    };

    const drawQuad = () => {
      g.bindVertexArray(quadVao);
      g.drawArrays(g.TRIANGLES, 0, 3);
    };

    /** 8 horizontal then 8 vertical butterfly passes over one complex field. */
    const transform = (
      texA: WebGLTexture,
      texB: WebGLTexture,
      fbA: WebGLFramebuffer,
      fbB: WebGLFramebuffer,
    ): WebGLTexture => {
      g.useProgram(pButterfly);
      g.uniform1f(g.getUniformLocation(pButterfly, "u_N"), N);
      g.uniform1f(g.getUniformLocation(pButterfly, "u_stages"), stages);
      bind(bfTex, 0);
      g.uniform1i(g.getUniformLocation(pButterfly, "u_butterfly"), 0);
      g.uniform1i(g.getUniformLocation(pButterfly, "u_src"), 1);

      let src = texA;
      let srcFb = fbA;
      let dst = texB;
      let dstFb = fbB;

      for (let dir = 0; dir < 2; dir++) {
        g.uniform1i(g.getUniformLocation(pButterfly, "u_direction"), dir);
        for (let s = 0; s < stages; s++) {
          g.uniform1f(g.getUniformLocation(pButterfly, "u_stage"), s);
          g.bindFramebuffer(g.FRAMEBUFFER, dstFb);
          g.viewport(0, 0, N, N);
          bind(src, 1);
          drawQuad();
          [src, dst] = [dst, src];
          [srcFb, dstFb] = [dstFb, srcFb];
        }
      }

      return src;
    };

    const frame = (now: number) => {
      if (disposed) return;
      if (start === 0) start = now;
      const time = reduced ? 0 : (now - start) / 1000;

      g.disable(g.DEPTH_TEST);

      // 1. h(k,t) and both displacement components, three targets at once.
      g.bindFramebuffer(g.FRAMEBUFFER, fbTime);
      g.viewport(0, 0, N, N);
      g.useProgram(pTime);
      bind(h0Tex, 0);
      g.uniform1i(g.getUniformLocation(pTime, "u_h0"), 0);
      g.uniform1f(g.getUniformLocation(pTime, "u_time"), time);
      g.uniform1f(g.getUniformLocation(pTime, "u_N"), N);
      g.uniform1f(g.getUniformLocation(pTime, "u_L"), L);
      drawQuad();

      // 2. Three inverse transforms.
      const hOut = transform(heightA, heightB, fb.heightA, fb.heightB);
      const xOut = transform(choppyXA, choppyXB, fb.choppyXA, fb.choppyXB);
      const zOut = transform(choppyZA, choppyZB, fb.choppyZA, fb.choppyZB);

      // 3. Sign correction and scale into one displacement map.
      g.bindFramebuffer(g.FRAMEBUFFER, fb.disp);
      g.viewport(0, 0, N, N);
      g.useProgram(pResolve);
      bind(hOut, 0);
      bind(xOut, 1);
      bind(zOut, 2);
      g.uniform1i(g.getUniformLocation(pResolve, "u_height"), 0);
      g.uniform1i(g.getUniformLocation(pResolve, "u_choppyX"), 1);
      g.uniform1i(g.getUniformLocation(pResolve, "u_choppyZ"), 2);
      g.uniform1f(g.getUniformLocation(pResolve, "u_N"), N);
      g.uniform1f(g.getUniformLocation(pResolve, "u_choppiness"), CHOPPINESS);
      drawQuad();

      // 4. Normals and foam.
      g.bindFramebuffer(g.FRAMEBUFFER, fb.normal);
      g.viewport(0, 0, N, N);
      g.useProgram(pNormal);
      bind(dispTex, 0);
      g.uniform1i(g.getUniformLocation(pNormal, "u_disp"), 0);
      g.uniform1f(g.getUniformLocation(pNormal, "u_N"), N);
      g.uniform1f(g.getUniformLocation(pNormal, "u_L"), L);
      drawQuad();

      // 5. Draw the surface.
      const w = canvas.width;
      const h = canvas.height;
      g.bindFramebuffer(g.FRAMEBUFFER, null);
      g.viewport(0, 0, w, h);
      g.enable(g.DEPTH_TEST);
      g.clearColor(0.039, 0.039, 0.039, 1);
      g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);

      // Camera descends through the surface, then keeps going down.
      const t = currentDepth / SURFACE_CROSSING;
      const eyeY = 26 - t * 34;
      const below = currentDepth > SURFACE_CROSSING ? 1 : 0;
      const darkness = Math.min(currentDepth / FULL_DARK, 1);

      const eye: [number, number, number] = [0, eyeY, 120];
      const view = lookAt(eye, [0, eyeY - 10, -260], [0, 1, 0]);
      const proj = perspective(
        (55 * Math.PI) / 180,
        Math.max(w / Math.max(h, 1), 0.0001),
        0.5,
        3000,
      );
      const viewProj = multiply(proj, view);

      g.useProgram(pOcean);
      bind(dispTex, 0);
      bind(normalTex, 1);
      g.uniform1i(g.getUniformLocation(pOcean, "u_disp"), 0);
      g.uniform1i(g.getUniformLocation(pOcean, "u_normal"), 1);
      g.uniformMatrix4fv(
        g.getUniformLocation(pOcean, "u_viewProj"),
        false,
        viewProj,
      );
      g.uniform1f(g.getUniformLocation(pOcean, "u_patch"), L * TILES);
      g.uniform1f(g.getUniformLocation(pOcean, "u_tiles"), TILES);
      g.uniform3f(g.getUniformLocation(pOcean, "u_camera"), eye[0], eye[1], eye[2]);
      g.uniform1f(g.getUniformLocation(pOcean, "u_below"), below);
      g.uniform1f(g.getUniformLocation(pOcean, "u_darkness"), darkness);

      g.bindVertexArray(oceanVao);
      g.drawElements(g.TRIANGLES, indices.length, g.UNSIGNED_INT, 0);
      g.bindVertexArray(null);

      // Reduced motion gets exactly one frame: a still ocean, not a blank one.
      if (!reduced && !document.hidden) {
        raf = requestAnimationFrame(frame);
      } else if (!reduced) {
        raf = 0;
      }
    };

    return frame;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(Math.floor(canvas.clientWidth * dpr), 1);
    const h = Math.max(Math.floor(canvas.clientHeight * dpr), 1);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  let frame: ((now: number) => void) | null = null;
  let observer: ResizeObserver | null = null;

  const onVisibility = () => {
    if (disposed || reduced || !frame) return;
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (raf === 0) {
      raf = requestAnimationFrame(frame);
    }
  };

  const onContextLost = (e: Event) => {
    e.preventDefault();
    // Do not attempt to re-acquire: a lost context usually means the GPU is
    // under pressure, and a retry loop makes that worse.
    dispose();
  };

  const ready = new Promise<void>((resolve) => {
    try {
      resize();
      frame = init();

      observer = new ResizeObserver(resize);
      observer.observe(canvas);
      document.addEventListener("visibilitychange", onVisibility);
      canvas.addEventListener("webglcontextlost", onContextLost);

      raf = requestAnimationFrame(frame);
    } catch (err) {
      console.warn("FFT ocean disabled:", err);
      dispose();
    }
    resolve();
  });

  function dispose() {
    if (disposed) return;
    disposed = true;

    cancelAnimationFrame(raf);
    raf = 0;

    observer?.disconnect();
    observer = null;
    document.removeEventListener("visibilitychange", onVisibility);
    canvas.removeEventListener("webglcontextlost", onContextLost);

    for (const p of programs) g.deleteProgram(p);
    for (const t of textures) g.deleteTexture(t);
    for (const f of framebuffers) g.deleteFramebuffer(f);
    for (const b of buffers) g.deleteBuffer(b);
    for (const v of vaos) g.deleteVertexArray(v);

    programs.length = 0;
    textures.length = 0;
    framebuffers.length = 0;
    buffers.length = 0;
    vaos.length = 0;
  }

  return {
    ready,
    dispose,
    setDepth(next: number) {
      currentDepth = next;
      // Reduced motion runs no loop, so a depth change needs its own frame.
      if (reduced && !disposed && frame) {
        requestAnimationFrame(frame);
      }
    },
  };
}
