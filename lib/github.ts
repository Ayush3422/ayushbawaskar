/**
 * The live repository manifest.
 *
 * Every other number on this site was copied from a README and frozen at the
 * moment it was written. This one is not: the reader can press a button and
 * have the page go and ask GitHub. That is the whole point of it — a claim you
 * can re-check is worth more than a claim you have to take on trust — so the
 * panel also reconciles what it fetches against the count written into the
 * hero, and says plainly when the two disagree.
 *
 * The parsing lives here rather than in the route handler so it can be tested
 * against real API shapes without a network.
 */

/** The account the manifest is drawn from. */
export const GITHUB_USER = "Ayush3422";

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  /** ISO 8601, or null when the API omits it. */
  pushedAt: string | null;
  url: string;
  fork: boolean;
  archived: boolean;
};

export type Manifest = {
  /** The repositories actually listed — `total` minus anything withheld. */
  repos: Repo[];
  /** Every repository, forks included — this is what GitHub calls public. */
  total: number;
  /**
   * How many public repositories exist but are not in `repos`. Surfaced so the
   * panel can say the list is partial instead of quietly appearing complete.
   */
  withheld: number;
  /** Repositories that started here rather than being forked in. */
  sources: number;
  forks: number;
  stars: number;
  /** Distinct primary languages, most-used first. */
  languages: string[];
  /** When the server actually spoke to GitHub, ISO 8601. */
  fetchedAt: string;
};

const asString = (v: unknown): string | null =>
  typeof v === "string" && v.trim() !== "" ? v : null;

const asCount = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;

/**
 * Turn the API's payload into the shape the panel renders.
 *
 * Deliberately total: GitHub omits fields on some repositories and a single
 * missing description should not blank the manifest, so anything unreadable
 * degrades to null rather than throwing. Entries without a usable name are
 * dropped, since there would be nothing to link to.
 */
export function parseRepos(payload: unknown): Repo[] {
  if (!Array.isArray(payload)) return [];

  const repos: Repo[] = [];
  for (const entry of payload) {
    if (typeof entry !== "object" || entry === null) continue;
    const r = entry as Record<string, unknown>;

    const name = asString(r.name);
    if (!name) continue;

    repos.push({
      name,
      description: asString(r.description),
      language: asString(r.language),
      stars: asCount(r.stargazers_count),
      pushedAt: asString(r.pushed_at),
      url: asString(r.html_url) ?? `https://github.com/${GITHUB_USER}/${name}`,
      fork: r.fork === true,
      archived: r.archived === true,
    });
  }

  // Most recently worked on first. Anything without a date sorts last rather
  // than to the top, which is where an empty string would otherwise put it.
  return repos.sort((a, b) => {
    if (a.pushedAt === b.pushedAt) return a.name.localeCompare(b.name);
    if (a.pushedAt === null) return 1;
    if (b.pushedAt === null) return -1;
    return a.pushedAt < b.pushedAt ? 1 : -1;
  });
}

/**
 * Repositories kept off the page by choice rather than by any property of the
 * data. Matched on the name, lower-cased, as a substring so a rename does not
 * silently re-admit one.
 *
 * The manifest still counts them — `total` is GitHub's number, not a trimmed
 * one — and reports how many it is holding back. A list that quietly dropped
 * entries while presenting itself as live would be exactly the kind of
 * unverifiable claim the rest of this site refuses to make.
 */
const WITHHELD = ["dynamo", "kisan"];

const isWithheld = (repo: Repo) => {
  const name = repo.name.toLowerCase();
  return WITHHELD.some((w) => name.includes(w));
};

/**
 * The header figures.
 *
 * Every aggregate here describes the whole account, withheld repositories
 * included, because those are GitHub's real numbers and the panel's job is to
 * report them. Only the listing itself is filtered.
 */
export function summarise(repos: Repo[], fetchedAt: string): Manifest {
  const byLanguage = new Map<string, number>();
  let stars = 0;
  let forks = 0;

  for (const r of repos) {
    stars += r.stars;
    if (r.fork) forks += 1;
    if (r.language) byLanguage.set(r.language, (byLanguage.get(r.language) ?? 0) + 1);
  }

  const languages = [...byLanguage.entries()]
    .sort((a, b) => (b[1] === a[1] ? a[0].localeCompare(b[0]) : b[1] - a[1]))
    .map(([name]) => name);

  const listed = repos.filter((r) => !isWithheld(r));

  return {
    repos: listed,
    total: repos.length,
    withheld: repos.length - listed.length,
    sources: repos.length - forks,
    forks,
    stars,
    languages,
    fetchedAt,
  };
}

/** "3 days ago" for the manifest rows. Null dates read as unknown. */
export function sincePush(pushedAt: string | null, now = Date.now()): string {
  if (!pushedAt) return "unknown";
  const then = Date.parse(pushedAt);
  if (Number.isNaN(then)) return "unknown";

  const days = Math.floor((now - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? "1 month ago" : `${months} months ago`;

  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}
