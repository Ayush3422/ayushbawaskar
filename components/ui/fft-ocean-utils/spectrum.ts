export const GRAVITY = 9.81;

export interface SpectrumOptions {
  windSpeed: number;
  windDirX: number;
  windDirZ: number;
  amplitude: number;
  /** Wavelengths below this are suppressed, in metres. */
  smallWave: number;
}

/**
 * Phillips spectrum: the energy the wind puts into each wave vector k.
 * Returns 0 at k = 0 rather than dividing by zero.
 */
export function phillips(kx: number, kz: number, o: SpectrumOptions): number {
  const kLen2 = kx * kx + kz * kz;
  if (kLen2 < 1e-12) return 0;

  const kLen = Math.sqrt(kLen2);

  // Largest wave the wind can sustain.
  const L = (o.windSpeed * o.windSpeed) / GRAVITY;

  const wLen = Math.hypot(o.windDirX, o.windDirZ) || 1;
  const wx = o.windDirX / wLen;
  const wz = o.windDirZ / wLen;

  // Waves travelling across the wind are damped.
  const dot = (kx / kLen) * wx + (kz / kLen) * wz;
  const directional = dot * dot;

  const p =
    (o.amplitude * Math.exp(-1 / (kLen2 * L * L)) * directional) /
    (kLen2 * kLen2);

  // Suppress detail finer than the grid can represent.
  return p * Math.exp(-kLen2 * o.smallWave * o.smallWave);
}

/** Box-Muller, so the surface is a proper Gaussian field, not uniform noise. */
function gaussianPair(): [number, number] {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const r = Math.sqrt(-2 * Math.log(u));
  return [r * Math.cos(2 * Math.PI * v), r * Math.sin(2 * Math.PI * v)];
}

/**
 * h0(k) and conj(h0(-k)) packed into one RGBA texture, computed once at init.
 * Time evolution on the GPU needs only these two, so this never re-runs.
 */
export function initialSpectrum(
  N: number,
  L: number,
  o: SpectrumOptions,
): Float32Array {
  const data = new Float32Array(N * N * 4);
  const half = N / 2;

  for (let z = 0; z < N; z++) {
    for (let x = 0; x < N; x++) {
      const kx = (2 * Math.PI * (x - half)) / L;
      const kz = (2 * Math.PI * (z - half)) / L;

      const [g1, g2] = gaussianPair();
      const [g3, g4] = gaussianPair();

      const s = Math.sqrt(phillips(kx, kz, o) / 2);
      const sConj = Math.sqrt(phillips(-kx, -kz, o) / 2);

      const i = (z * N + x) * 4;
      data[i] = g1 * s;
      data[i + 1] = g2 * s;
      data[i + 2] = g3 * sConj;
      data[i + 3] = -g4 * sConj;
    }
  }

  return data;
}
