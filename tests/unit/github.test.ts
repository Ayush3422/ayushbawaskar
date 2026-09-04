import { describe, it, expect } from "vitest";
import { parseRepos, summarise, sincePush } from "@/lib/github";

/** A trimmed repository object in the shape the GitHub API returns one. */
const repo = (over: Record<string, unknown> = {}) => ({
  name: "nostro",
  description: "Reconciliation engine",
  language: "Python",
  stargazers_count: 3,
  pushed_at: "2026-08-01T00:00:00Z",
  html_url: "https://github.com/Ayush3422/nostro",
  fork: false,
  archived: false,
  ...over,
});

describe("parseRepos", () => {
  it("reads the fields the manifest renders", () => {
    const [r] = parseRepos([repo()]);
    expect(r).toEqual({
      name: "nostro",
      description: "Reconciliation engine",
      language: "Python",
      stars: 3,
      pushedAt: "2026-08-01T00:00:00Z",
      url: "https://github.com/Ayush3422/nostro",
      fork: false,
      archived: false,
    });
  });

  it("orders by most recently pushed", () => {
    const names = parseRepos([
      repo({ name: "old", pushed_at: "2024-01-01T00:00:00Z" }),
      repo({ name: "new", pushed_at: "2026-09-01T00:00:00Z" }),
      repo({ name: "mid", pushed_at: "2025-05-01T00:00:00Z" }),
    ]).map((r) => r.name);
    expect(names).toEqual(["new", "mid", "old"]);
  });

  it("sorts repositories with no push date last, not first", () => {
    // An empty or missing date compares below every real one as a string, so
    // the naive sort would float undated repositories to the top of the list.
    const names = parseRepos([
      repo({ name: "undated", pushed_at: null }),
      repo({ name: "dated", pushed_at: "2020-01-01T00:00:00Z" }),
    ]).map((r) => r.name);
    expect(names).toEqual(["dated", "undated"]);
  });

  it("survives the fields GitHub leaves null", () => {
    const [r] = parseRepos([
      repo({ description: null, language: null, pushed_at: null }),
    ]);
    expect(r.description).toBeNull();
    expect(r.language).toBeNull();
    expect(r.pushedAt).toBeNull();
    expect(r.name).toBe("nostro");
  });

  it("drops entries with no usable name and keeps the rest", () => {
    const repos = parseRepos([repo(), { name: "" }, null, 7, repo({ name: "vortifi" })]);
    expect(repos.map((r) => r.name).sort()).toEqual(["nostro", "vortifi"]);
  });

  it("falls back to a constructed URL when html_url is missing", () => {
    const [r] = parseRepos([repo({ html_url: undefined })]);
    expect(r.url).toBe("https://github.com/Ayush3422/nostro");
  });

  it("returns nothing for an error payload rather than throwing", () => {
    // A rate-limited response is an object, not an array.
    expect(parseRepos({ message: "API rate limit exceeded" })).toEqual([]);
    expect(parseRepos(null)).toEqual([]);
  });
});

describe("summarise", () => {
  const at = "2026-09-04T12:00:00Z";

  it("counts forks separately from sources", () => {
    const m = summarise(
      parseRepos([repo({ name: "a" }), repo({ name: "b", fork: true })]),
      at,
    );
    expect(m).toMatchObject({ total: 2, sources: 1, forks: 1 });
  });

  it("totals stars across every repository", () => {
    const m = summarise(
      parseRepos([
        repo({ name: "a", stargazers_count: 3 }),
        repo({ name: "b", stargazers_count: 4 }),
      ]),
      at,
    );
    expect(m.stars).toBe(7);
  });

  it("orders languages by how many repositories use them", () => {
    const m = summarise(
      parseRepos([
        repo({ name: "a", language: "Python" }),
        repo({ name: "b", language: "Solidity" }),
        repo({ name: "c", language: "Python" }),
        repo({ name: "d", language: null }),
      ]),
      at,
    );
    expect(m.languages).toEqual(["Python", "Solidity"]);
  });
});

describe("sincePush", () => {
  const now = Date.parse("2026-09-04T12:00:00Z");

  it.each([
    ["2026-09-04T09:00:00Z", "today"],
    ["2026-09-03T09:00:00Z", "1 day ago"],
    ["2026-08-20T12:00:00Z", "15 days ago"],
    ["2026-06-04T12:00:00Z", "3 months ago"],
    ["2024-09-04T12:00:00Z", "2 years ago"],
  ])("reads %s as %s", (pushed, expected) => {
    expect(sincePush(pushed, now)).toBe(expected);
  });

  it("says unknown rather than NaN for a missing or unparseable date", () => {
    expect(sincePush(null, now)).toBe("unknown");
    expect(sincePush("not a date", now)).toBe("unknown");
  });
});

/*
 * The site is asked to keep certain repositories off the page. A live listing
 * is the one place that rule could be broken without anyone editing content,
 * because the data arrives from outside — so the filter is tested against the
 * real repository name rather than a placeholder.
 */
describe("withheld repositories", () => {
  const at = "2026-09-04T12:00:00Z";

  it("keeps an excluded repository out of the listing", () => {
    const m = summarise(
      parseRepos([
        repo({ name: "NOSTRO" }),
        repo({ name: "Dynamo---Fix-the-Broken-Terminal-Bench-Task" }),
      ]),
      at,
    );
    expect(m.repos.map((r) => r.name)).toEqual(["NOSTRO"]);
  });

  it("matches regardless of case, so a rename cannot re-admit one", () => {
    const m = summarise(parseRepos([repo({ name: "dynamo-benchmarks" })]), at);
    expect(m.repos).toEqual([]);
  });

  it("still counts what it withholds, and says how many", () => {
    // The count must stay GitHub's own, or the panel would be reporting a
    // trimmed total as if it were the account's real one.
    const m = summarise(
      parseRepos([repo({ name: "NOSTRO" }), repo({ name: "dynamo-task" })]),
      at,
    );
    expect(m.total).toBe(2);
    expect(m.withheld).toBe(1);
    expect(m.repos).toHaveLength(1);
  });

  it("reports nothing withheld when nothing is", () => {
    const m = summarise(parseRepos([repo({ name: "NOSTRO" })]), at);
    expect(m.withheld).toBe(0);
  });
});
