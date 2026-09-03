import { describe, it, expect, vi } from "vitest";
import { isOceanSupported } from "@/components/ui/fft-ocean-utils/gl";

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
