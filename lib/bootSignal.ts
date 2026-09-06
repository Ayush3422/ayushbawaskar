/**
 * What the boot screen is actually waiting for.
 *
 * The bar reports real work rather than a timer. Everything on this site is
 * meant to be checkable, and a progress bar animating to a fixed schedule is
 * the smallest possible lie — it looks like a measurement and is not one. So
 * each step below is a thing that genuinely has to finish before the dive can
 * start, and the bar moves when it does.
 *
 * Pacing is smoothed and floored (see BootSequence): on a fast machine all four
 * land within a couple of hundred milliseconds, which would be a flash rather
 * than a sequence. The reading is honest; only the easing is choreography.
 */
export type Milestone = "hull" | "gauges" | "spectrum" | "type";

export const MILESTONES: { key: Milestone; line: string }[] = [
  // React has hydrated and the page is interactive.
  { key: "hull", line: "Sealing the hatch" },
  // WebGL2 and float render targets probed — the ocean's hard requirements.
  { key: "gauges", line: "Checking the gauges" },
  // Phillips spectrum, butterfly table and the first rendered frame.
  { key: "spectrum", line: "Spinning up the spectrum" },
  // The three faces the instruments are set in have loaded.
  { key: "type", line: "Flooding the ballast tanks" },
];

const reached = new Set<Milestone>();
const listeners = new Set<() => void>();

export const bootSignal = {
  /** Idempotent: a milestone reached twice notifies once. */
  mark(key: Milestone) {
    if (reached.has(key)) return;
    reached.add(key);
    for (const listener of listeners) listener();
  },

  reached(): Milestone[] {
    return MILESTONES.map((m) => m.key).filter((k) => reached.has(k));
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
