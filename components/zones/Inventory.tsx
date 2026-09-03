"use client";

import { useMemo, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { skillGroups, type InventoryItem } from "@/data/skills";
import { projects } from "@/data/projects";
import { Label, PixelRule, Stamp } from "@/components/ui/primitives";

/** This site is evidence too, but it is not in projects.ts. */
const ABYSS = { name: "This site", range: 600, repoUrl: undefined as string | undefined };

interface Resolved {
  label: string;
  depth: number;
  repoUrl?: string;
}

function resolve(slug?: string): Resolved | null {
  if (!slug) return null;
  if (slug === "abyss") return { label: ABYSS.name, depth: ABYSS.range };
  const p = projects.find((x) => x.slug === slug);
  return p ? { label: p.name, depth: p.range, repoUrl: p.repoUrl } : null;
}

export function Inventory() {
  const [active, setActive] = useState<InventoryItem | null>(null);

  const { total, backed } = useMemo(() => {
    const all = skillGroups.flatMap((g) => g.items);
    return { total: all.length, backed: all.filter((i) => i.evidence).length };
  }, []);

  const shown = active ?? null;
  const shownEvidence = resolve(shown?.evidence);

  return (
    <div className="hard-shadow border-2 border-border bg-card/45 p-5">
      <div className="mb-5 flex items-center gap-3">
        <Stamp>Inventory</Stamp>
        <div className="flex-1">
          <PixelRule />
        </div>
        <Label>
          {backed} of {total} backed
        </Label>
      </div>

      {/*
       * A readout rather than a tooltip. The chart above argues evidence over
       * assertion; the inventory was the one block making bare claims, so each
       * item now answers "where was this actually used" in a fixed place that
       * does not move the layout when it changes.
       */}
      <div
        className="mb-5 flex min-h-[3.25rem] flex-wrap items-center gap-x-5 gap-y-2 border-2 border-border bg-card/60 px-4 py-3"
        aria-live="polite"
      >
        {shown ? (
          <>
            <span className="font-mono text-sm">{shown.name}</span>
            {shownEvidence ? (
              <>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {shownEvidence.depth.toLocaleString("en-US")} m
                </span>
                {shownEvidence.repoUrl ? (
                  <a
                    href={shownEvidence.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] underline underline-offset-4"
                    style={{ color: "var(--signal)" }}
                  >
                    {shownEvidence.label} ↗
                  </a>
                ) : (
                  <span
                    className="font-mono text-[11px]"
                    style={{ color: "var(--signal)" }}
                  >
                    {shownEvidence.label}
                  </span>
                )}
              </>
            ) : (
              <span className="font-mono text-[11px] text-muted-foreground">
                Used off this page — no repository here to point at
              </span>
            )}
          </>
        ) : (
          <span className="font-mono text-[11px] tracking-[0.15em] text-muted-foreground/60 uppercase">
            Hover an item to see where it was used
          </span>
        )}
      </div>

      <div className="divide-y-2 divide-border border-y-2 border-border">
        {skillGroups.map((g) => {
          const groupBacked = g.items.filter((i) => i.evidence).length;
          return (
            <div
              key={g.category}
              className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr_4rem] sm:items-start sm:gap-5"
            >
              <Label className="pt-1.5">{g.category}</Label>

              <div className="flex flex-wrap gap-1.5">
                {g.items.map((item) => {
                  const ev = resolve(item.evidence);
                  const isActive = shown?.name === item.name;

                  const face = (
                    <>
                      {item.name}
                      {/* Depth of the evidence, drawn along the item's own
                          foot: the whole row reads as a depth profile. */}
                      {ev && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 h-[2px]"
                          style={{
                            width: `${(ev.depth / MAX_DEPTH) * 100}%`,
                            background: isActive
                              ? "var(--signal)"
                              : "var(--muted-foreground)",
                          }}
                        />
                      )}
                    </>
                  );

                  const shared = {
                    className:
                      "relative block overflow-hidden border bg-card/60 px-2 pt-1 pb-[6px] text-left font-mono text-[11px] transition-colors",
                    style: {
                      borderColor: isActive ? "var(--signal)" : "var(--border)",
                      borderStyle: ev ? "solid" : ("dashed" as const),
                      color: ev
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                    },
                    onMouseEnter: () => setActive(item),
                    onMouseLeave: () => setActive(null),
                  };

                  /*
                   * Backed items are links, because they genuinely go
                   * somewhere. Rendering every item as a button gave the page
                   * 38 focus stops that did nothing on activation — an inert
                   * control is worse than no control.
                   */
                  return ev?.repoUrl ? (
                    <a
                      key={item.name}
                      href={ev.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${item.name}, used in ${ev.label} at ${ev.depth.toLocaleString("en-US")} metres`}
                      onFocus={() => setActive(item)}
                      onBlur={() => setActive(null)}
                      {...shared}
                    >
                      {face}
                    </a>
                  ) : (
                    <span
                      key={item.name}
                      title={
                        ev
                          ? `${ev.label} · ${ev.depth.toLocaleString("en-US")} m`
                          : "Used off this page"
                      }
                      {...shared}
                    >
                      {face}
                    </span>
                  );
                })}
              </div>

              <div className="hidden pt-1.5 text-right sm:block">
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  {groupBacked}/{g.items.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-border pt-4">
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-6 border"
            style={{ borderColor: "var(--border)" }}
          />
          <Label>Backed by a repository</Label>
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-6 border border-dashed"
            style={{ borderColor: "var(--border)" }}
          />
          <Label>Used off this page</Label>
        </span>
        <p className="max-w-xl font-mono text-[11px] leading-relaxed text-muted-foreground/70">
          The underline on each item is how deep its evidence goes. The sounding
          line above is only what a project pushed hard enough to prove — which
          is why Git and an editor appear here and not there.
        </p>
      </div>
    </div>
  );
}
