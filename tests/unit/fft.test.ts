import { describe, it, expect } from "vitest";
import {
  bitReverse,
  butterflyTable,
  ifft1D,
  naiveIDFT,
} from "@/components/ui/fft-ocean-utils/fft";
import {
  phillips,
  initialSpectrum,
} from "@/components/ui/fft-ocean-utils/spectrum";

describe("bitReverse", () => {
  it("reverses bit patterns of the given width", () => {
    expect(bitReverse(0b000, 3)).toBe(0b000);
    expect(bitReverse(0b001, 3)).toBe(0b100);
    expect(bitReverse(0b011, 3)).toBe(0b110);
    expect(bitReverse(0b101, 3)).toBe(0b101);
  });
});

describe("butterflyTable", () => {
  it("has one texel per stage per element, four floats each", () => {
    expect(butterflyTable(8).length).toBe(3 * 8 * 4);
    expect(butterflyTable(16).length).toBe(4 * 16 * 4);
  });

  it("stores a bit-reversed permutation in the first stage", () => {
    const N = 8;
    const t = butterflyTable(N);

    // Both outputs of a butterfly read the same pair of inputs, so stage 0
    // holds N/2 distinct tops and N/2 distinct bottoms. Together they must
    // touch every input index exactly once — that is what makes it a
    // permutation rather than merely a shuffle.
    const tops = new Set<number>();
    const bottoms = new Set<number>();
    for (let i = 0; i < N; i++) {
      tops.add(t[i * 4 + 2]);
      bottoms.add(t[i * 4 + 3]);
    }

    expect(tops.size).toBe(N / 2);
    expect(bottoms.size).toBe(N / 2);
    expect([...tops, ...bottoms].sort((a, b) => a - b)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7,
    ]);
  });

  it("rejects sizes that are not a power of two", () => {
    expect(() => butterflyTable(12)).toThrow(/power of two/);
  });
});

const randomSignal = (N: number) => {
  const re = new Float32Array(N);
  const im = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    re[i] = Math.sin(i * 1.7) * 3 + Math.cos(i * 0.4);
    im[i] = Math.cos(i * 2.3) - Math.sin(i * 0.9) * 2;
  }
  return { re, im };
};

describe("ifft1D", () => {
  for (const N of [8, 16]) {
    it(`matches a reference inverse DFT at N=${N}`, () => {
      const { re, im } = randomSignal(N);
      const fast = ifft1D(re, im);
      const slow = naiveIDFT(re, im);
      for (let i = 0; i < N; i++) {
        expect(fast.re[i]).toBeCloseTo(slow.re[i], 3);
        expect(fast.im[i]).toBeCloseTo(slow.im[i], 3);
      }
    });
  }
});

describe("phillips", () => {
  const opts = {
    windSpeed: 14,
    windDirX: 1,
    windDirZ: 0,
    amplitude: 4e-7,
    smallWave: 1,
  };

  it("returns zero at k = 0 rather than dividing by zero", () => {
    expect(phillips(0, 0, opts)).toBe(0);
    expect(Number.isFinite(phillips(0, 0, opts))).toBe(true);
  });

  it("suppresses waves travelling across the wind", () => {
    const along = phillips(0.1, 0, opts);
    const across = phillips(0, 0.1, opts);
    expect(along).toBeGreaterThan(across);
  });

  it("is never negative", () => {
    for (let kx = -1; kx <= 1; kx += 0.25) {
      for (let kz = -1; kz <= 1; kz += 0.25) {
        expect(phillips(kx, kz, opts)).toBeGreaterThanOrEqual(0);
      }
    }
  });
});

describe("initialSpectrum", () => {
  it("produces four finite floats per texel", () => {
    const data = initialSpectrum(32, 512, {
      windSpeed: 14,
      windDirX: 1,
      windDirZ: 0,
      amplitude: 4e-7,
      smallWave: 1,
    });
    expect(data.length).toBe(32 * 32 * 4);
    for (const v of data) expect(Number.isFinite(v)).toBe(true);
  });
});
