import { test, expect } from "@playwright/test";

test("reduced motion does not break the page", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("[data-contact]")).toHaveCount(5);
  expect(errors).toEqual([]);

  await context.close();
});

test("decorative layers are hidden from assistive technology", async ({
  page,
}) => {
  await page.goto("/");
  for (const sel of [
    "[data-ocean-layer]",
    "[data-marine-snow]",
    "[data-testid=dive-computer]",
  ]) {
    await expect(page.locator(sel)).toHaveAttribute("aria-hidden", "true");
  }
});

test("every section heading is reachable in document order", async ({
  page,
}) => {
  await page.goto("/");
  const headings = await page.locator("section > header h2").allTextContents();
  expect(headings).toEqual([
    "Surface",
    "Sunlight",
    "Twilight",
    "Midnight",
    "Abyssal",
    "Hadal",
  ]);
});

test("the page has exactly one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
});
