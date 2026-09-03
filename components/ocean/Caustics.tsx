"use client";

import { useEffect, useRef } from "react";
import { link } from "@/components/ui/fft-ocean-utils/gl";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/**
 * Caustics: the bright web of light the sun draws on a seabed when it refracts
 * through moving water.
 *
 * Driven by the same deep-water dispersion the ocean uses — omega = sqrt(g*k),
 * so each layer travels at the speed its wavelength actually would — but
 * computed here rather than sampled from the FFT. WebGL cannot share textures
 * across canvases, and this layer has to sit ABOVE the page content while the
 * ocean sits below it, so they cannot be the same canvas. Same physics, second
 * evaluation.
 */
const FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform float u_time;
uniform vec2 u_res;

const float G = 9.81;

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void main() {
  vec2 p = v_uv * vec2(u_res.x / u_res.y, 1.0) * 7.5;

  float sum = 0.0;
  for (int i = 0; i < 7; i++) {
    float fi = float(i);
    // Wavenumber per layer, and the frequency deep water gives it.
    float k = 1.0 + fi * 0.85;
    float w = sqrt(G * k) * 0.16;
    vec2 d = rot(fi * 1.17) * vec2(1.0, 0.35);
    sum += sin(dot(p, d) * k + u_time * w);
    sum += 0.6 * sin(dot(p.yx, d) * k * 1.31 - u_time * w * 0.87);
  }

  // Sharpen the interference into filaments rather than soft blobs.
  float c = pow(clamp(sum * 0.11 + 0.5, 0.0, 1.0), 11.0);

  // Fade at the frame edges so the layer has no visible boundary.
  vec2 e = smoothstep(0.0, 0.22, v_uv) * smoothstep(0.0, 0.22, 1.0 - v_uv);
  c *= e.x * e.y;

  o_col = vec4(vec3(0.62, 0.86, 0.92) * c, c);
}`;

export function Caustics() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
    }) as WebGL2RenderingContext | null;
    if (!gl) return;

    let raf = 0;
    let disposed = false;
    let program: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let vao: WebGLVertexArrayObject | null = null;

    try {
      program = link(gl, VS, FS);
    } catch (err) {
      console.warn("Caustics disabled:", err);
      return;
    }

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);

    // Slightly under native: caustic filaments need enough resolution to stay
    // filaments, but nobody counts their pixels.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.8;
      canvas.width = Math.max(Math.floor(window.innerWidth * dpr), 1);
      canvas.height = Math.max(Math.floor(window.innerHeight * dpr), 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_res");
    const start = performance.now();

    const frame = (now: number) => {
      if (disposed) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (program) gl.deleteProgram(program);
      if (buf) gl.deleteBuffer(buf);
      if (vao) gl.deleteVertexArray(vao);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      data-caustics
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        // Only near the surface. Caustics need sunlight; at depth there is
        // none, which is also when the lamp takes over.
        opacity: "calc(var(--surface-scrim) * 0.38)",
        mixBlendMode: "screen",
      }}
    />
  );
}
