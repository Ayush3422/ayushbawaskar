import { test, expect } from "@playwright/test";

const ZONE_IDS = [
  "surface",
  "sunlight",
  "twilight",
  "midnight",
  "abyssal",
  "hadal",
];

test("renders every zone as a landmark section", async ({ page }) => {
  await page.goto("/");
  for (const id of ZONE_IDS) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1);
  }
});

test("exposes a skip link as the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveAttribute("href", "#main");
});

test("logs no console errors on load", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});
