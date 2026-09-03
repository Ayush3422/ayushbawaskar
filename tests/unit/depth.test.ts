import { describe, it, expect } from "vitest";
import {
  MAX_DEPTH,
  ZONES,
  depthToZone,
  depthToPressure,
  progressToDepth,
  depthToVeil,
  depthToSnowDensity,
  zoneProgressToDepth,
} from "@/lib/depth";

describe("MAX_DEPTH", () => {
  it("is the Challenger Deep", () => {
    expect(MAX_DEPTH).toBe(11034);
  });
});

describe("ZONES", () => {
  it("covers 0 to MAX_DEPTH with no gap or overlap", () => {
    expect(ZONES[0].min).toBe(0);
    expect(ZONES[ZONES.length - 1].max).toBe(MAX_DEPTH);
    for (let i = 1; i < ZONES.length; i++) {
      expect(ZONES[i].min).toBe(ZONES[i - 1].max);
    }
  });
});

describe("depthToZone", () => {
  it("maps interior depths to the right zone", () => {
    expect(depthToZone(0).id).toBe("surface");
    expect(depthToZone(20).id).toBe("surface");
    expect(depthToZone(120).id).toBe("sunlight");
    expect(depthToZone(600).id).toBe("twilight");
    expect(depthToZone(2500).id).toBe("midnight");
    expect(depthToZone(5000).id).toBe("abyssal");
    expect(depthToZone(9000).id).toBe("hadal");
  });

  it("assigns a boundary depth to the deeper zone", () => {
    expect(depthToZone(40).id).toBe("sunlight");
    expect(depthToZone(200).id).toBe("twilight");
    expect(depthToZone(1000).id).toBe("midnight");
    expect(depthToZone(4000).id).toBe("abyssal");
    expect(depthToZone(6000).id).toBe("hadal");
  });

  it("clamps out-of-range input rather than returning undefined", () => {
    expect(depthToZone(-500).id).toBe("surface");
    expect(depthToZone(MAX_DEPTH).id).toBe("hadal");
    expect(depthToZone(99999).id).toBe("hadal");
  });
});

describe("depthToPressure", () => {
  it("is 1 bar at the surface and adds a bar per 10 m", () => {
    expect(depthToPressure(0)).toBe(1);
    expect(depthToPressure(10)).toBeCloseTo(2);
    expect(depthToPressure(1000)).toBeCloseTo(101);
  });
});

describe("progressToDepth", () => {
  it("maps clamped scroll progress onto the depth range", () => {
    expect(progressToDepth(0)).toBe(0);
    expect(progressToDepth(0.5)).toBeCloseTo(MAX_DEPTH / 2);
    expect(progressToDepth(1)).toBe(MAX_DEPTH);
    expect(progressToDepth(-1)).toBe(0);
    expect(progressToDepth(2)).toBe(MAX_DEPTH);
  });
});

describe("depthToVeil", () => {
  it("runs from clear at the surface to its cap in the hadal zone", () => {
    expect(depthToVeil(0)).toBe(0);
    expect(depthToVeil(MAX_DEPTH)).toBeCloseTo(0.46);
  });

  it("never darkens far enough to hide the ocean behind it", () => {
    expect(depthToVeil(MAX_DEPTH)).toBeLessThan(0.6);
  });

  it("increases monotonically", () => {
    let prev = -1;
    for (let d = 0; d <= MAX_DEPTH; d += 500) {
      const v = depthToVeil(d);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });
});

describe("depthToSnowDensity", () => {
  it("peaks in the twilight zone and thins above and below", () => {
    const twilight = depthToSnowDensity(600);
    expect(twilight).toBeGreaterThan(depthToSnowDensity(0));
    expect(twilight).toBeGreaterThan(depthToSnowDensity(9000));
  });

  it("never leaves the 0..1 range", () => {
    for (let d = 0; d <= MAX_DEPTH; d += 250) {
      const v = depthToSnowDensity(d);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
});

describe("zoneProgressToDepth", () => {
  it("spans exactly the zone it names", () => {
    expect(zoneProgressToDepth("twilight", 0)).toBe(200);
    expect(zoneProgressToDepth("twilight", 1)).toBe(1000);
    expect(zoneProgressToDepth("twilight", 0.5)).toBeCloseTo(600);
  });

  it("reaches the deepest point at the end of the hadal zone", () => {
    expect(zoneProgressToDepth("hadal", 1)).toBe(MAX_DEPTH);
  });

  it("keeps every zone's depth inside that zone, which is the whole point", () => {
    for (const z of ZONES) {
      for (const t of [0, 0.25, 0.5, 0.75, 1]) {
        const d = zoneProgressToDepth(z.id, t);
        expect(d).toBeGreaterThanOrEqual(z.min);
        expect(d).toBeLessThanOrEqual(z.max);
        if (t < 1) expect(depthToZone(d).id).toBe(z.id);
      }
    }
  });

  it("clamps progress outside 0..1", () => {
    expect(zoneProgressToDepth("abyssal", -3)).toBe(4000);
    expect(zoneProgressToDepth("abyssal", 9)).toBe(6000);
  });
});
