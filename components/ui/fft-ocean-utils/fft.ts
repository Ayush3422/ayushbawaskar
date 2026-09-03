export function bitReverse(index: number, bits: number): number {
  let r = 0;
  for (let i = 0; i < bits; i++) {
    r = (r << 1) | ((index >> i) & 1);
  }
  return r >>> 0;
}

/**
 * Cooley-Tukey butterfly indices and twiddle factors, laid out one texel per
 * (stage, element) so a fragment shader can read them directly.
 *
 * Layout per texel: [twiddleRe, twiddleIm, topIndex, bottomIndex]. A consumer
 * computes, uniformly for every element:
 *
 *     out[i] = data[topIndex] + twiddle * data[bottomIndex]
 *
 * The usual `a + w*b` / `a - w*b` split does not appear anywhere, because the
 * exponent below already produces -w for lower butterflies: an element in the
 * lower half of its group carries an extra N/2 in the exponent, and
 * exp(2*pi*i*(N/2)/N) is exactly -1. Negating the twiddle here as well would
 * cancel that out and silently produce a wrong transform — which is what the
 * reference-DFT test in tests/unit/fft.test.ts exists to catch.
 *
 * Stage 0 additionally encodes the bit-reversal permutation in its indices, so
 * a consumer never permutes its input separately.
 */
export function butterflyTable(N: number): Float32Array {
  const stages = Math.log2(N);
  if (!Number.isInteger(stages)) {
    throw new Error(`FFT size must be a power of two, got ${N}`);
  }

  const out = new Float32Array(stages * N * 4);

  for (let stage = 0; stage < stages; stage++) {
    const span = 1 << stage;
    const groupSize = span * 2;

    for (let i = 0; i < N; i++) {
      const k = (i * (N / groupSize)) % N;
      const angle = (2 * Math.PI * k) / N;

      const isTop = i % groupSize < span;
      const base = isTop ? i : i - span;

      const top = stage === 0 ? bitReverse(base, stages) : base;
      const bottom =
        stage === 0 ? bitReverse(base + span, stages) : base + span;

      const o = (stage * N + i) * 4;
      out[o] = Math.cos(angle);
      out[o + 1] = Math.sin(angle);
      out[o + 2] = top;
      out[o + 3] = bottom;
    }
  }

  return out;
}

/**
 * Inverse DFT driven by the same butterfly table the GPU uses, so a passing
 * test here means the table itself is correct — not merely that some FFT works.
 * Unnormalised, matching naiveIDFT; the 1/N is applied once in the resolve pass.
 */
export function ifft1D(
  re: Float32Array,
  im: Float32Array,
): { re: Float32Array; im: Float32Array } {
  const N = re.length;
  const stages = Math.log2(N);
  const table = butterflyTable(N);

  let curRe = Float32Array.from(re);
  let curIm = Float32Array.from(im);
  let nextRe = new Float32Array(N);
  let nextIm = new Float32Array(N);

  for (let stage = 0; stage < stages; stage++) {
    for (let i = 0; i < N; i++) {
      const o = (stage * N + i) * 4;
      const twRe = table[o];
      const twIm = table[o + 1];
      const top = table[o + 2];
      const bottom = table[o + 3];

      const aRe = curRe[top];
      const aIm = curIm[top];
      const bRe = curRe[bottom];
      const bIm = curIm[bottom];

      nextRe[i] = aRe + (twRe * bRe - twIm * bIm);
      nextIm[i] = aIm + (twRe * bIm + twIm * bRe);
    }

    [curRe, nextRe] = [nextRe, curRe];
    [curIm, nextIm] = [nextIm, curIm];
  }

  return { re: curRe, im: curIm };
}

/** Reference oracle. O(N^2) and only ever used by tests. */
export function naiveIDFT(
  re: Float32Array,
  im: Float32Array,
): { re: Float32Array; im: Float32Array } {
  const N = re.length;
  const outRe = new Float32Array(N);
  const outIm = new Float32Array(N);

  for (let n = 0; n < N; n++) {
    let sRe = 0;
    let sIm = 0;
    for (let k = 0; k < N; k++) {
      const a = (2 * Math.PI * k * n) / N;
      const c = Math.cos(a);
      const s = Math.sin(a);
      sRe += re[k] * c - im[k] * s;
      sIm += re[k] * s + im[k] * c;
    }
    outRe[n] = sRe;
    outIm[n] = sIm;
  }

  return { re: outRe, im: outIm };
}
