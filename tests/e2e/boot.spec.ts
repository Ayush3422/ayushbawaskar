import { test, expect } from "@playwright/test";

/**
 * The dive status band. It reports real initialisation, so the things worth
 * pinning are that it finishes, that it never claims to be finished early, and
 * above all that it never stands between a reader and the page — an earlier
 * pass covered the whole screen with it, which is the failure mode to guard.
 */

const band = (page: import("@playwright/test").Page) =>
  page.locator("[data-boot]");

test("the hero is readable while the band is still loading", async ({ page }) => {
  await page.goto("/");

  // No waiting, no settling: the headline must be there on arrival.
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("h1")).toContainText("Measured");
  await expect(page.locator('nav[aria-label="Dive plan"]')).toBeVisible();
});

test("the band covers nothing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const box = await band(page).boundingBox();
  expect(box).not.toBeNull();

  const heading = await page.locator("h1").boundingBox();
  expect(heading).not.toBeNull();

  // A full-screen overlay would sit on top of the headline. This asserts the
  // band is a band: it starts below the headline and is a fraction of the page.
  expect(box!.y).toBeGreaterThan(heading!.y + heading!.height);
  expect(box!.height).toBeLessThan(320);
});

test("it reaches a hundred and turns into the scroll cue", async ({ page }) => {
  await page.goto("/");

  await expect
    .poll(() => band(page).getAttribute("data-boot-settled"), { timeout: 15_000 })
    .toBe("true");

  const bar = page.getByRole("progressbar", { name: "Preparing the dive" });
  await expect(bar).toHaveAttribute("aria-valuenow", "100");
  await expect(band(page)).toContainText("Ready");
  await expect(band(page)).toContainText("Scroll to descend");
});

test("the caption never runs ahead of the bar", async ({ page }) => {
  await page.goto("/");

  // Sampled across the sweep: "Ready to dive" over a bar reading 14% was a real
  // bug, caused by reading the caption off the milestone count alone.
  for (let i = 0; i < 12; i++) {
    const state = await page.evaluate(() => {
      const el = document.querySelector("[data-boot]");
      if (!el) return null;
      const bar = el.querySelector('[role="progressbar"]');
      return {
        value: Number(bar?.getAttribute("aria-valuenow") ?? 0),
        text: el.textContent ?? "",
      };
    });
    if (!state) break;
    if (state.text.includes("Scroll to descend")) {
      expect(state.value).toBe(100);
    }
    await page.waitForTimeout(80);
  }
});

test("the band survives a page with no WebGL", async ({ page }) => {
  // With no ocean to build there is no spectrum to wait for, so the band has
  // to stop waiting rather than hang at three quarters for the abandon timeout.
  await page.addInitScript(() => {
    // Widened deliberately: getContext is a union of overloads that no single
    // patched signature satisfies, and this only needs to refuse one string.
    const proto = HTMLCanvasElement.prototype as unknown as {
      getContext: (type: string, ...rest: unknown[]) => unknown;
    };
    const original = proto.getContext;
    proto.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
      if (type === "webgl2") return null;
      return original.call(this, type, ...rest);
    };
  });
  await page.goto("/");

  await expect
    .poll(() => band(page).getAttribute("data-boot-settled"), { timeout: 8000 })
    .toBe("true");
});

test("reduced motion settles without animating", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  await expect
    .poll(() => page.locator("[data-boot]").getAttribute("data-boot-settled"), {
      timeout: 8000,
    })
    .toBe("true");
  await expect(page.locator("h1")).toBeVisible();

  await context.close();
});

test("the landing page does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect
    .poll(() => band(page).getAttribute("data-boot-settled"), { timeout: 15_000 })
    .toBe("true");

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});
