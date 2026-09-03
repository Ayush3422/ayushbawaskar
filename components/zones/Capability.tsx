"use client";

import { MAX_DEPTH } from "@/lib/depth";
import { skills, skillGroups } from "@/data/skills";
import { projects } from "@/data/projects";
import { Label, Panel, TagMatrix } from "@/components/ui/primitives";

export function Capability() {
  const sorted = [...skills].sort((a, b) => b.depth - a.depth);

  // Distinct evidencing projects, deepest first — the sounding line's sources.
  const sources = [...projects]
    .sort((a, b) => b.range - a.range)
    .filter((p) => skills.some((s) => s.evidenceSlug === p.slug));

  return (
    <div data-testid="capability-sounding" className="space-y-16">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-start lg:gap-16">
        <div>
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <Label>Sounding line</Label>
            <Label>{sorted.length} entries</Label>
          </div>

          <ol className="relative border-l border-border pl-6">
            {sorted.map((s) => (
              <li
                key={s.name}
                data-skill={s.name}
                className="group relative mb-4 flex items-baseline justify-between gap-6"
                style={{ marginLeft: `${(s.depth / MAX_DEPTH) * 24}%` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[1.6rem] h-px w-5 bg-border transition-colors group-hover:bg-[var(--signal)]"
                />
                <span className="text-sm">{s.name}</span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  {s.depth.toLocaleString("en-US")} m · {s.evidenceLabel}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          <Panel label="How to read this">
            <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
              No self-assigned scores. Each entry sits at the depth of the
              deepest project that actually used it, and names that project. A
              marker further right is not a claim of talent — it is a pointer to
              a repository where the thing was used under load.
            </p>
            <p className="mt-4 font-mono text-sm leading-[1.85] text-muted-foreground">
              A percentage would be unverifiable, and you would be right to
              discount it. This is the honest version of the same chart.
            </p>
          </Panel>

          <Panel label="Evidence">
            <ul className="divide-y divide-border">
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
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                    {p.range.toLocaleString("en-US")} m
                  </span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 py-2.5">
                <span className="font-mono text-sm text-muted-foreground">
                  This site
                </span>
                <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground">
                  600 m
                </span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      <div>
        <div className="mb-4 border-b border-border pb-2">
          <Label>Inventory</Label>
        </div>
        <TagMatrix groups={skillGroups} />
      </div>
    </div>
  );
}
