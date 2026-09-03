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
  await page.waitForTimeout(500);
  const after = await readout.textContent();
  expect(after).not.toBe(before);
});
