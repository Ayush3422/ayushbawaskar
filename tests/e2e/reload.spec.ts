import { test, expect } from "@playwright/test";

/**
 * A reload restarts the descent. The browser would otherwise restore the old
 * scroll offset, and the in-page nav leaves a fragment on the URL that the
 * browser jumps to — so both paths are checked, along with the one case that
 * must keep working: a link someone was actually sent.
 */

const scrollY = (page: import("@playwright/test").Page) =>
  page.evaluate(() => window.scrollY);

/**
 * Wait until the page has stopped moving, then report where it stopped.
 *
 * Two equal samples are not enough: the nav scrolls smoothly, and immediately
 * after a click the animation has not started, so a naive stability check
 * returns the position the reader was at *before* the jump. This waits for
 * three consecutive identical reads, which no in-flight smooth scroll produces.
 */
async function settled(page: import("@playwright/test").Page): Promise<number> {
  let previous = Number.NaN;
  let identical = 0;
  let current = 0;

  await expect
    .poll(
      async () => {
        current = await scrollY(page);
        identical = current === previous ? identical + 1 : 0;
        previous = current;
        return identical;
      },
      { timeout: 15_000, intervals: [100] },
    )
    .toBeGreaterThanOrEqual(3);

  return current;
}

/** Click a zone in the top bar and wait for the page to arrive. */
async function goToZone(page: import("@playwright/test").Page, id: string) {
  await page.locator(`nav[aria-label="Depth zones"] a[href="#${id}"]`).click();
  // The fragment lands before the scroll finishes; waiting on it first means
  // the settle below cannot observe stillness from before the click.
  await expect.poll(() => page.url(), { timeout: 5000 }).toContain(`#${id}`);
  return settled(page);
}

test("reloading from deep in the page returns to the surface", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight * 0.6, behavior: "instant" }),
  );
  await page.waitForTimeout(400);
  expect(await scrollY(page)).toBeGreaterThan(1000);

  await page.reload();
  await page.waitForTimeout(600);

  expect(await scrollY(page)).toBe(0);
  // The landing gate is over the page on a fresh load; once it stands down the
  // hero must be what is on screen, not wherever the reader had scrolled to.
  await page.waitForSelector("#landing", { state: "detached", timeout: 20_000 });
  expect(await scrollY(page)).toBe(0);
  await expect(page.locator("h1")).toBeInViewport();
});

test("reloading after using the nav clears the fragment and returns to the surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  expect(await goToZone(page, "hadal")).toBeGreaterThan(1000);
  expect(page.url()).toContain("#hadal");

  await page.reload();
  await page.waitForTimeout(600);

  expect(await scrollY(page)).toBe(0);
  // The fragment has to go too, or the browser jumps straight back down.
  expect(page.url()).not.toContain("#");
});

test("the depth readout is back at the surface after a reload", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }),
  );
  await page.waitForTimeout(700);

  await page.reload();
  await page.waitForTimeout(900);

  await expect(page.getByTestId("hud-depth")).toHaveText("0");
});

test("a link someone was sent still lands where it points", async ({ page }) => {
  // Only reloads reset. A shared deep link is a fresh navigation and must not
  // be hijacked to the top, or the nav's own URLs become undistributable.
  await page.goto("/#hadal");
  await page.waitForTimeout(1200);

  expect(await scrollY(page)).toBeGreaterThan(1000);
  expect(page.url()).toContain("#hadal");
});

test("in-page history still works after turning off scroll restoration", async ({
  page,
}) => {
  // scrollRestoration is set to "manual" for every entry, which is what stops
  // a reload restoring. Back and forward between zones must still move, since
  // that is fragment navigation rather than restoration — worth asserting,
  // because turning restoration off is exactly the kind of change that would
  // quietly flatten it.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const atTwilight = await goToZone(page, "twilight");
  expect(atTwilight).toBeGreaterThan(500);

  const atHadal = await goToZone(page, "hadal");
  expect(atHadal).toBeGreaterThan(atTwilight);

  await page.goBack();
  await expect.poll(() => page.url(), { timeout: 5000 }).toContain("#twilight");
  expect(Math.abs((await settled(page)) - atTwilight)).toBeLessThan(200);
});
