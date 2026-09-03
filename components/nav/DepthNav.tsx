"use client";

import { ZONES } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

export function DepthNav() {
  const { zone } = useDepth();

  return (
    <nav
      aria-label="Depth zones"
      className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur"
    >
      <div className="flex items-center justify-between px-6 py-3 md:px-12">
        <a href="#surface" className="font-display text-sm tracking-[0.3em]">
          AYUSH<span style={{ color: "var(--signal)" }}>{" // "}</span>ABYSS
        </a>
        <ul className="hidden gap-6 md:flex">
          {ZONES.map((z) => (
            <li key={z.id}>
              <a
                href={`#${z.id}`}
                aria-current={z.id === zone.id ? "true" : undefined}
                className="font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:text-foreground"
                style={{
                  color:
                    z.id === zone.id ? "var(--signal)" : "var(--muted-foreground)",
                }}
              >
                {z.label} · {z.min}m
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
