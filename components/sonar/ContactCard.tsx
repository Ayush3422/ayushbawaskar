"use client";

import { depthToZone } from "@/lib/depth";
import type { Project } from "@/data/types";
import { Chip, Label } from "@/components/ui/primitives";

/**
 * Tier styling by the zone the project's range falls in. The banner intensity
 * carries the ranking without introducing a second colour per tier — the page
 * has exactly one accent and this stays inside it.
 */
function bannerStyle(range: number): React.CSSProperties {
  if (range >= 6000) {
    return { background: "var(--signal)", color: "#0a0a0a" };
  }
  if (range >= 4000) {
    return { background: "color-mix(in srgb, var(--signal) 32%, #141414)" };
  }
  return { background: "#2a2a2a" };
}

export function ContactCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const tier = depthToZone(project.range);
  const cells = project.metrics.slice(0, 4);

  return (
    <button
      type="button"
      data-contact={project.slug}
      onClick={() => onSelect(project)}
      aria-label={`${project.name}, ${project.domain}, range ${project.range.toLocaleString("en-US")} metres`}
      className="group hard-shadow flex h-full flex-col border-2 border-border bg-card/55 text-left transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-[var(--signal)] hover:shadow-[8px_8px_0_0_var(--signal)]"
    >
      <div
        className="flex items-center justify-between px-4 py-2 font-mono text-[10px] tracking-[0.22em] uppercase"
        style={bannerStyle(project.range)}
      >
        <span>{tier.label}</span>
        <span className="tabular-nums">
          {project.range.toLocaleString("en-US")} m
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "var(--signal)" }}
          >
            {project.domain}
          </span>
          <Label>{String(index + 1).padStart(2, "0")}</Label>
        </div>

        <h3 className="mt-3 font-display text-2xl tracking-wide">
          {project.name}
        </h3>

        <p className="mt-3 font-serif text-lg leading-snug text-foreground/85">
          {project.summary}
        </p>

        <p className="mt-3 line-clamp-4 font-mono text-[13px] leading-[1.75] text-muted-foreground">
          {project.lede}
        </p>

        {/* Real measurements from the repository, never a rating out of 100. */}
        <dl className="mt-5 grid grid-cols-2 border-2 border-border">
          {cells.map((m, i) => {
            // An odd final metric spans the full width. Leaving a bordered
            // empty cell instead reads as a rendering fault, not a layout.
            const isLastOdd = i === cells.length - 1 && cells.length % 2 === 1;
            const lastRow = Math.floor((cells.length - 1) / 2);
            return (
              <div
                key={m.label}
                className={`p-3 ${isLastOdd ? "col-span-2" : ""} ${
                  !isLastOdd && i % 2 === 0 ? "border-r border-border" : ""
                } ${Math.floor(i / 2) < lastRow ? "border-b border-border" : ""}`}
              >
                <dt>
                  <Label>{m.label}</Label>
                </dt>
                <dd className="mt-1 font-mono text-sm tabular-nums">
                  {m.value}
                </dd>
              </div>
            );
          })}
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
          {project.caveat ? (
            <span
              className="font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: "var(--signal)" }}
            >
              Caveat stated
            </span>
          ) : (
            <span />
          )}
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
            ▸ Inspect
          </span>
        </div>
      </div>
    </button>
  );
}
