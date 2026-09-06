import { ZONES, MAX_DEPTH } from "@/lib/depth";
import { Label } from "@/components/ui/primitives";

/** What waits at each depth. Doubles as the table of contents. */
const WHAT_IS_THERE: Record<string, string> = {
  surface: "You are here",
  sunlight: "Who you are reading",
  twilight: "Contacts, ranked by rigour",
  midnight: "Competence plotted against evidence",
  abyssal: "The log, and the rules it taught",
  hadal: "Contact, and how this was built",
};

/**
 * The water column, as an instrument.
 *
 * This replaced a plain list of the six zones. The list was accurate and told
 * a reader nothing they could see — every zone was one row tall, so sunlight
 * and hadal looked like equal parts of the dive when one is 160 metres and the
 * other is over five kilometres.
 *
 * The rail on the left is the correction. Rows stay equal height because they
 * hold equal amounts of reading, but the rail plots each boundary at its true
 * fraction of 11,034 m, which is why its marks pile up in the first tenth and
 * leave the bottom half to one zone. That is the actual shape of the trench,
 * and it is the first honest thing the page can show about the thing it is
 * built around. The compression is labelled rather than left to be noticed.
 */
export function TrenchProfile() {
  return (
    <nav
      aria-label="Dive plan"
      className="hard-shadow corner-ticks relative border-2 border-border bg-card/55 p-5"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4 border-b-2 border-border pb-2">
        <Label>Trench profile</Label>
        <Label>{ZONES.length} zones · 11,034 m</Label>
      </div>

      <div className="flex gap-4">
        <DepthRail />

        <ol className="min-w-0 flex-1 divide-y-2 divide-border">
          {ZONES.map((z, i) => (
            <li key={z.id}>
              <a
                href={`#${z.id}`}
                className="group grid grid-cols-[1.5rem_1fr] items-baseline gap-x-3 gap-y-1 py-2.5 sm:grid-cols-[1.5rem_5.5rem_1fr]"
              >
                <span className="font-mono text-[10px] text-muted-foreground/50">
                  {String(i).padStart(2, "0")}
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase transition-colors group-hover:text-[var(--signal)]">
                  {z.label}
                </span>
                <span className="col-span-2 flex items-baseline justify-between gap-3 sm:col-span-1">
                  <span className="truncate font-serif text-sm text-muted-foreground">
                    {WHAT_IS_THERE[z.id]}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/60">
                    {z.min.toLocaleString("en-US")} m
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-3 border-t-2 border-border pt-2 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60 uppercase">
        Rows are equal height · the rail is to scale
      </p>
    </nav>
  );
}

/**
 * Each zone boundary at its true fraction of the full depth. Reading the
 * positions out of ZONES rather than writing them down keeps this honest if a
 * band ever moves.
 */
function DepthRail() {
  return (
    <div
      aria-hidden="true"
      className="relative w-9 shrink-0 border-r-2 border-border"
    >
      {ZONES.map((z, i) => {
        const top = (z.min / MAX_DEPTH) * 100;
        return (
          // Unlabelled on purpose. The first three boundaries fall inside the
          // top two percent of the column, so numbering them printed 00, 01
          // and 02 on top of each other — and the pile-up is the reading, not
          // a detail to annotate.
          <span
            key={z.id}
            className="absolute right-0 block h-px"
            style={{
              top: `${top}%`,
              width: i === 0 ? "16px" : "10px",
              background:
                i === 0
                  ? "var(--signal)"
                  : "color-mix(in srgb, var(--signal) 45%, transparent)",
            }}
          />
        );
      })}

      {/* The floor. Nothing below this, which is the page's closing line. */}
      <span
        className="absolute right-0 bottom-0 block h-px w-3.5"
        style={{ background: "var(--signal)" }}
      />
    </div>
  );
}
