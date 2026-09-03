"use client";

import { ZONES } from "@/lib/depth";
import { contactToXY } from "@/lib/sonar";
import type { Project } from "@/data/types";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/** Scope geometry in SVG user units; the container scales it responsively. */
const R = 260;
const SWEEP_SECONDS = 6;

/**
 * Presentational. The blips stay clickable for mouse users but are removed
 * from the tab order and the accessibility tree — the manifest beside the
 * scope is the real, ordered, labelled list, so there is exactly one set of
 * focus stops rather than two.
 */
export function SonarScope({
  contacts,
  onSelect,
  activeSlug,
}: {
  contacts: Project[];
  onSelect: (p: Project) => void;
  activeSlug?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg
        aria-hidden="true"
        viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sonar-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ZONES.map((z) => (
          <g key={z.id}>
            <circle
              cx="0"
              cy="0"
              r={Math.abs(contactToXY(0, z.max, R).y)}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x="4"
              y={contactToXY(0, z.max, R).y + 12}
              fill="var(--muted-foreground)"
              opacity="0.5"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {z.max.toLocaleString("en-US")}
            </text>
          </g>
        ))}

        <line x1={-R} y1="0" x2={R} y2="0" stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1={-R} x2="0" y2={R} stroke="var(--border)" strokeWidth="1" />

        <g
          style={
            reduced
              ? undefined
              : {
                  animation: `sonar-sweep ${SWEEP_SECONDS}s linear infinite`,
                  transformOrigin: "0px 0px",
                }
          }
        >
          <path
            d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 0 1 ${R * 0.5} ${-R * 0.87} Z`}
            fill="url(#sonar-sweep-grad)"
          />
        </g>
      </svg>

      {contacts.map((p) => {
        const { x, y } = contactToXY(p.bearing, p.range, 50);
        const isActive = p.slug === activeSlug;
        return (
          <button
            key={p.slug}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            data-blip={p.slug}
            onClick={() => onSelect(p)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
            style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
          >
            <span
              className="block h-2.5 w-2.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-[var(--signal)]"
              style={
                isActive
                  ? { background: "var(--signal)" }
                  : reduced
                    ? { background: "var(--signal)" }
                    : {
                        animation: `sonar-ping ${SWEEP_SECONDS}s ease-out infinite`,
                        animationDelay: `${(p.bearing / 360) * SWEEP_SECONDS}s`,
                      }
              }
            />
            <span className="pointer-events-none absolute top-1/2 left-5 -translate-y-1/2 font-mono text-[10px] tracking-[0.15em] whitespace-nowrap text-muted-foreground uppercase transition-colors group-hover:text-foreground">
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
