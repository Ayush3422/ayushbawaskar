import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");

describe("graphite tokens", () => {
  it("defines every required token on :root", () => {
    for (const token of [
      "--background",
      "--card",
      "--border",
      "--foreground",
      "--muted-foreground",
      "--primary",
      "--signal",
    ]) {
      expect(css).toContain(token);
    }
  });

  it("defines the reserved signal colour as coral", () => {
    expect(css).toMatch(/--signal:\s*#e57373/);
  });

  it("declares no light-mode block", () => {
    expect(css).not.toContain("prefers-color-scheme: light");
  });
});
