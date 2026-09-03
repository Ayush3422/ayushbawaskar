"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { SonarScope } from "@/components/sonar/SonarScope";
import { ContactSheet } from "@/components/sonar/ContactSheet";
import { Chip, Label } from "@/components/ui/primitives";

/**
 * Scope and manifest are two views of one list and one selection. The scope
 * shows the shape of the work; the manifest carries the names, ranges and
 * headline numbers, so the section reads as a record rather than a diagram
 * floating in space.
 */
export function Work() {
  const [active, setActive] = useState<Project | null>(null);

  // Deepest first. This order is the ranking, and it is the tab order.
  const contacts = [...projects].sort((a, b) => b.range - a.range);

  return (
    <div className="space-y-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
        <SonarScope
          contacts={contacts}
          onSelect={setActive}
          activeSlug={active?.slug}
        />

        <div>
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <Label>Contact manifest</Label>
            <Label>{contacts.length} returns</Label>
          </div>

          <ol className="divide-y divide-border border-b border-border">
            {contacts.map((p, i) => (
              <li key={p.slug}>
                <button
                  type="button"
                  data-contact={p.slug}
                  onClick={() => setActive(p)}
                  aria-label={`${p.name}, ${p.domain}, range ${p.range.toLocaleString("en-US")} metres`}
                  className="group w-full py-4 text-left transition-colors hover:bg-card/40"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg tracking-wide transition-colors group-hover:text-[var(--signal)]">
                      {p.name}
                    </span>
                    <span className="ml-auto shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                      {p.range.toLocaleString("en-US")} m
                    </span>
                  </div>

                  <p className="mt-1 pl-7 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                    {p.domain} · bearing {p.bearing}°
                  </p>

                  <p className="mt-2 pl-7 font-serif text-base leading-snug text-foreground/75">
                    {p.summary}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5 pl-7">
                    {p.metrics.slice(0, 2).map((m) => (
                      <Chip key={m.label}>
                        {m.label} {m.value}
                      </Chip>
                    ))}
                    {p.caveat && (
                      <span
                        className="inline-block rounded border px-2 py-1 font-mono text-[11px]"
                        style={{
                          borderColor: "var(--signal)",
                          color: "var(--signal)",
                        }}
                      >
                        caveat stated
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ol>

          <p className="mt-4 font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
            Select a return for the full evaluation
          </p>
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
