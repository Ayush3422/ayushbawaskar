import { test, expect } from "@playwright/test";

test("page content is readable with WebGL disabled", async ({ page }) => {
  await page.addInitScript(() => {
    // getContext is a heavily overloaded signature; stub it through a
    // structural cast rather than trying to satisfy every overload.
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (type: string, ...rest: unknown[]) => unknown;
    };
    const original = proto.getContext;
    proto.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...rest: unknown[]
    ) {
      if (type === "webgl2") return null;
      return original.call(this, type, ...rest);
    };
  });

  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("section#hadal")).toHaveCount(1);
});

test("ocean layer is hidden from assistive technology", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-ocean-layer]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
});
