/**
 * The ocean needs WebGL2 *and* float render targets: the FFT ping-pongs
 * complex amplitudes through framebuffers, which an 8-bit target cannot hold.
 * Never throws — a browser that blocks canvas contexts should degrade, not
 * crash the page.
 */
export function isOceanSupported(canvas: HTMLCanvasElement): boolean {
  try {
    const gl = canvas.getContext("webgl2") as WebGL2RenderingContext | null;
    if (!gl) return false;
    return Boolean(gl.getExtension("EXT_color_buffer_float"));
  } catch {
    return false;
  }
}

export function compile(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader compile failed: ${log}`);
  }
  return sh;
}

export function link(
  gl: WebGL2RenderingContext,
  vsSrc: string,
  fsSrc: string,
): WebGLProgram {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(p);
    gl.deleteProgram(p);
    throw new Error(`Program link failed: ${log}`);
  }
  return p;
}

/** Square RGBA32F texture. NEAREST throughout: these hold data, not images. */
export function floatTexture(
  gl: WebGL2RenderingContext,
  size: number,
  data: Float32Array | null,
): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA32F,
    size,
    size,
    0,
    gl.RGBA,
    gl.FLOAT,
    data,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  return t;
}

/** Non-square float texture, for the (N x stages) butterfly table. */
export function butterflyTexture(
  gl: WebGL2RenderingContext,
  stages: number,
  n: number,
  data: Float32Array,
): WebGLTexture {
  const t = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA32F,
    n,
    stages,
    0,
    gl.RGBA,
    gl.FLOAT,
    data,
  );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export function framebufferFor(
  gl: WebGL2RenderingContext,
  ...textures: WebGLTexture[]
): WebGLFramebuffer {
  const fb = gl.createFramebuffer()!;
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  textures.forEach((tex, i) => {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0 + i,
      gl.TEXTURE_2D,
      tex,
      0,
    );
  });
  if (textures.length > 1) {
    gl.drawBuffers(textures.map((_, i) => gl.COLOR_ATTACHMENT0 + i));
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return fb;
}
