import { test, expect } from "@playwright/test";

test("every contact is a real button, deepest first", async ({ page }) => {
  await page.goto("/");
  const contacts = page.locator("[data-contact]");
  await expect(contacts).toHaveCount(5);
  const names = await contacts.evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-contact")),
  );
  expect(names).toEqual([
    "nostro",
    "energy-forecasting",
    "booksense",
    "vortifi",
    "quantumchat",
  ]);
});

test("a contact opens its sheet from the keyboard", async ({ page }) => {
  await page.goto("/");
  const first = page.locator('[data-contact="nostro"]');
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("0.9937");
});

test("contact names carry domain and depth", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-contact="nostro"]')).toHaveAccessibleName(
    /NOSTRO.*Applied ML.*9,200/,
  );
});

test("the caveat is shown, not buried", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-contact="quantumchat"]').click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/simulated/i);
});
