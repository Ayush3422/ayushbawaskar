import { MAX_DEPTH, ZONES } from "@/lib/depth";
import { Label, PixelRule, Stamp } from "@/components/ui/primitives";

/** Depths the axis is worth marking. The shallow boundaries collide. */
const MARKS = [0, 1000, 4000, 6000, MAX_DEPTH];

/** A segment gets its name inside it only if there is room to read it. */
const WIDE_ENOUGH = 12;

export function DiveProfile() {
  const span = (z: (typeof ZONES)[number]) =>
    ((z.max - z.min) / MAX_DEPTH) * 100;

  const narrow = ZONES.filter((z) => span(z) < WIDE_ENOUGH);
  const narrowMax = Math.max(...narrow.map((z) => z.max));

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Stamp>Dive profile</Stamp>
        <div className="flex-1">
          <PixelRule />
        </div>
        <Label>0 → 11,034 m</Label>
      </div>

      {/* Axis above the bar. */}
      <div className="relative mb-1.5 h-4">
        {MARKS.map((d) => (
          <span
            key={d}
            className="absolute top-0 font-mono text-[9px] tabular-nums text-muted-foreground/60"
            style={{
              left: `${(d / MAX_DEPTH) * 100}%`,
              transform:
                d === 0
                  ? "none"
                  : d === MAX_DEPTH
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
            }}
          >
            {d.toLocaleString("en-US")}
          </span>
        ))}
      </div>

      {/*
       * Segments are proportional to their real span, which is the point: the
       * nav spaces the six zones evenly and that quietly misrepresents them.
       * Here Hadal takes almost half the trench and the first three together
       * take under a tenth.
       */}
      <div
        className="flex h-12 w-full border-2 border-border"
        role="img"
        aria-label="Dive profile: six ocean zones drawn in proportion to their real depth span, from the surface to 11,034 metres."
      >
        {ZONES.map((z, i) => {
          const w = span(z);
          // Each segment is darker than the last — the bar is the dive. The
          // range has to be wide or every segment lands on near-black and the
          // gradient, which is the whole idea, disappears.
          const l = 0.5 - (i / (ZONES.length - 1)) * 0.38;
          return (
            <div
              key={z.id}
              className="relative flex items-center justify-center overflow-hidden border-r border-border last:border-r-0"
              style={{
                width: `${w}%`,
                background: `rgba(${Math.round(l * 150)}, ${Math.round(l * 170)}, ${Math.round(l * 180)}, 1)`,
              }}
            >
              {w >= WIDE_ENOUGH && (
                <span className="font-mono text-[10px] tracking-[0.2em] whitespace-nowrap text-foreground/70 uppercase">
                  {z.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
          First {narrowMax.toLocaleString("en-US")} m —{" "}
          {narrow.map((z) => z.label).join(" · ")}
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
          Hadal alone is {Math.round(span(ZONES[ZONES.length - 1]))}% of the
          trench
        </p>
      </div>
    </div>
  );
}
