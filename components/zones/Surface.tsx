import { ZONES } from "@/lib/depth";
import { profile, headlineStats } from "@/data/profile";
import { Label, Stat } from "@/components/ui/primitives";

/** What waits at each depth. Doubles as the table of contents. */
const DIVE_PLAN: Record<string, string> = {
  surface: "You are here",
  sunlight: "Who you are reading",
  twilight: "Five contacts, ranked by rigour",
  midnight: "Competence plotted against evidence",
  abyssal: "The log, and the rules it taught",
  hadal: "Contact, and how this was built",
};

/** Staggered entrance, in seconds. */
const beat = (n: number) => ({ animationDelay: `${n * 0.09}s` });

export function Surface() {
  return (
    <section
      id="surface"
      aria-labelledby="surface-heading"
      className="relative flex min-h-[92vh] scroll-mt-24 flex-col justify-center px-6 py-24 md:px-12 lg:pr-[15rem]"
    >
      {/* Scrim. The swell is bright enough at the surface that muted labels
          lose contrast against it; this keeps the type readable without
          flattening the water. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.45) 40%, rgba(10,10,10,0.78) 100%)",
        }}
      />
      {/* Availability and location, the two things a recruiter looks for first. */}
      <div
        className="rise mb-10 flex flex-wrap items-center gap-x-4 gap-y-3"
        style={beat(0)}
      >
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2"
          style={{ background: "var(--signal)" }}
        />
        <Label>{profile.status}</Label>
        <span className="border-2 border-border px-2 py-1 font-mono text-[10px] tracking-[0.2em] uppercase">
          {profile.location}
        </span>
      </div>

      {/*
       * Two columns from xl. Eight characters cannot fill 1,600px however
       * large the type is set, so the width is spent on a second column of
       * real content instead of on empty space beside the headline.
       */}
      <div className="grid gap-12 xl:grid-cols-[1.35fr_1fr] xl:items-end xl:gap-20">
        <div>
          <h1
            id="surface-heading"
            className="font-display text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.95] tracking-tight uppercase"
          >
            <span className="rise block" style={beat(1)}>
              Measured <span style={{ color: "var(--signal)" }}>not</span>
            </span>
            <span className="rise block" style={beat(2)}>
              Asserted
            </span>
          </h1>

          <p
            className="rise mt-8 max-w-2xl font-serif text-2xl leading-snug text-foreground/85 md:text-3xl"
            style={beat(3)}
          >
            {profile.heroLine}
          </p>

          {/* The name is the one thing a reader must leave with, so it is set
              at size rather than trailing the headline as a caption. */}
          <div
            className="rise mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2 border-t-2 border-border pt-6"
            style={beat(4)}
          >
            <span className="font-display text-2xl tracking-[0.12em] md:text-3xl">
              {profile.name}
            </span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
              {profile.role}
            </span>
          </div>
        </div>

        <nav
          aria-label="Dive plan"
          className="rise hard-shadow corner-ticks relative border-2 border-border bg-card/55 p-5"
          style={beat(5)}
        >
          <div className="mb-3 flex items-baseline justify-between gap-4 border-b-2 border-border pb-2">
            <Label>Dive plan</Label>
            <Label>6 zones</Label>
          </div>

          <ol className="divide-y-2 divide-border">
            {ZONES.map((z, i) => (
              <li key={z.id}>
                <a
                  href={`#${z.id}`}
                  className="group grid grid-cols-[1.6rem_5.5rem_1fr] items-baseline gap-3 py-2.5"
                >
                  <span className="font-mono text-[10px] text-muted-foreground/50">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase transition-colors group-hover:text-[var(--signal)]">
                    {z.label}
                  </span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-sm text-muted-foreground">
                      {DIVE_PLAN[z.id]}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/60">
                      {z.min.toLocaleString("en-US")} m
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Four figures, each restated with its source further down the page. */}
      <dl
        className="rise mt-16 grid grid-cols-2 gap-y-8 border-t-2 border-border pt-10 md:grid-cols-4"
        style={beat(6)}
      >
        {headlineStats.map((s) => (
          <Stat
            key={s.label}
            value={s.value}
            label={s.label}
            note={s.note}
            signal={s.signal}
          />
        ))}
      </dl>

      <div className="rise mt-12 flex items-center gap-4" style={beat(7)}>
        {/* A mark falling down its rail, rather than a line of muted text
            nobody notices. */}
        <span
          aria-hidden="true"
          className="relative block h-6 w-px bg-border"
        >
          <span
            className="descend absolute -left-[2px] block h-[5px] w-[5px]"
            style={{ background: "var(--signal)" }}
          />
        </span>
        <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70 uppercase">
          Scroll to descend · 0 m → 11,034 m
        </span>
      </div>
    </section>
  );
}
