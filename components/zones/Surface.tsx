import { profile, headlineStats } from "@/data/profile";
import { Label, Stat } from "@/components/ui/primitives";

export function Surface() {
  return (
    <section
      id="surface"
      aria-labelledby="surface-heading"
      className="relative flex min-h-[92vh] scroll-mt-16 flex-col justify-center px-6 py-24 md:px-12"
    >
      {/* Availability and location, the two things a recruiter looks for first. */}
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3">
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

      <h1
        id="surface-heading"
        className="font-display text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] tracking-tight uppercase"
      >
        Measured{" "}
        <span style={{ color: "var(--signal)" }}>not</span>
        <br />
        Asserted
      </h1>

      <p className="mt-8 max-w-2xl font-serif text-2xl leading-snug text-foreground/85 md:text-3xl">
        {profile.heroLine}
      </p>

      <p className="mt-4 font-mono text-sm text-muted-foreground">
        {profile.name} · {profile.role}
      </p>

      {/* Four figures, each restated with its source further down the page. */}
      <dl className="mt-14 grid grid-cols-2 gap-y-8 md:grid-cols-4">
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

      <p className="mt-16 font-mono text-[10px] tracking-[0.25em] text-muted-foreground/60 uppercase">
        Scroll to descend · 0 m → 11,034 m
      </p>
    </section>
  );
}
