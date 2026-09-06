"use client";

import { useMemo, useState } from "react";
import { projects, projectCountWord } from "@/data/projects";
import { SonarScope } from "@/components/sonar/SonarScope";
import { ContactCard } from "@/components/sonar/ContactCard";
import { Label, Panel, PixelRule, Stamp } from "@/components/ui/primitives";

/** The broad bearing a project sits on, used for the filter bar. */
const sector = (domain: string) => domain.split(" / ")[0];

export function Work() {
  // The slug of the card currently turned over, if any.
  const [flipped, setFlipped] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  // Deepest first. This order is the ranking, and it is the tab order.
  const ranked = useMemo(
    () => [...projects].sort((a, b) => b.range - a.range),
    [],
  );

  const sectors = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of ranked) {
      const s = sector(p.domain);
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
    return [["All", ranked.length] as const, ...counts.entries()];
  }, [ranked]);

  const shown =
    filter === "All" ? ranked : ranked.filter((p) => sector(p.domain) === filter);

  return (
    <div className="space-y-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-stretch lg:gap-10">
        {/* The scope gets the same frame as the panel beside it — unframed it
            floated in its column while the right half was fully dressed. */}
        <div className="hard-shadow border-2 border-border bg-card/45 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Stamp>Contact scope</Stamp>
            <div className="flex-1">
              <PixelRule />
            </div>
          </div>

          <SonarScope
            contacts={ranked}
            onSelect={(p) => {
              // A blip turns its card over and brings it into view, so the
              // scope and the grid stay one selection rather than two.
              setFlipped(p.slug);
              document
                .querySelector(`[data-card="${p.slug}"]`)
                ?.scrollIntoView({ block: "center", behavior: "smooth" });
            }}
            activeSlug={flipped ?? undefined}
          />

          <dl className="mt-5 grid grid-cols-2 gap-y-4 border-t-2 border-border pt-4 sm:grid-cols-4">
            {[
              { l: "Sweep", v: "6.0 s" },
              { l: "Returns", v: String(ranked.length) },
              { l: "Max range", v: "11,034 m" },
              {
                l: "Selected",
                v: flipped
                  ? (ranked.find((p) => p.slug === flipped)?.name ?? "—")
                  : "—",
              },
            ].map((r) => (
              <div key={r.l}>
                <dt>
                  <Label>{r.l}</Label>
                </dt>
                <dd className="mt-1 truncate font-mono text-sm tabular-nums">
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <Panel label="How this is ranked">
          <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
            {projectCountWord} builds, ordered by how much of the work
            survives questioning
            rather than by how recent it is. Range is that ranking expressed as
            depth, on the same scale as the page you are descending — so a
            contact further out is one that took more to get right, not one that
            shipped last.
          </p>
          <p className="mt-4 font-mono text-sm leading-[1.85] text-muted-foreground">
            Bearing is the domain. Every figure on a card was produced by a
            script inside the repository it links to, and where a project has a
            limitation, the card says so on its face.
          </p>

          <dl className="mt-6 grid grid-cols-3 gap-4 border-t-2 border-border pt-4">
            <div>
              <dt>
                <Label>Deepest</Label>
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">9,200 m</dd>
            </div>
            <div>
              <dt>
                <Label>Domains</Label>
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">
                {sectors.length - 1}
              </dd>
            </div>
            <div>
              <dt>
                <Label>Caveats</Label>
              </dt>
              <dd className="mt-1 font-mono text-lg tabular-nums">
                {ranked.filter((p) => p.caveat).length}
              </dd>
            </div>
          </dl>

          {/* Legend for the scope: which blip is at which bearing. */}
          <div className="mt-6 border-t-2 border-border pt-4">
            <Label>Bearing key</Label>
            <ol className="mt-3 divide-y-2 divide-border border-y-2 border-border">
              {[...ranked]
                .sort((a, b) => a.bearing - b.bearing)
                .map((p) => (
                  <li
                    key={p.slug}
                    className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 py-2"
                  >
                    <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                      {String(p.bearing).padStart(3, "0")}°
                    </span>
                    <span className="truncate font-mono text-[12px]">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
                      {p.domain}
                    </span>
                  </li>
                ))}
            </ol>
          </div>
        </Panel>
      </div>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-2 border-b-2 border-border pb-4">
          {sectors.map(([name, count]) => {
            const on = filter === name;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setFilter(name)}
                aria-pressed={on}
                className="border-2 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
                style={
                  on
                    ? {
                        borderColor: "var(--signal)",
                        color: "var(--signal)",
                      }
                    : { borderColor: "var(--border)" }
                }
              >
                {name} · {count}
              </button>
            );
          })}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => (
            <ContactCard
              key={p.slug}
              project={p}
              index={ranked.indexOf(p)}
              flipped={flipped === p.slug}
              onToggle={(slug) => setFlipped(slug)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
