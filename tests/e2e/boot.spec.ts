import { test, expect, type Page } from "@playwright/test";

/**
 * The landing gate and the status band inside it.
 *
 * The gate covers the page while the dive is being prepared and stands down on
 * its own when the band reaches 100. The things worth pinning are that it
 * always stands down, that the site's own content never depended on it having
 * run, and that the band never claims to be finished before it is.
 */

const landing = (page: Page) => page.locator("#landing");
const band = (page: Page) => page.locator("[data-boot]");

const gateCleared = (page: Page) =>
  page.waitForSelector("#landing", { state: "detached", timeout: 20_000 });

test("the gate is up on arrival and covers the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const box = await landing(page).boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThanOrEqual(1440);
  expect(box!.height).toBeGreaterThanOrEqual(880);
});

test("the page behind the gate is already built, not waiting on it", async ({
  page,
}) => {
  await page.goto("/");

  // Present in the document from the first paint. Nothing about the site's
  // content is gated on the animation having finished.
  await expect(page.locator("h1")).toContainText("Measured");
  await expect(page.locator('nav[aria-label="Dive plan"]')).toHaveCount(1);
  expect(await page.locator("main section[id]").count()).toBeGreaterThan(5);
});

test("the band is a band inside the gate, not the gate itself", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const bandBox = await band(page).boundingBox();
  const wordmark = await page
    .locator("#landing p", { hasText: "ABYSS" })
    .first()
    .boundingBox();
  expect(bandBox).not.toBeNull();
  expect(wordmark).not.toBeNull();

  // Middle-bottom: below the title, in the lower half, and a fraction of the
  // screen rather than all of it.
  expect(bandBox!.y).toBeGreaterThan(wordmark!.y + wordmark!.height);
  expect(bandBox!.y).toBeGreaterThan(450);
  expect(bandBox!.height).toBeLessThan(320);
});

test("reaching a hundred stands the gate down and reveals the home page", async ({
  page,
}) => {
  await page.goto("/");
  await expect(landing(page)).toHaveCount(1);

  await gateCleared(page);

  await expect(page.locator("h1")).toBeInViewport();
  await expect(landing(page)).toHaveCount(0);
  // Handing over must not leave the reader part-way down the page.
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("the home page is interactive once the gate has gone", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await gateCleared(page);

  // A click that lands proves nothing invisible is left over the page.
  await page.locator('nav[aria-label="Depth zones"] a[href="#twilight"]').click();
  await expect.poll(() => page.url(), { timeout: 5000 }).toContain("#twilight");
});

test("the caption never runs ahead of the bar", async ({ page }) => {
  await page.goto("/");

  // Sampled across the sweep: "Ready to dive" over a bar reading 14% was a real
  // bug, caused by reading the caption off the milestone count alone.
  for (let i = 0; i < 14; i++) {
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
    await page.waitForTimeout(70);
  }
});

test("the gate stands down on a machine with no WebGL", async ({ page }) => {
  // With no ocean to build there is no spectrum to wait for, so the band has
  // to stop waiting rather than hold the gate shut until the abandon timeout.
  await page.addInitScript(() => {
    // Widened deliberately: getContext is a union of overloads that no single
    // patched signature satisfies, and this only needs to refuse one string.
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

  await gateCleared(page);
  await expect(page.locator("h1")).toBeInViewport();
});

test("reduced motion still reaches the page", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  await gateCleared(page);
  await expect(page.locator("h1")).toBeInViewport();

  await context.close();
});

test("the landing does not overflow on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(band(page)).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);

  await gateCleared(page);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
});
