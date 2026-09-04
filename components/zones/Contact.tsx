import { profile, colophon } from "@/data/profile";
import { Label, Panel, PixelRule, SpecSheet, Stamp } from "@/components/ui/primitives";
import { iconFor } from "@/components/ui/icons";

export function Contact() {
  return (
    <div className="space-y-14">
      <div className="grid gap-10 xl:grid-cols-[1fr_1fr] xl:items-end xl:gap-20">
        <div>
          <h3 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-tight uppercase">
            Let&apos;s <span style={{ color: "var(--signal)" }}>talk</span>
          </h3>
          <p className="mt-6 max-w-xl font-serif text-2xl leading-snug text-foreground/85">
            Open to internships and graduate roles in applied ML, data, and
            backend engineering — and to anyone who wants to argue about
            evaluation design.
          </p>
        </div>

        <div className="hard-shadow relative border-2 border-border bg-card/55 p-5">
          <div className="mb-4 flex items-center gap-3">
            <Stamp>Dive complete</Stamp>
            <div className="flex-1">
              <PixelRule />
            </div>
            <Label>11,034 m</Label>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {[
              { v: "11,034", l: "Metres descended" },
              { v: "6", l: "Zones traversed" },
              { v: "5", l: "Contacts inspected" },
              { v: "1,104", l: "Bar at the floor" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-mono text-xl tabular-nums">{s.v}</div>
                <div className="mt-1">
                  <Label>{s.l}</Label>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/*
       * The reason the page exists, so it is set at size and framed in the
       * accent. Previously these were 14px mono rows in an unframed list —
       * quieter than the colophon beside them, which is backwards.
       */}
      <div className="hard-shadow-signal border-2 border-[var(--signal)] bg-card/60 p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <Stamp signal>Reach me</Stamp>
          <div className="flex-1">
            <PixelRule signal />
          </div>
        </div>

        <ul className="divide-y-2 divide-border border-y-2 border-border">
          {profile.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                className="group grid grid-cols-[6rem_1fr_auto] items-center gap-4 py-4 transition-colors hover:bg-card/60 md:grid-cols-[9rem_1fr_auto]"
              >
                <Label>{l.label}</Label>
                <span className="truncate font-mono text-base transition-colors group-hover:text-[var(--signal)] md:text-xl">
                  {l.href.replace(/^mailto:/, "").replace(/^https?:\/\//, "")}
                </span>
                <span
                  className="font-mono text-sm opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "var(--signal)" }}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Stamp>Availability</Stamp>
            <div className="flex-1">
              <PixelRule />
            </div>
          </div>
          <SpecSheet
            rows={[
              { label: "Status", value: "Open to internships and graduate roles" },
              { label: "Based in", value: profile.location },
              { label: "Interested in", value: "Applied ML · data · backend" },
              { label: "Graduating", value: "2028 — BTech CSE (AI-ML)" },
              { label: "Notice", value: "Available for summer and part-time" },
            ]}
          />

          <Panel label="Note on the numbers" className="mt-8">
            <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
              Every figure on this site was copied from the README of the
              repository it links to, and produced there by a script. Nothing is
              rounded for effect. Where a project has a limitation, it is on the
              card, in the same size type as the result.
            </p>
          </Panel>
        </div>

        <Panel label="Colophon">
          <p className="mb-4 font-mono text-sm leading-[1.85] text-muted-foreground">
            The ocean behind this page is a real inverse-FFT wave simulation
            running on your GPU, not a video. If it is not moving, your browser
            refused the float render targets it needs — the page is built to
            lose it without losing anything you came to read.
          </p>
          <dl className="divide-y-2 divide-border border-t-2 border-border">
            {colophon.map((c) => (
              <div key={c.label} className="py-2.5">
                <dt>
                  <Label>{c.label}</Label>
                </dt>
                <dd className="mt-1 font-mono text-[13px] text-foreground/85">
                  {c.value}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {/*
       * The page opens at 120px type; before this it closed at 10px muted
       * text, so it trailed off rather than ending. A closing band mirrors the
       * statement band in Sunlight and gives the descent a floor.
       */}
      <div className="dither relative border-y-2 border-border py-10">
        <div className="corner-ticks relative px-4 md:px-8">
          <p className="max-w-4xl font-serif text-3xl leading-[1.15] md:text-5xl">
            Check the repositories. That is what they are for.
          </p>
        </div>
      </div>

      <div className="border-t-2 border-border pt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-end">
          <div>
            <p className="font-display text-3xl tracking-[0.22em] md:text-4xl">
              AYUSH<span style={{ color: "var(--signal)" }}>{" // "}</span>ABYSS
            </p>
            <p className="mt-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
              11,034 m · Challenger Deep · you have reached the bottom
            </p>
          </div>

          {/* The links repeat here because the reader has finished and this is
              where they decide whether to act. */}
          <ul className="flex flex-wrap gap-2">
            {profile.links.map((l) => {
              const Icon = iconFor(l.label);
              const target = l.href
                .replace(/^mailto:/, "")
                .replace(/^https?:\/\//, "");
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    /* Icon-only, so the name has to be carried by the label —
                       otherwise this reads as a bare link to a screen reader. */
                    aria-label={`${l.label} — ${target}`}
                    title={`${l.label} — ${target}`}
                    className="flex h-10 w-10 items-center justify-center border-2 border-border transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
                    style={{ color: "var(--signal)" }}
                  >
                    {Icon ? (
                      <Icon />
                    ) : (
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                        {l.label.slice(0, 2)}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#surface"
            className="group flex items-center gap-3 border-2 border-border bg-card/80 px-4 py-3 font-mono text-[10px] tracking-[0.25em] uppercase backdrop-blur transition-colors hover:border-[var(--signal)]"
            style={{ color: "var(--signal)" }}
          >
            <span aria-hidden="true">▴</span>
            Ascend to the surface
          </a>
        </div>

        <div className="mt-8">
          <PixelRule />
        </div>
      </div>
    </div>
  );
}
