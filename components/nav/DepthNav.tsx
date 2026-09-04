"use client";

import { MAX_DEPTH, ZONES } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";
import { Ambience } from "@/components/audio/Ambience";

export function DepthNav() {
  const { zone, depth } = useDepth();
  const progress = Math.min(Math.max(depth / MAX_DEPTH, 0), 1);

  return (
    <nav
      aria-label="Depth zones"
      className="fixed inset-x-0 top-0 z-40 border-b-2 border-border bg-background/85 backdrop-blur"
    >
      <div className="flex h-[4.5rem] items-center justify-between gap-6 px-6 md:px-12">
        <a
          href="#surface"
          className="font-display text-sm tracking-[0.2em] whitespace-nowrap sm:text-lg sm:tracking-[0.28em] md:text-xl"
        >
          AYUSH<span style={{ color: "var(--signal)" }}>{" // "}</span>ABYSS
        </a>

        {/* Each zone gets its name and its depth on separate lines, which is
            what gives the bar enough vertical substance to read as navigation
            rather than as a caption strip. */}
        <ul className="hidden items-stretch lg:flex">
          {ZONES.map((z, i) => {
            const active = z.id === zone.id;
            return (
              <li key={z.id}>
                <a
                  href={`#${z.id}`}
                  aria-current={active ? "true" : undefined}
                  className="group flex flex-col gap-1 border-b-2 px-4 py-2 transition-colors xl:px-5"
                  style={{
                    borderColor: active ? "var(--signal)" : "transparent",
                  }}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[9px] text-muted-foreground/45">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span
                      className="font-mono text-[12px] tracking-[0.18em] uppercase transition-colors group-hover:text-foreground"
                      style={{
                        color: active ? "var(--signal)" : "var(--foreground)",
                      }}
                    >
                      {z.label}
                    </span>
                  </span>
                  <span className="pl-[1.4rem] font-mono text-[10px] tabular-nums text-muted-foreground/60">
                    {z.min.toLocaleString("en-US")} m
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Below lg the zone list is replaced by where you currently are. */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            {zone.label}
          </span>
          <span className="border-2 border-border px-2 py-1 font-mono text-[11px] whitespace-nowrap tabular-nums">
            {Math.round(depth).toLocaleString("en-US")} m
          </span>
        </div>

        {/*
         * One instance, at every width. Rendering it twice and hiding one with
         * a breakpoint gave the page two Ambience components, each building its
         * own AudioContext and audio element — so the visible button controlled
         * only half of what had been created.
         */}
        <div className="shrink-0">
          <Ambience />
        </div>
      </div>

      {/* Descent progress, 0 to the Challenger Deep. */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{ background: "var(--border)" }}
      >
        <div
          className="h-px"
          style={{
            width: `${progress * 100}%`,
            background: "var(--signal)",
          }}
        />
      </div>
    </nav>
  );
}
