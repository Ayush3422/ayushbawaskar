import { test, expect } from "@playwright/test";
import { projects } from "@/data/projects";

test("every contact is a real button, deepest first", async ({ page }) => {
  await page.goto("/");
  const contacts = page.locator("[data-contact]");
  // Derived from the data rather than frozen here: this asserts the ordering
  // rule — every project, deepest range first — so adding a project cannot
  // pass by updating a literal list to match whatever the page happens to do.
  const expected = [...projects]
    .sort((a, b) => b.range - a.range)
    .map((p) => p.slug);

  await expect(contacts).toHaveCount(expected.length);
  const names = await contacts.evaluateAll((els) =>
    els.map((e) => e.getAttribute("data-contact")),
  );
  expect(names).toEqual(expected);
});

test("a contact turns over from the keyboard and shows its evaluation", async ({
  page,
}) => {
  await page.goto("/");
  const front = page.locator('[data-contact="nostro"]');
  await front.focus();
  await expect(front).toHaveAttribute("aria-expanded", "false");

  await page.keyboard.press("Enter");

  await expect(front).toHaveAttribute("aria-expanded", "true");
  const back = page.locator('[data-back="nostro"]');
  await expect(back).toContainText("0.9937");
  // The back carries the held-out/in-sample contrast the front has no room for.
  await expect(back).toContainText("in-sample");
});

test("the turned-over face is hidden from assistive technology until it faces the reader", async ({
  page,
}) => {
  await page.goto("/");
  const back = page.locator('[data-back="nostro"]');
  await expect(back).toHaveAttribute("aria-hidden", "true");

  await page.locator('[data-contact="nostro"]').click();
  await expect(back).toHaveAttribute("aria-hidden", "false");
});

test("contact names carry domain and depth", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-contact="nostro"]')).toHaveAccessibleName(
    /NOSTRO.*Applied ML.*9,200/,
  );
});

test("the caveat is shown on the card, not buried", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-contact="quantumchat"]').click();
  const back = page.locator('[data-back="quantumchat"]');
  await expect(back).toContainText(/simulated/i);
  await expect(back).toContainText(/what this does not claim/i);
});

test("turning one card over turns the previous one back", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-contact="nostro"]').click();
  await expect(page.locator('[data-contact="nostro"]')).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  await page.locator('[data-contact="vortifi"]').click();
  await expect(page.locator('[data-contact="nostro"]')).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.locator('[data-contact="vortifi"]')).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});
