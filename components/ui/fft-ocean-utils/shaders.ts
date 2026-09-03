export const QUAD_VS = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

/**
 * h(k,t) from h0(k) and conj(h0(-k)), plus the two horizontal displacement
 * components. Written to three targets in one pass so the three transforms
 * that follow share a single dispatch.
 */
export const TIME_SPECTRUM_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
layout(location = 0) out vec4 o_height;
layout(location = 1) out vec4 o_choppyX;
layout(location = 2) out vec4 o_choppyZ;
uniform sampler2D u_h0;
uniform float u_time;
uniform float u_N;
uniform float u_L;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
  vec2 xz = v_uv * u_N;
  vec2 k = 6.28318530718 * (xz - u_N * 0.5) / u_L;
  float kLen = max(length(k), 1e-4);

  // Deep-water dispersion.
  float w = sqrt(9.81 * kLen);

  vec4 h0 = texture(u_h0, v_uv);
  vec2 a = h0.xy;
  vec2 b = vec2(h0.z, -h0.w);

  float c = cos(w * u_time);
  float s = sin(w * u_time);
  vec2 h = cmul(a, vec2(c, s)) + cmul(b, vec2(c, -s));

  o_height = vec4(h, 0.0, 0.0);

  // Horizontal displacement is i * (k/|k|) * h, one component per axis.
  vec2 ih = vec2(-h.y, h.x);
  vec2 kn = k / kLen;
  o_choppyX = vec4(ih * kn.x, 0.0, 0.0);
  o_choppyZ = vec4(ih * kn.y, 0.0, 0.0);
}`;

/** One butterfly stage. u_direction: 0 horizontal, 1 vertical. */
export const BUTTERFLY_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_butterfly;
uniform sampler2D u_src;
uniform float u_stage;
uniform float u_stages;
uniform float u_N;
uniform int u_direction;

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main() {
  vec2 px = v_uv * u_N;
  float idx = (u_direction == 0) ? px.x : px.y;

  vec4 bf = texture(u_butterfly, vec2(idx / u_N, (u_stage + 0.5) / u_stages));
  vec2 tw = bf.xy;

  vec2 topUV = (u_direction == 0)
    ? vec2((bf.z + 0.5) / u_N, v_uv.y)
    : vec2(v_uv.x, (bf.z + 0.5) / u_N);
  vec2 botUV = (u_direction == 0)
    ? vec2((bf.w + 0.5) / u_N, v_uv.y)
    : vec2(v_uv.x, (bf.w + 0.5) / u_N);

  vec2 a = texture(u_src, topUV).xy;
  vec2 b = texture(u_src, botUV).xy;

  // No a+wb / a-wb split: the table's twiddle already carries the sign.
  o_col = vec4(a + cmul(tw, b), 0.0, 0.0);
}`;

/** Undo the FFT's checkerboard sign and 1/N^2 scale into one displacement map. */
export const RESOLVE_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_height;
uniform sampler2D u_choppyX;
uniform sampler2D u_choppyZ;
uniform float u_N;
uniform float u_choppiness;

void main() {
  // The checkerboard sign undoes the fftshift: k is centred on N/2, so every
  // other output sample comes back negated.
  vec2 px = floor(v_uv * u_N);
  float sgn = mod(px.x + px.y, 2.0) == 0.0 ? 1.0 : -1.0;

  // No 1/N^2 here. The ocean height is h(x) = sum over k of h~(k) e^(ikx) —
  // an unnormalised inverse transform. Dividing by N^2, as a normalised IFFT
  // would, shrinks the surface by four orders of magnitude and yields water
  // that is mathematically correct and visually flat.
  float h = texture(u_height, v_uv).x * sgn;
  float dx = texture(u_choppyX, v_uv).x * sgn * u_choppiness;
  float dz = texture(u_choppyZ, v_uv).x * sgn * u_choppiness;

  o_col = vec4(dx, h, dz, 1.0);
}`;

/** Central-difference normals plus a Jacobian-based foam mask. */
export const NORMAL_FS = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 o_col;
uniform sampler2D u_disp;
uniform float u_N;
uniform float u_L;

void main() {
  float t = 1.0 / u_N;
  float scale = u_L / u_N;

  vec3 r = texture(u_disp, v_uv + vec2(t, 0.0)).xyz;
  vec3 l = texture(u_disp, v_uv - vec2(t, 0.0)).xyz;
  vec3 u = texture(u_disp, v_uv + vec2(0.0, t)).xyz;
  vec3 d = texture(u_disp, v_uv - vec2(0.0, t)).xyz;

  vec3 n = normalize(vec3(l.y - r.y, 2.0 * scale, d.y - u.y));

  // Where the horizontal displacement folds the surface onto itself, the
  // Jacobian goes negative. That is where real water breaks into foam.
  float jxx = (r.x - l.x) / (2.0 * scale);
  float jzz = (u.z - d.z) / (2.0 * scale);
  float jxz = (r.z - l.z) / (2.0 * scale);
  float jacobian = (1.0 + jxx) * (1.0 + jzz) - jxz * jxz;
  float foam = clamp(1.0 - jacobian, 0.0, 1.0);

  o_col = vec4(n, foam);
}`;

