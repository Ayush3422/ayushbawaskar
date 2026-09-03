"use client";

import { MAX_DEPTH } from "@/lib/depth";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { Label, Panel, PixelRule, Stamp } from "@/components/ui/primitives";
import { Inventory } from "./Inventory";

/** Axis gradations, in metres. */
const TICKS = [0, 2000, 4000, 6000, 8000, 10000];

export function Capability() {
  const sorted = [...skills].sort((a, b) => b.depth - a.depth);

  // Distinct evidencing projects, deepest first — the sounding line's sources.
  const sources = [...projects]
    .sort((a, b) => b.range - a.range)
    .filter((p) => skills.some((s) => s.evidenceSlug === p.slug));

  const pct = (d: number) => (d / MAX_DEPTH) * 100;

  return (
    <div data-testid="capability-sounding" className="space-y-16">
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-start">
        <div className="hard-shadow border-2 border-border bg-card/45 p-5">
          <div className="mb-5 flex items-center gap-3">
            <Stamp>Sounding line</Stamp>
            <div className="flex-1">
              <PixelRule />
            </div>
            <Label>{sorted.length} entries</Label>
          </div>

          {/*
           * A real axis. Previously the depth was encoded as a left margin with
           * no scale beside it, so the indent carried no meaning a reader could
           * decode — it just looked like ragged text.
           */}
          <div className="grid grid-cols-[9rem_1fr] gap-3 sm:grid-cols-[13.5rem_1fr] sm:gap-4">
            <div />
            <div className="relative mb-2 h-4">
              {TICKS.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 font-mono text-[9px] tabular-nums text-muted-foreground/60"
                  style={{ left: `${pct(t)}%`, transform: "translateX(-50%)" }}
                >
                  {t === 0 ? "0" : `${t / 1000}k`}
                </span>
              ))}
            </div>
          </div>

          <ol className="grid grid-cols-[9rem_1fr] gap-x-3 sm:grid-cols-[13.5rem_1fr] sm:gap-x-4">
            {sorted.map((s) => (
              <li
                key={s.name}
                data-skill={s.name}
                className="group col-span-2 grid grid-cols-subgrid items-center py-[5px]"
              >
                <span className="truncate font-mono text-[12px] transition-colors group-hover:text-[var(--signal)]">
                  {s.name}
                </span>

                <span className="relative block h-4">
                  {/* Gridlines, so a marker's position is readable against the axis. */}
                  {TICKS.map((t) => (
                    <span
                      key={t}
                      aria-hidden="true"
                      className="absolute inset-y-0 w-px bg-border/45"
                      style={{ left: `${pct(t)}%` }}
                    />
                  ))}

                  {/* The bar is the claim: it reaches the depth of the deepest
                      project that used this, and stops there. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-border transition-colors group-hover:bg-[var(--signal)]"
                    style={{ width: `${pct(s.depth)}%` }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-muted-foreground transition-colors group-hover:bg-[var(--signal)]"
                    style={{ left: `${pct(s.depth)}%` }}
                  />
                  {/* Deep markers put their label inboard. Trailing it to the
                      right pushed the 9,200 m rows past the panel edge. */}
                  <span
                    className="absolute top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-muted-foreground/70 uppercase"
                    style={
                      pct(s.depth) > 58
                        ? {
                            right: `${100 - pct(s.depth)}%`,
                            paddingRight: "0.75rem",
                          }
                        : { left: `${pct(s.depth)}%`, paddingLeft: "0.75rem" }
                    }
                  >
                    {s.depth.toLocaleString("en-US")} m · {s.evidenceLabel}
                  </span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-5 border-t-2 border-border pt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground/70 uppercase">
            Bar length is the depth of the deepest project that used it. Nothing
            here is self-scored.
          </p>
        </div>

        <div className="space-y-6">
          <Panel label="How to read this">
            <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
              No self-assigned scores. Each entry sits at the depth of the
              deepest project that actually used it, and names that project. A
              longer bar is not a claim of talent — it is a pointer to a
              repository where the thing was used under load.
            </p>
            <p className="mt-4 font-mono text-sm leading-[1.85] text-muted-foreground">
              A percentage would be unverifiable, and you would be right to
              discount it. This is the honest version of the same chart.
            </p>
          </Panel>

          <Panel label="Evidence" signal>
            <ul className="divide-y-2 divide-border">
              {sources.map((p) => (
                <li
                  key={p.slug}
                  className="flex items-baseline justify-between gap-4 py-2.5"
                >
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm underline underline-offset-4"
                    style={{ color: "var(--signal)" }}
                  >
                    {p.name}
                  </a>
                  <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                    {skills.filter((s) => s.evidenceSlug === p.slug).length} ·{" "}
                    {p.range.toLocaleString("en-US")} m
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="font-mono text-sm text-muted-foreground">
                  This site
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  {skills.filter((s) => s.evidenceSlug === "abyss").length} · 600
                  m
                </span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <Inventory />
    </div>
  );
}
