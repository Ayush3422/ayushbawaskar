"use client";

import { MAX_DEPTH } from "@/lib/depth";
import { skills } from "@/data/skills";

/**
 * A sounding line rather than a bar chart. Horizontal offset encodes the
 * depth of the deepest project that used each skill, so the visual ranking
 * and the cited evidence are the same fact rather than two.
 */
export function Capability() {
  const sorted = [...skills].sort((a, b) => b.depth - a.depth);

  return (
    <div data-testid="capability-sounding" className="max-w-3xl">
      <p className="mb-12 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground">
        No self-assigned scores. Each skill sits at the depth of the deepest
        project that actually used it, and names that project — so every marker
        resolves to a repository you can open.
      </p>

      <ol className="relative border-l border-border pl-6">
        {sorted.map((s) => (
          <li
            key={s.name}
            data-skill={s.name}
            className="group relative mb-5 flex items-baseline justify-between gap-6"
            style={{ marginLeft: `${(s.depth / MAX_DEPTH) * 26}%` }}
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
  );
}
