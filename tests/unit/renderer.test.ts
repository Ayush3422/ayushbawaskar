import { describe, it, expect, vi } from "vitest";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { colophon } from "@/data/profile";

const canvasWith = (ctx: unknown) =>
  ({ getContext: vi.fn(() => ctx) }) as unknown as HTMLCanvasElement;

describe("isOceanSupported", () => {
  it("is false when WebGL2 is unavailable", () => {
    expect(isOceanSupported(canvasWith(null))).toBe(false);
  });

  it("is false when float render targets are unavailable", () => {
    expect(isOceanSupported(canvasWith({ getExtension: () => null }))).toBe(
      false,
    );
  });

  it("is true when WebGL2 and float render targets are both present", () => {
    expect(isOceanSupported(canvasWith({ getExtension: () => ({}) }))).toBe(
      true,
    );
  });

  it("reports false rather than throwing when getContext throws", () => {
    const canvas = {
      getContext: () => {
        throw new Error("context creation blocked");
      },
    } as unknown as HTMLCanvasElement;
    expect(isOceanSupported(canvas)).toBe(false);
  });
});

/*
 * The colophon states the ocean's resolution and pass count as fact. When the
 * FFT was reduced from 256 to 128 for frame budget those two lines were left
 * behind, and the site shipped claiming a grid it did not run — on a page whose
 * stated rule is that every figure is checkable. The renderer is the source of
 * truth; this reads the constants out of it and holds the copy to them.
 */
describe("the colophon describes the ocean that actually runs", () => {
  const source = readFileSync(
    join(process.cwd(), "components/ui/fft-ocean-utils/renderer.ts"),
    "utf8",
  );
  const N = Number(/^const N = (\d+);$/m.exec(source)![1]);

  it("quotes the grid the renderer is built at", () => {
    const line = colophon.find((c) => c.label === "Ocean")!.value;
    expect(line).toContain(`${N}² grid`);
  });

  it("quotes the butterfly passes the frame actually issues", () => {
    // log2(N) stages, run over both directions, for height and the two
    // horizontal displacement components.
    const passes = Math.log2(N) * 2 * 3;
    const line = colophon.find((c) => c.label === "Passes")!.value;
    expect(line).toContain(`${passes} butterfly ping-pongs`);
  });
});
