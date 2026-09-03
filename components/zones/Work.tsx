"use client";

import { useMemo, useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { SonarScope } from "@/components/sonar/SonarScope";
import { ContactCard } from "@/components/sonar/ContactCard";
import { ContactSheet } from "@/components/sonar/ContactSheet";
import { Label, Panel } from "@/components/ui/primitives";

/** The broad bearing a project sits on, used for the filter bar. */
const sector = (domain: string) => domain.split(" / ")[0];

export function Work() {
  const [active, setActive] = useState<Project | null>(null);
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
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <SonarScope
          contacts={ranked}
          onSelect={setActive}
          activeSlug={active?.slug}
        />

        <Panel label="How this is ranked">
          <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
            Five builds, ordered by how much of the work survives questioning
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
              onSelect={setActive}
            />
          ))}
        </div>
      </div>

      <ContactSheet
        project={active}
        open={active !== null}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}
