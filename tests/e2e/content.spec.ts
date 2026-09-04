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
  // The address appears twice on purpose: once at size in the reach-me panel
  // and once as an icon in the sign-off, so this must be scoped.
  const mailto = page.locator('a[href="mailto:ayushbawaskar4@gmail.com"]');
  await expect(mailto).toHaveCount(2);
  await expect(mailto.first()).toBeVisible();
});

test("the sign-off contact icons keep their names", async ({ page }) => {
  await page.goto("/");
  // Icon-only links are invisible to a screen reader without a label.
  for (const [label, href] of [
    ["Email", "mailto:ayushbawaskar4@gmail.com"],
    ["GitHub", "https://github.com/Ayush3422"],
    ["LinkedIn", "https://www.linkedin.com/in/ayush-bawaskar-254322340/"],
  ] as const) {
    const link = page.locator(`a[href="${href}"][aria-label]`);
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAccessibleName(new RegExp(label));
    await expect(link.locator("svg")).toHaveCount(1);
  }
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
