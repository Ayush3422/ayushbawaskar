import { timeline } from "@/data/timeline";
import { principles } from "@/data/profile";
import { Label, Panel, PixelRule, Stamp } from "@/components/ui/primitives";

export function CareerLog() {
  const shipped = timeline.reduce(
    (n, t) => n + (t.artifacts?.length ?? 0),
    0,
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      {/* The log gets the same frame as the rules beside it; unframed it read
          as loose text next to a stack of panels. */}
      <div className="hard-shadow border-2 border-border bg-card/45 p-5">
        <div className="mb-5 flex items-center gap-3">
          <Stamp>Log</Stamp>
          <div className="flex-1">
            <PixelRule />
          </div>
          <Label>{timeline.length} entries</Label>
        </div>

        <ol>
          {timeline.map((t, i) => (
            <li
              key={t.when + t.title}
              data-timeline-entry={t.when}
              className="grid grid-cols-[2.25rem_1fr] gap-4 border-b-2 border-border py-5 first:pt-0 last:border-b-0 last:pb-0"
            >
              {/* A stamped index rather than a dot — the log is a record, so
                  its entries are numbered. */}
              <span className="pt-1">
                <Stamp>{String(i + 1).padStart(2, "0")}</Stamp>
              </span>

              <div>
                <Label>{t.when}</Label>
                <h3 className="mt-1 font-display text-xl tracking-wide">
                  {t.title}
                </h3>
                <p className="mt-2 font-mono text-sm leading-[1.8] text-muted-foreground">
                  {t.detail}
                </p>

                {t.artifacts && (
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <Label>Produced</Label>
                    {t.artifacts.map((a) => (
                      <a
                        key={a.url}
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="border-2 border-border px-2 py-1 font-mono text-[11px] transition-colors hover:border-[var(--signal)]"
                        style={{ color: "var(--signal)" }}
                      >
                        {a.name} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>

        <dl className="mt-5 grid grid-cols-3 gap-4 border-t-2 border-border pt-4">
          <div>
            <dt>
              <Label>Span</Label>
            </dt>
            <dd className="mt-1 font-mono text-lg tabular-nums">2 yrs</dd>
          </div>
          <div>
            <dt>
              <Label>Shipped</Label>
            </dt>
            <dd className="mt-1 font-mono text-lg tabular-nums">{shipped}</dd>
          </div>
          <div>
            <dt>
              <Label>Graduating</Label>
            </dt>
            <dd className="mt-1 font-mono text-lg tabular-nums">2028</dd>
          </div>
        </dl>

        <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-muted-foreground/70 uppercase">
          Entries appear only where there is a repository, an institution or a
          named event behind them.
        </p>
      </div>

      <div>
        <div className="mb-5 flex items-center gap-3">
          <Stamp>Working rules</Stamp>
          <div className="flex-1">
            <PixelRule />
          </div>
          <Label>{principles.length} rules</Label>
        </div>

        <div className="space-y-4">
          {principles.map((p, i) => (
            <Panel
              key={p.rule}
              label={`Rule ${String(i + 1).padStart(2, "0")}`}
              signal={i === 0}
            >
              <p className="font-serif text-xl leading-snug text-foreground/90">
                {p.rule}
              </p>
              <p className="mt-3 font-mono text-sm leading-[1.8] text-muted-foreground">
                {p.because}
              </p>
              <p className="mt-3 border-t-2 border-border pt-3 font-mono text-[10px] tracking-[0.2em] uppercase">
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
