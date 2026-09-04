import { test, expect, type Page } from "@playwright/test";

const repo = (name: string, over: Record<string, unknown> = {}) => ({
  name,
  description: `${name} description`,
  language: "Python",
  stargazers_count: 2,
  pushed_at: "2026-08-01T00:00:00Z",
  html_url: `https://github.com/Ayush3422/${name}`,
  fork: false,
  archived: false,
  ...over,
});

/** Stand in for the API so these tests never depend on the network. */
const stubManifest = (page: Page, body: unknown, status = 200) =>
  page.route("**/api/repos", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    }),
  );

const manifest = (repos: unknown[], over: Record<string, unknown> = {}) => ({
  repos: repos.map((r) => {
    const g = r as Record<string, unknown>;
    return {
      name: g.name,
      description: g.description,
      language: g.language,
      stars: g.stargazers_count,
      pushedAt: g.pushed_at,
      url: g.html_url,
      fork: g.fork,
      archived: g.archived,
    };
  }),
  total: repos.length,
  sources: repos.length,
  forks: 0,
  stars: repos.length * 2,
  languages: ["Python"],
  fetchedAt: "2026-09-04T12:00:00Z",
  ...over,
});

const ping = async (page: Page) => {
  const button = page.locator("[data-ping-github]");
  await button.scrollIntoViewIfNeeded();
  await button.click();
  return button;
};

test("the manifest is not fetched until the reader asks for it", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/repos", (route) => {
    calls += 1;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(manifest([repo("nostro")])),
    });
  });

  await page.goto("/");
  await page.locator("[data-ping-github]").scrollIntoViewIfNeeded();
  // Scrolling it into view is not asking for it.
  expect(calls).toBe(0);

  await ping(page);
  await expect(page.locator("[data-manifest-returns]")).toBeVisible();
  expect(calls).toBe(1);
});

test("returned repositories are listed and linked", async ({ page }) => {
  await stubManifest(page, manifest([repo("nostro"), repo("vortifi")]));
  await page.goto("/");
  await ping(page);

  const returns = page.locator("[data-manifest-returns]");
  await expect(returns).toBeVisible();

  const link = returns.locator('a[href="https://github.com/Ayush3422/nostro"]');
  await expect(link).toHaveAttribute("target", "_blank");
  // Opening in a new tab without this hands the opener to the new page.
  await expect(link).toHaveAttribute("rel", /noreferrer/);
});

test("a live count that disagrees with the page says so", async ({ page }) => {
  // The hero states 16. Ninety-nine is unambiguously a disagreement.
  await stubManifest(page, manifest([], { total: 99, sources: 99, stars: 0 }));
  await page.goto("/");
  await ping(page);

  const drift = page.locator("[data-manifest-drift]");
  await expect(drift).toContainText("16");
  await expect(drift).toContainText("99");
  await expect(drift).toContainText("The live number is the true one");
});

test("a matching count is reported as reconciled", async ({ page }) => {
  await stubManifest(page, manifest([], { total: 16, sources: 16, stars: 0 }));
  await page.goto("/");
  await ping(page);
  await expect(page.locator("[data-manifest-drift]")).toContainText("They agree");
});

test("a failed fetch says what went wrong and keeps the real link", async ({ page }) => {
  await stubManifest(page, { error: "GitHub rate limit reached. Try again shortly." }, 502);
  await page.goto("/");
  await ping(page);

  const error = page.locator("[data-manifest-error]");
  await expect(error).toContainText("rate limit");
  // A failure must not leave the reader without the thing they came for.
  await expect(error).toContainText("github.com/Ayush3422");
  await expect(page.locator("[data-manifest-returns]")).toHaveCount(0);
});

test("the button reports its state to assistive technology", async ({ page }) => {
  await stubManifest(page, manifest([repo("nostro")]));
  await page.goto("/");

  const button = await ping(page);
  await expect(button).toHaveAccessibleName(/ping/i);
  await expect(page.locator("[data-manifest-returns]")).toBeVisible();
  // The results land in a live region so the change is announced.
  await expect(
    page.locator('[aria-live="polite"] [data-manifest-returns]'),
  ).toBeVisible();
});

/*
 * The tests above stub the endpoint, which means they exercise the panel but
 * not the filtering — that runs on the server, behind the stub. This one talks
 * to the real route so the withholding rule is checked against the live
 * account, where a repository could appear at any time without anyone touching
 * this codebase.
 *
 * It skips rather than fails when GitHub cannot be reached, so an offline run
 * or a spent rate limit does not report a defect that is not there.
 */
test("the live endpoint never returns a withheld repository", async ({ page }) => {
  await page.goto("/");

  const body = await page.evaluate(async () => {
    const res = await fetch("/api/repos");
    return { ok: res.ok, data: await res.json() };
  });

  test.skip(!body.ok, `GitHub unreachable: ${body.data?.error ?? "unknown"}`);

  const names: string[] = body.data.repos.map((r: { name: string }) =>
    r.name.toLowerCase(),
  );
  for (const banned of ["dynamo", "kisan"]) {
    expect(names.some((n) => n.includes(banned))).toBe(false);
  }

  // The total is the account's, so it must still count what was held back.
  expect(body.data.total).toBe(body.data.repos.length + body.data.withheld);
});
