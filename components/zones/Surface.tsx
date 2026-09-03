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

export function Surface() {
  return (
    <section
      id="surface"
      aria-labelledby="surface-heading"
      className="relative flex min-h-[92vh] scroll-mt-16 flex-col justify-center px-6 py-24 md:px-12 lg:pr-[15rem]"
    >
      {/* Availability and location, the two things a recruiter looks for first. */}
      <div className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-3">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-2"
          style={{ background: "var(--signal)" }}
        />
        <Label>{profile.status}</Label>
        <span className="rounded border border-border px-2 py-1 font-mono text-[10px] tracking-[0.2em] uppercase">
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
            Measured <span style={{ color: "var(--signal)" }}>not</span>
            <br />
            Asserted
          </h1>

          <p className="mt-8 max-w-2xl font-serif text-2xl leading-snug text-foreground/85 md:text-3xl">
            {profile.heroLine}
          </p>

          <p className="mt-4 font-mono text-sm text-muted-foreground">
            {profile.name} · {profile.role}
          </p>
        </div>

        <nav
          aria-label="Dive plan"
          className="rounded-lg border border-border bg-card/35 p-5"
        >
          <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <Label>Dive plan</Label>
            <Label>6 zones</Label>
          </div>

          <ol className="divide-y divide-border">
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
      <dl className="mt-16 grid grid-cols-2 gap-y-8 border-t border-border pt-10 md:grid-cols-4">
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

      <p className="mt-10 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        Scroll to descend · 0 m → 11,034 m
      </p>
    </section>
  );
}
