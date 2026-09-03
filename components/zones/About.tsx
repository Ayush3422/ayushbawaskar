import { profile, dossier } from "@/data/profile";
import { Label, SpecSheet } from "@/components/ui/primitives";

/**
 * Asymmetric two-column body: argument on the left, instrument panel on the
 * right. The prose carries the reasoning, the spec sheet carries the facts,
 * and the matrix carries the inventory — so no column runs out of content
 * before the others do.
 */
export function About() {
  return (
    <div>
      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div>
          <div className="mb-5">
            <Label>How I work</Label>
          </div>
          {profile.about.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="mb-5 font-mono text-sm leading-[1.85] text-muted-foreground"
            >
              {p}
            </p>
          ))}
        </div>

        <aside className="space-y-10">
          <div>
            <div className="mb-4">
              <Label>The dossier</Label>
            </div>
            <SpecSheet
              rows={dossier.map((d) => ({ label: d.label, value: d.value }))}
            />
          </div>

          <div>
            <div className="mb-4">
              <Label>Education</Label>
            </div>
            <ul className="divide-y divide-border border-y border-border">
              {profile.education.map((e) => (
                <li key={e.degree} className="py-3">
                  <p className="text-sm">{e.degree}</p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                    {e.institution} · {e.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

    </div>
  );
}
