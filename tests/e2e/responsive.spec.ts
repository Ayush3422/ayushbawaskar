import { test, expect, type Page } from "@playwright/test";

/**
 * Nothing may push the document wider than the viewport.
 *
 * A page that scrolls sideways on a phone is the most common way a dense
 * layout breaks, and it is invisible on a desktop, so it is asserted rather
 * than looked for. 320px is included because that is where it last went wrong:
 * a grid item without min-w-0 and a spec value containing an unbreakable
 * github.com/... token each took the document eight pixels past the edge.
 *
 * Both ends of the page are checked. Overflow that only appears once the
 * reader has descended is still overflow.
 */

const WIDTHS = [320, 360, 375, 390, 430, 768, 1024, 1280];

const overflow = (page: Page) =>
  page.evaluate(() => {
    const doc = document.documentElement;
    return { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth };
  });

for (const width of WIDTHS) {
  test(`the page does not scroll sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    // The landing gate is fixed and full-viewport; wait it out so the
    // measurement is of the page itself.
    await page.waitForSelector("#landing", { state: "detached", timeout: 20_000 });
    await page.waitForTimeout(400);

    const atTop = await overflow(page);
    expect(atTop.scrollWidth, `overflow at ${width}px, at the top`).toBeLessThanOrEqual(
      atTop.clientWidth + 1,
    );

    await page.evaluate(() =>
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(700);

    const atFloor = await overflow(page);
    expect(
      atFloor.scrollWidth,
      `overflow at ${width}px, at the trench floor`,
    ).toBeLessThanOrEqual(atFloor.clientWidth + 1);
  });
}
