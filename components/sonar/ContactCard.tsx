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
  flipped,
  onToggle,
}: {
  project: Project;
  index: number;
  flipped: boolean;
  onToggle: (slug: string | null) => void;
}) {
  const tier = depthToZone(project.range);
  const cells = project.metrics.slice(0, 4);

  const banner = (
    <div
      className="flex items-center justify-between px-4 py-2 font-mono text-[10px] tracking-[0.22em] uppercase"
      style={bannerStyle(project.range)}
    >
      <span>{tier.label}</span>
      <span className="tabular-nums">
        {project.range.toLocaleString("en-US")} m
      </span>
    </div>
  );

  return (
    <div className="flip-scene h-[38rem]" data-card={project.slug}>
      <div className={`flip-card ${flipped ? "is-flipped" : ""}`}>
        {/* ---------------------------------------------------------- front */}
        <div className="flip-face" aria-hidden={flipped}>
          <button
            type="button"
            data-contact={project.slug}
            tabIndex={flipped ? -1 : 0}
            onClick={() => onToggle(project.slug)}
            aria-label={`${project.name}, ${project.domain}, range ${project.range.toLocaleString("en-US")} metres`}
            aria-expanded={flipped}
            className="group hard-shadow flex h-full w-full flex-col border-2 border-border bg-card/85 text-left transition-colors hover:border-[var(--signal)]"
          >
            {banner}

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
                  const isLastOdd =
                    i === cells.length - 1 && cells.length % 2 === 1;
                  const lastRow = Math.floor((cells.length - 1) / 2);
                  return (
                    <div
                      key={m.label}
                      className={`p-3 ${isLastOdd ? "col-span-2" : ""} ${
                        !isLastOdd && i % 2 === 0
                          ? "border-r border-border"
                          : ""
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

              <div className="mt-auto flex items-center justify-between gap-3 border-t-2 border-border pt-4">
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
                <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors group-hover:text-[var(--signal)]">
                  ▸ Turn over
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* ----------------------------------------------------------- back */}
        <div
          className="flip-face flip-face-back"
          aria-hidden={!flipped}
          data-back={project.slug}
        >
          <div className="hard-shadow flex h-full flex-col border-2 border-[var(--signal)] bg-card">
            {banner}

            <div className="flex min-h-0 flex-1 flex-col p-5">
              <div className="flex items-baseline justify-between gap-3">
                <h4 className="font-display text-xl tracking-wide">
                  {project.name}
                </h4>
                <Label>Evaluation</Label>
              </div>

              {/* Scroll region with a fade at its foot, so a clipped caveat
                  reads as "there is more" rather than as truncation. */}
              <div className="relative mt-4 min-h-0 flex-1">
                <div className="h-full overflow-y-auto pr-1">
                <dl className="grid grid-cols-2 border-2 border-border">
                  {project.metrics.map((m, i) => (
                    <div
                      key={m.label}
                      className={`p-2.5 ${
                        i % 2 === 0 ? "border-r border-border" : ""
                      } ${i < project.metrics.length - (project.metrics.length % 2 === 0 ? 2 : 1) ? "border-b border-border" : ""}`}
                    >
                      <dt>
                        <Label>{m.label}</Label>
                      </dt>
                      <dd className="mt-1 font-mono text-sm tabular-nums">
                        {m.value}
                      </dd>
                      {m.note && (
                        <dd className="mt-1 font-mono text-[10px] leading-snug text-muted-foreground">
                          {m.note}
                        </dd>
                      )}
                    </div>
                  ))}
                </dl>

                {project.caveat && (
                  <div
                    className="mt-4 border-2 p-3"
                    style={{ borderColor: "var(--signal)" }}
                  >
                    <p
                      className="font-mono text-[10px] tracking-[0.22em] uppercase"
                      style={{ color: "var(--signal)" }}
                    >
                      What this does not claim
                    </p>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground">
                      {project.caveat}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 pb-3">
                  {project.stack.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
                </div>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
                  style={{
                    background:
                      "linear-gradient(to top, var(--card), transparent)",
                  }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 border-t-2 border-border pt-4">
                <button
                  type="button"
                  tabIndex={flipped ? 0 : -1}
                  onClick={() => onToggle(null)}
                  className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase hover:text-foreground"
                >
                  ◂ Turn back
                </button>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={flipped ? 0 : -1}
                  className="font-mono text-[11px] underline underline-offset-4"
                  style={{ color: "var(--signal)" }}
                >
                  Read the code →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
