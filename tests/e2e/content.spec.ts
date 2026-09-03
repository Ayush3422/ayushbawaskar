import { test, expect } from "@playwright/test";

test("skills cite the project that evidences them", async ({ page }) => {
  await page.goto("/");
  const python = page.locator('[data-skill="Python"]');
  await expect(python).toContainText("NOSTRO");
  await expect(python).toContainText("9,200");
});

test("no self-assigned percentage scores appear", async ({ page }) => {
  await page.goto("/");
  const sounding = page.getByTestId("capability-sounding");
  await expect(sounding).not.toContainText("%");
});

test("contact details are present and linked", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: /ayushbawaskar4@gmail\.com/ }),
  ).toHaveAttribute("href", "mailto:ayushbawaskar4@gmail.com");
});

test("excluded claims never appear", async ({ page }) => {
  await page.goto("/");
  const body = (await page.locator("body").textContent())!.toLowerCase();
  for (const banned of [
    "dean's list",
    "research publication",
    "professional ml engineer",
    "dynamo",
    "kisan",
  ]) {
    expect(body).not.toContain(banned);
  }
});

test("the career log is in chronological order", async ({ page }) => {
  await page.goto("/");
  const entries = await page
    .locator("[data-timeline-entry]")
    .evaluateAll((els) => els.map((e) => e.getAttribute("data-timeline-entry")));
  expect(entries[0]).toContain("Aug 2024");
  expect(entries[entries.length - 1]).toContain("Sep 2026");
});
