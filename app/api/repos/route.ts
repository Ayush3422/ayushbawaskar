import { GITHUB_USER, parseRepos, summarise } from "@/lib/github";

/**
 * The manifest endpoint.
 *
 * Fetched here rather than from the browser for two reasons. GitHub's
 * unauthenticated limit is 60 requests an hour *per IP*, so a client-side call
 * spends the reader's own allowance and fails for anyone behind a shared
 * address; and the response is cached for an hour on this side, so a hundred
 * readers pressing the button cost one request rather than a hundred.
 *
 * A token is used when GITHUB_TOKEN is present — it raises the limit to 5,000
 * an hour — but nothing here requires one. The endpoint reads only public data
 * and works unauthenticated, which is what it does in practice.
 */

/*
 * The handler itself runs on every request; the GitHub call inside it is what
 * is cached, for one hour — long enough to be cheap, short enough to feel live.
 *
 * The reverse (prerendering this route) was the first thing tried, and it has
 * a trap: if GitHub happens to be rate-limited during a deploy, the failure is
 * baked into the static response and every reader sees it for the next hour.
 * Running per request costs nothing measurable and cannot freeze an error.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          // GitHub asks for an identifying agent and rejects requests without
          // one.
          "User-Agent": "abyss-portfolio",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      // The rate limit is the one failure a reader is likely to see, and it is
      // worth naming rather than reporting as a generic fault.
      const limited =
        (res.status === 403 || res.status === 429) &&
        res.headers.get("x-ratelimit-remaining") === "0";

      return Response.json(
        {
          error: limited
            ? "GitHub rate limit reached. Try again shortly."
            : `GitHub returned ${res.status}.`,
        },
        // The endpoint itself worked; GitHub is what did not. 502 says that,
        // and keeps a rate limit from being cached as a success.
        { status: 502 },
      );
    }

    const manifest = summarise(
      parseRepos(await res.json()),
      new Date().toISOString(),
    );

    return Response.json(manifest);
  } catch {
    return Response.json({ error: "Could not reach GitHub." }, { status: 502 });
  }
}