export const OCEAN_VS = `#version 300 es
in vec2 a_grid;
out vec3 v_world;
out vec2 v_uv;
out float v_foam;
uniform sampler2D u_disp;
uniform sampler2D u_normal;
uniform mat4 u_viewProj;
uniform float u_patch;
uniform float u_tiles;

void main() {
  // The wave field is one L-metre patch; the mesh spans u_patch = L * u_tiles.
  // Sampling past 1.0 repeats it (both maps wrap), which buys a horizon far
  // enough away that the mesh edge never enters frame.
  v_uv = a_grid * u_tiles;
  vec3 d = texture(u_disp, v_uv).xyz;
  vec3 world = vec3(
    (a_grid.x - 0.5) * u_patch + d.x,
    d.y,
    (a_grid.y - 0.5) * u_patch + d.z
  );
  v_world = world;
  v_foam = texture(u_normal, v_uv).w;
  gl_Position = u_viewProj * vec4(world, 1.0);
}`;

/**
 * Graphite water. Above the surface it is a dark specular sheet; below, the
 * normal is flipped and the specular highlight drops out, so you read it as
 * the underside of the swell. u_darkness closes it down to black with depth.
 */
export const OCEAN_FS = `#version 300 es
precision highp float;
in vec3 v_world;
in vec2 v_uv;
in float v_foam;
out vec4 o_col;
uniform sampler2D u_normal;
uniform vec3 u_camera;
uniform float u_below;
uniform float u_darkness;

// Graphite, but far enough above the #0a0a0a page ground to read as water.
// An earlier pass sat at 0.031/0.043/0.055 and was indistinguishable from the
// background — the simulation was running and simply could not be seen.
const vec3 DEEP    = vec3(0.055, 0.072, 0.088);
const vec3 SHALLOW = vec3(0.208, 0.247, 0.278);
const vec3 SUN     = vec3(0.93, 0.94, 0.96);
const vec3 FOG     = vec3(0.039, 0.039, 0.039);

void main() {
  vec3 n = normalize(texture(u_normal, v_uv).xyz);
  if (u_below > 0.5) n = -n;

  vec3 toCam = u_camera - v_world;
  float dist = length(toCam);
  vec3 view = toCam / max(dist, 1e-4);
  vec3 lightDir = normalize(vec3(0.4, 0.85, 0.3));

  float fresnel = pow(1.0 - max(dot(n, view), 0.0), 4.0);
  float diffuse = max(dot(n, lightDir), 0.0);
  float spec = pow(max(dot(reflect(-lightDir, n), view), 0.0), 90.0);

  vec3 water = mix(DEEP, SHALLOW, diffuse);
  water += SUN * spec * (1.0 - u_below);
  water = mix(water, vec3(0.34), fresnel * 0.4);
  water = mix(water, vec3(0.82), clamp(v_foam, 0.0, 1.0) * 0.5);

  water *= (1.0 - clamp(u_darkness, 0.0, 1.0));

  // Dissolve into the page ground with distance. This is what hides the far
  // edge of the mesh, so there is never a visible boundary to the ocean.
  float fog = 1.0 - exp(-dist * 0.0022);
  water = mix(water, FOG * (1.0 - clamp(u_darkness, 0.0, 1.0)), clamp(fog, 0.0, 1.0));

  o_col = vec4(water, 1.0);
}`;
