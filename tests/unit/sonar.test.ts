import { describe, it, expect } from "vitest";
import { contactToXY } from "@/lib/sonar";
import { MAX_DEPTH } from "@/lib/depth";

describe("contactToXY", () => {
  it("puts bearing 0 straight up", () => {
    const { x, y } = contactToXY(0, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-100);
  });

  it("puts bearing 90 to the right", () => {
    const { x, y } = contactToXY(90, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });

  it("puts bearing 180 straight down", () => {
    const { x, y } = contactToXY(180, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(100);
  });

  it("puts bearing 270 to the left", () => {
    const { x, y } = contactToXY(270, MAX_DEPTH, 100);
    expect(x).toBeCloseTo(-100);
    expect(y).toBeCloseTo(0);
  });

  it("scales radius linearly with range", () => {
    const half = contactToXY(90, MAX_DEPTH / 2, 100);
    expect(half.x).toBeCloseTo(50);
  });

  it("clamps range beyond the deepest point to the outer ring", () => {
    const beyond = contactToXY(90, MAX_DEPTH * 3, 100);
    expect(beyond.x).toBeCloseTo(100);
  });

  it("places the origin at zero range", () => {
    const { x, y } = contactToXY(217, 0, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });
});
