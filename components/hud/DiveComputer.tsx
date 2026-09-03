"use client";

import { useDepth } from "@/components/depth/DepthProvider";

/** Metres per second above which the descent reads as uncontrolled. */
const RATE_WARN = 900;

const clock = (ms: number) => {
  const total = Math.floor(ms / 1000);
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
};

/**
 * A decorative instrument, so aria-hidden. Everything it reports is available
 * to assistive technology elsewhere: the zone name through the nav, and the
 * position in the document through the section headings.
 */
export function DiveComputer() {
  const { depth, zone, pressureBar, descentRate, elapsedMs } = useDepth();
  const warning = Math.abs(descentRate) > RATE_WARN;

  return (
    <div
      data-testid="dive-computer"
      data-warning={String(warning)}
      aria-hidden="true"
      className="fixed right-4 bottom-4 z-40 w-[11.5rem] rounded-lg border border-border bg-card/85 p-3 font-mono backdrop-blur transition-opacity duration-200 hover:opacity-15 md:right-6 md:bottom-6 md:p-4"
    >
      <div className="flex items-baseline gap-2">
        <span
          data-testid="hud-depth"
          className="text-2xl tabular-nums md:text-3xl"
        >
          {Math.round(depth).toLocaleString("en-US")}
        </span>
        <span className="text-xs text-muted-foreground">m</span>
      </div>

      <div className="mt-1 text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        {zone.label}
      </div>

      <dl className="mt-3 hidden gap-x-4 gap-y-1 text-[10px] md:grid md:grid-cols-[auto_auto]">
        <dt className="text-muted-foreground">RATE</dt>
        <dd
          className="tabular-nums"
          style={warning ? { color: "var(--signal)" } : undefined}
        >
          {descentRate >= 0 ? "+" : ""}
          {Math.round(descentRate)} m/s
        </dd>

        <dt className="text-muted-foreground">PRESS</dt>
        <dd className="tabular-nums">{pressureBar.toFixed(1)} bar</dd>

        <dt className="text-muted-foreground">TIME</dt>
        <dd className="tabular-nums">{clock(elapsedMs)}</dd>
      </dl>

      {warning && (
        <p
          className="mt-2 hidden text-[10px] tracking-[0.2em] uppercase md:block"
          style={{ color: "var(--signal)" }}
        >
          Descent rate
        </p>
      )}
    </div>
  );
}
