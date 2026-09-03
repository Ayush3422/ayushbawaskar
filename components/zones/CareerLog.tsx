import { timeline } from "@/data/timeline";
import { principles } from "@/data/profile";
import { Label, Panel } from "@/components/ui/primitives";

export function CareerLog() {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4 border-b-2 border-border pb-2">
          <Label>Log</Label>
          <Label>{timeline.length} entries</Label>
        </div>

        <ol className="border-l-2 border-border pl-6">
          {timeline.map((t) => (
            <li
              key={t.when + t.title}
              data-timeline-entry={t.when}
              className="relative mb-9 last:mb-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-2 -left-[1.7rem] h-1.5 w-1.5 rounded-full bg-border"
              />
              <Label>{t.when}</Label>
              <h3 className="mt-1 font-display text-xl tracking-wide">
                {t.title}
              </h3>
              <p className="mt-2 font-mono text-sm leading-[1.8] text-muted-foreground">
                {t.detail}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-8 border-t-2 border-border pt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground/70 uppercase">
          Entries appear only where there is a repository, an institution or a
          named event behind them.
        </p>
      </div>

      <div>
        <div className="mb-4 border-b-2 border-border pb-2">
          <Label>Working rules</Label>
        </div>

        <div className="space-y-4">
          {principles.map((p, i) => (
            <Panel key={p.rule} label={`Rule ${String(i + 1).padStart(2, "0")}`}>
              <p className="font-serif text-xl leading-snug text-foreground/90">
                {p.rule}
              </p>
              <p className="mt-3 font-mono text-sm leading-[1.8] text-muted-foreground">
                {p.because}
              </p>
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] uppercase">
                <span className="text-muted-foreground/60">Learned in </span>
                <span style={{ color: "var(--signal)" }}>{p.source}</span>
              </p>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
