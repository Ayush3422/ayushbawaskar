import type { ReactNode } from "react";

/**
 * Small mono uppercase label. The workhorse of the layout: it labels every
 * panel, row and column so nothing floats unexplained.
 */
export function Label({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[10px] tracking-[0.22em] text-muted-foreground uppercase ${className}`}
    >
      {children}
    </span>
  );
}

/** A hard-edged chip. Used in dozens at a time to fill a row with real facts. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-border bg-card/60 px-2 py-1 font-mono text-[11px] text-foreground/85 transition-colors hover:border-[var(--signal)] hover:text-foreground">
      {children}
    </span>
  );
}

/** A rule made of squares rather than a hairline. */
export function PixelRule({ signal = false }: { signal?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={signal ? "pixel-rule-signal" : "pixel-rule"}
    />
  );
}

/**
 * Inverted solid block. Used for plate numbers and section markers — the
 * brutalist move of stamping a label rather than setting it quietly.
 */
export function Stamp({
  children,
  signal = false,
}: {
  children: ReactNode;
  signal?: boolean;
}) {
  return (
    <span
      className="inline-block px-2.5 py-1 font-mono text-[10px] tracking-[0.22em] uppercase"
      style={
        signal
          ? { background: "var(--signal)", color: "#0a0a0a" }
          : { background: "var(--foreground)", color: "#0a0a0a" }
      }
    >
      {children}
    </span>
  );
}

/**
 * Label/value rows with heavy rules — the "spec sheet". Turns scattered
 * biographical facts into one dense, scannable block.
 */
export function SpecSheet({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="divide-y-2 divide-border border-y-2 border-border">
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-[7.5rem_1fr] items-baseline gap-4 py-3"
        >
          <dt>
            <Label>{r.label}</Label>
          </dt>
          <dd className="font-mono text-sm text-foreground">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Category label on the left, a wrapped row of chips on the right. Reads as
 * an inventory rather than a list, and fills the full column width.
 */
export function TagMatrix({
  groups,
}: {
  groups: { category: string; items: string[] }[];
}) {
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const widest = Math.max(...groups.map((g) => g.items.length));

  return (
    <div className="divide-y-2 divide-border border-y-2 border-border">
      {groups.map((g) => (
        <div
          key={g.category}
          className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr_5.5rem] sm:items-start sm:gap-5"
        >
          <Label className="pt-1.5">{g.category}</Label>

          <div className="flex flex-wrap gap-1.5">
            {g.items.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </div>

          {/*
           * Count and proportion. Short rows previously trailed off into a
           * thousand pixels of nothing; this closes the row and says something
           * about it at the same time.
           */}
          <div className="hidden pt-1.5 sm:block">
            <div className="flex items-center justify-end gap-2">
              <span
                aria-hidden="true"
                className="h-[2px] bg-border"
                style={{ width: `${(g.items.length / widest) * 2.5}rem` }}
              />
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {String(g.items.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      ))}

      <div className="grid gap-3 py-4 sm:grid-cols-[8rem_1fr_5.5rem] sm:gap-5">
        <Label>Total</Label>
        <p className="font-mono text-[11px] leading-relaxed text-muted-foreground/70">
          The inventory is everything reached for. The sounding line above is
          only what a project pushed hard enough to prove — which is why Git and
          an editor appear here and not there.
        </p>
        <span className="hidden text-right font-mono text-[11px] tabular-nums sm:block">
          {total}
        </span>
      </div>
    </div>
  );
}

/**
 * A bordered panel with its own stamped label. 2px border and a solid offset
 * block behind it — no blur, no alpha, just a second rectangle.
 */
export function Panel({
  label,
  children,
  className = "",
  signal = false,
  ticks = false,
}: {
  label: string;
  children: ReactNode;
  className?: string;
  signal?: boolean;
  ticks?: boolean;
}) {
  return (
    <section
      className={`relative border-2 border-border bg-card/55 p-5 ${
        signal ? "hard-shadow-signal" : "hard-shadow"
      } ${ticks ? "corner-ticks" : ""} ${className}`}
    >
      <header className="mb-4 flex items-center gap-3">
        <Stamp signal={signal}>{label}</Stamp>
        <div className="flex-1">
          <PixelRule signal={signal} />
        </div>
      </header>
      {children}
    </section>
  );
}

/** One large figure with its caption. Used in strips of three or four. */
export function Stat({
  value,
  label,
  note,
  signal = false,
}: {
  value: string;
  label: string;
  note?: string;
  signal?: boolean;
}) {
  return (
    <div className="border-l-2 border-border pl-4">
      <div
        className="font-mono text-2xl tabular-nums md:text-3xl"
        style={signal ? { color: "var(--signal)" } : undefined}
      >
        {value}
      </div>
      <div className="mt-1">
        <Label>{label}</Label>
      </div>
      {note && (
        <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
          {note}
        </p>
      )}
    </div>
  );
}
