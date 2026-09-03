"use client";

import { useState } from "react";
import { ZONES } from "@/lib/depth";
import { contactToXY } from "@/lib/sonar";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ContactSheet } from "./ContactSheet";

/** Scope geometry in SVG user units; the container scales it responsively. */
const R = 260;
const SWEEP_SECONDS = 6;

export function SonarScope() {
  const [active, setActive] = useState<Project | null>(null);
  const reduced = useReducedMotion();

  // Deepest first. This is the order keyboard users tab through, so it is the
  // ranking itself rather than an arbitrary DOM order behind a canvas.
  const contacts = [...projects].sort((a, b) => b.range - a.range);

  return (
    <div className="max-w-3xl">
      <p className="font-serif mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        Bearing is the domain. Range is how deep the work goes — the same scale
        as the depth you are at. Deeper contacts took more to get right.
      </p>

      <div className="relative mx-auto aspect-square w-full max-w-[560px]">
        <svg
          aria-hidden="true"
          viewBox={`${-R} ${-R} ${R * 2} ${R * 2}`}
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="sonar-sweep-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ZONES.map((z) => (
            <circle
              key={z.id}
              cx="0"
              cy="0"
              r={Math.abs(contactToXY(0, z.max, R).y)}
              fill="none"
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}

          <line
            x1={-R}
            y1="0"
            x2={R}
            y2="0"
            stroke="var(--border)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1={-R}
            x2="0"
            y2={R}
            stroke="var(--border)"
            strokeWidth="1"
          />

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
          return (
            <button
              key={p.slug}
              type="button"
              data-contact={p.slug}
              onClick={() => setActive(p)}
              aria-label={`${p.name}, ${p.domain}, range ${p.range.toLocaleString("en-US")} metres`}
              className="group absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-2"
              style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
            >
              <span
                aria-hidden="true"
                className="block h-2.5 w-2.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-[var(--signal)] group-focus-visible:bg-[var(--signal)]"
                style={
                  reduced
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

      <ContactSheet
        project={active}
        open={active !== null}
        onOpenChange={(o) => !o && setActive(null)}
      />
    </div>
  );
}
