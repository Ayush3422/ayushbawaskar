"use client";

import { ZONES } from "@/lib/depth";
import { contactToXY } from "@/lib/sonar";
import type { Project } from "@/data/types";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/** Scope geometry in SVG user units; the container scales it responsively. */
const R = 260;
const SWEEP_SECONDS = 6;

/** Bearing ticks every 15°, numbered every 45°. */
const TICKS = Array.from({ length: 24 }, (_, i) => i * 15);

/**
 * Rounded deliberately. Unrounded trig serialises differently in Node and in
 * the browser — -233.82685902179836 against ...838 — which React reports as a
 * hydration mismatch and then declines to patch.
 */
const round = (n: number) => Math.round(n * 1000) / 1000;

const polar = (deg: number, radius: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: round(radius * Math.cos(rad)), y: round(radius * Math.sin(rad)) };
};

/**
 * Presentational. The blips stay clickable for mouse users but are removed
 * from the tab order and the accessibility tree — the card grid below is the
 * real, ordered, labelled list, so there is exactly one set of focus stops.
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
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <svg
        aria-hidden="true"
        viewBox={`${-R - 46} ${-R - 46} ${(R + 46) * 2} ${(R + 46) * 2}`}
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sonar-sweep-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Bearing ticks around the rim — the chrome that makes it an
            instrument rather than a set of concentric circles. */}
        {TICKS.map((deg) => {
          const major = deg % 45 === 0;
          const a = polar(deg, R + (major ? 4 : 10));
          const b = polar(deg, R + 18);
          return (
            <line
              key={deg}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="var(--border)"
              strokeWidth={major ? 2 : 1}
            />
          );
        })}

        {TICKS.filter((d) => d % 90 === 0).map((deg) => {
          const p = polar(deg, R + 34);
          return (
            <text
              key={deg}
              x={p.x}
              y={p.y + 3}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              opacity="0.6"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {String(deg).padStart(3, "0")}
            </text>
          );
        })}

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
              x="5"
              y={contactToXY(0, z.max, R).y + 12}
              fill="var(--muted-foreground)"
              opacity="0.45"
              fontSize="9"
              fontFamily="var(--font-mono)"
            >
              {z.max.toLocaleString("en-US")}
            </text>
          </g>
        ))}

        <line x1={-R} y1="0" x2={R} y2="0" stroke="var(--border)" strokeWidth="1" />
        <line x1="0" y1={-R} x2="0" y2={R} stroke="var(--border)" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="var(--muted-foreground)" opacity="0.6" />

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
        // Labels point away from the centre. Anchoring them all to the right
        // pushed the near contacts' text back across the origin.
        const leftOfCentre = x < 0;
        return (
          <button
            key={p.slug}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            data-blip={p.slug}
            onClick={() => onSelect(p)}
            className="group absolute -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
          >
            <span
              className="block h-2.5 w-2.5 bg-muted-foreground transition-colors group-hover:bg-[var(--signal)]"
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
            <span
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.15em] whitespace-nowrap uppercase transition-colors group-hover:text-foreground"
              style={{
                color: isActive ? "var(--signal)" : "var(--muted-foreground)",
                ...(leftOfCentre
                  ? { right: "1.25rem" }
                  : { left: "1.25rem" }),
              }}
            >
              {p.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
