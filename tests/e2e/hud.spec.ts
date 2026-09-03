import { test, expect } from "@playwright/test";

test("HUD is present and hidden from assistive technology", async ({ page }) => {
  await page.goto("/");
  const hud = page.getByTestId("dive-computer");
  await expect(hud).toHaveCount(1);
  await expect(hud).toHaveAttribute("aria-hidden", "true");
});

test("HUD depth increases as the page is scrolled", async ({ page }) => {
  await page.goto("/");
  const readout = page.getByTestId("hud-depth");
  const before = await readout.textContent();

  await page.mouse.wheel(0, 4000);

  // Polled rather than slept on. Smooth scrolling plus a rAF-driven readout
  // means a fixed wait races the animation, which made this flaky.
  await expect
    .poll(async () => readout.textContent(), { timeout: 5000 })
    .not.toBe(before);
});

test("the HUD never sits on top of page content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const hud = await page.getByTestId("dive-computer").boundingBox();
  expect(hud).not.toBeNull();

  // Walk the page and check the invariant at several scroll positions: the
  // reserved gutter means no content element may cross the HUD's left edge.
  const sections = ["surface", "sunlight", "twilight", "midnight", "abyssal", "hadal"];

  for (const id of sections) {
    await page.evaluate((sectionId) => {
      const s = document.getElementById(sectionId)!;
      window.scrollTo({ top: s.offsetTop + 200, behavior: "instant" });
    }, id);
    await page.waitForTimeout(250);

    const worst = await page.evaluate((hudLeft) => {
      let overflow = 0;
      let culprit = "";
      const nodes = document.querySelectorAll<HTMLElement>(
        "main p, main li, main dd, main dt, main h1, main h2, main h3, main a, main span",
      );
      for (const n of nodes) {
        const r = n.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        if (r.right > hudLeft && r.right - hudLeft > overflow) {
          overflow = r.right - hudLeft;
          culprit = n.tagName + ": " + (n.textContent || "").trim().slice(0, 40);
        }
      }
      return { overflow, culprit };
    }, hud!.x);

    expect(
      worst.overflow,
      `${id}: content crosses the HUD gutter by ${worst.overflow}px — ${worst.culprit}`,
    ).toBeLessThanOrEqual(0);
  }
});
