import { profile, headlineStats } from "@/data/profile";
import { Label, Stat } from "@/components/ui/primitives";
import { TrenchProfile } from "@/components/zones/TrenchProfile";

/** Staggered entrance, in seconds. */
const beat = (n: number) => ({ animationDelay: `${n * 0.09}s` });

export function Surface() {
  return (
    <section
      id="surface"
      aria-labelledby="surface-heading"
      className="relative flex min-h-[92vh] scroll-mt-24 flex-col justify-center px-6 py-24 md:px-12 lg:pr-[15rem]"
    >
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

        <div className="rise" style={beat(5)}>
          <TrenchProfile />
        </div>
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

    </section>
  );
}
