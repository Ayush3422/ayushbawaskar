import { profile, colophon } from "@/data/profile";
import { Label, Panel, SpecSheet } from "@/components/ui/primitives";

export function Contact() {
  return (
    <div className="space-y-16">
      <h3 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight uppercase">
        Let&apos;s <span style={{ color: "var(--signal)" }}>talk</span>
      </h3>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
        <div>
          <p className="font-serif text-2xl leading-snug text-foreground/85">
            Open to internships and graduate roles in applied ML, data, and
            backend engineering — and to anyone who wants to argue about
            evaluation design.
          </p>

          <div className="mt-10">
            <div className="mb-4">
              <Label>Reach me</Label>
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {profile.links.map((l) => (
                <li
                  key={l.href}
                  className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 py-3"
                >
                  <Label>{l.label}</Label>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    className="font-mono text-sm underline underline-offset-4"
                    style={{ color: "var(--signal)" }}
                  >
                    {l.href.replace(/^mailto:/, "").replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <div className="mb-4">
              <Label>Availability</Label>
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
          </div>
        </div>

        <div className="space-y-6">
          <Panel label="Colophon">
            <p className="mb-4 font-mono text-sm leading-[1.85] text-muted-foreground">
              The ocean behind this page is a real inverse-FFT wave simulation
              running on your GPU, not a video. If it is not moving, your
              browser refused the float render targets it needs — the page is
              built to lose it without losing anything you came to read.
            </p>
            <dl className="divide-y divide-border border-t border-border">
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

          <Panel label="Note on the numbers">
            <p className="font-mono text-sm leading-[1.85] text-muted-foreground">
              Every figure on this site was copied from the README of the
              repository it links to, and produced there by a script. Nothing is
              rounded for effect. Where a project has a limitation, it is on the
              card, in the same size type as the result.
            </p>
          </Panel>
        </div>
      </div>

      <p className="border-t border-border pt-8 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
        11,034 m · Challenger Deep · you have reached the bottom
      </p>
    </div>
  );
}
