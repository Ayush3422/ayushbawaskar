"use client";

import { useState } from "react";
import { Label, PixelRule, Stamp } from "@/components/ui/primitives";
import { GitHubIcon } from "@/components/ui/icons";
import { headlineStats } from "@/data/profile";
import { GITHUB_USER, sincePush, type Manifest } from "@/lib/github";

/** The hand-written repository count in the hero, to reconcile against. */
const STATED = Number(
  headlineStats.find((s) => s.label === "Public repositories")?.value ?? 0,
);

type State =
  | { status: "idle" }
  | { status: "pinging" }
  | { status: "returned"; manifest: Manifest }
  | { status: "failed"; message: string };

/**
 * An active ping.
 *
 * The rest of the page is a passive instrument: it reports figures that were
 * true when they were written down. This is the one control that goes and
 * looks. It asks the server for the account's public repositories, prints what
 * came back, and — the part that matters — checks the live count against the
 * number written into the hero and says so either way. A site that claims its
 * figures are checkable should hand the reader the means to check one.
 */
export function RepoManifest() {
  const [state, setState] = useState<State>({ status: "idle" });

  const ping = async () => {
    setState({ status: "pinging" });
    try {
      const res = await fetch("/api/repos");
      const body = await res.json();
      if (!res.ok) {
        setState({
          status: "failed",
          message:
            typeof body?.error === "string" ? body.error : "GitHub did not answer.",
        });
        return;
      }
      setState({ status: "returned", manifest: body as Manifest });
    } catch {
      setState({ status: "failed", message: "No answer — check the connection." });
    }
  };

  const busy = state.status === "pinging";

  return (
    <section className="hard-shadow relative border-2 border-border bg-card/55 p-5 md:p-7">
      <header className="mb-5 flex flex-wrap items-center gap-3">
        <Stamp>Live manifest</Stamp>
        <div className="min-w-8 flex-1">
          <PixelRule />
        </div>
        <Label>github.com/{GITHUB_USER}</Label>
      </header>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="button"
          onClick={ping}
          disabled={busy}
          data-ping-github
          className="group flex items-center gap-3 border-2 border-[var(--signal)] px-4 py-3 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors hover:bg-[var(--signal)] hover:text-[#0a0a0a] disabled:cursor-wait disabled:opacity-60"
          style={{ color: "var(--signal)" }}
        >
          <GitHubIcon className="h-4 w-4" />
          {busy ? "Pinging…" : state.status === "idle" ? "Ping GitHub" : "Ping again"}
        </button>

        <p className="max-w-md font-mono text-[13px] leading-[1.8] text-muted-foreground">
          {state.status === "idle"
            ? `The hero states ${STATED} public repositories. That was counted by hand — press to make the page go and ask.`
            : busy
              ? "Asking api.github.com…"
              : null}
        </p>
      </div>

      {/*
       * Polite rather than assertive: the reader pressed the button, so they
       * are already looking here, and an assertive region would interrupt
       * whatever they were reading to say so.
       */}
      <div aria-live="polite" aria-busy={busy}>
        {state.status === "failed" && (
          <p
            data-manifest-error
            className="mt-6 border-2 border-[var(--signal)] p-4 font-mono text-[13px] leading-[1.8]"
            style={{ color: "var(--signal)" }}
          >
            {state.message} The repositories are still at github.com/{GITHUB_USER} —
            this button is a convenience, not the source.
          </p>
        )}

        {state.status === "returned" && <Returns manifest={state.manifest} />}
      </div>
    </section>
  );
}

function Returns({ manifest }: { manifest: Manifest }) {
  const { repos, total, withheld, sources, forks, stars, languages, fetchedAt } =
    manifest;
  const drift = total - STATED;

  return (
    <div data-manifest-returns className="mt-6">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-y-2 border-border py-4 sm:grid-cols-4">
        {[
          { v: String(total), l: "Public repositories" },
          { v: String(sources), l: "Not forked" },
          { v: String(stars), l: "Stars" },
          { v: String(languages.length), l: "Languages" },
        ].map((s) => (
          <div key={s.l}>
            <dd className="font-mono text-xl tabular-nums">{s.v}</dd>
            <dt className="mt-1">
              <Label>{s.l}</Label>
            </dt>
          </div>
        ))}
      </dl>

      {/*
       * The reconciliation. This is the reason the panel is here — an
       * unverified number that quietly corrects itself would be worth nothing.
       */}
      <p
        data-manifest-drift
        className="mt-4 font-mono text-[13px] leading-[1.8]"
        style={{ color: drift === 0 ? undefined : "var(--signal)" }}
      >
        {drift === 0
          ? `Reconciled: the hero states ${STATED} and GitHub reports ${total}. They agree.`
          : `The hero states ${STATED}; GitHub now reports ${total} — ${Math.abs(drift)} ${
              drift > 0 ? "more" : "fewer"
            } than when that line was written. The live number is the true one.`}
        {forks > 0 && ` ${forks} of them ${forks === 1 ? "is a fork" : "are forks"}.`}
      </p>

      {/* Said out loud. A live list that silently omitted entries would be
          worse than no live list. */}
      {withheld > 0 && (
        <p
          data-manifest-withheld
          className="mt-2 font-mono text-[13px] leading-[1.8] text-muted-foreground"
        >
          {withheld === 1
            ? "1 repository is counted above but kept off this list by choice."
            : `${withheld} repositories are counted above but kept off this list by choice.`}{" "}
          All of them are visible on the GitHub profile.
        </p>
      )}

      <ul className="mt-6 max-h-[26rem] divide-y-2 divide-border overflow-y-auto border-y-2 border-border">
        {repos.map((r) => (
          <li key={r.name}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 gap-y-1 px-1 py-3 transition-colors hover:bg-card/70"
            >
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-base transition-colors group-hover:text-[var(--signal)]">
                  {r.name}
                </span>
                {r.fork && <Label>fork</Label>}
                {r.archived && <Label>archived</Label>}
              </span>

              <span className="flex items-baseline gap-4 font-mono text-[11px] text-muted-foreground tabular-nums">
                {r.language && <span>{r.language}</span>}
                {r.stars > 0 && <span>★ {r.stars}</span>}
                <span>{sincePush(r.pushedAt)}</span>
              </span>

              {r.description && (
                <span className="col-span-2 max-w-2xl font-mono text-[12px] leading-[1.7] text-muted-foreground">
                  {r.description}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        Fetched {new Date(fetchedAt).toISOString().replace("T", " ").slice(0, 16)} UTC
        · cached one hour
      </p>
    </div>
  );
}
