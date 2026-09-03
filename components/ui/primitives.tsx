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

/** A bordered chip. Used in dozens at a time to fill a row with real facts. */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded border border-border bg-card/40 px-2 py-1 font-mono text-[11px] text-foreground/85">
      {children}
    </span>
  );
}

/**
 * Label/value rows with hairline rules — the "spec sheet". Turns scattered
 * biographical facts into one dense, scannable block.
 */
export function SpecSheet({
  rows,
}: {
  rows: { label: string; value: ReactNode }[];
}) {
  return (
    <dl className="divide-y divide-border border-y border-border">
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
  return (
    <div className="divide-y divide-border border-y border-border">
      {groups.map((g) => (
        <div
          key={g.category}
          className="grid gap-3 py-4 sm:grid-cols-[7.5rem_1fr] sm:gap-4"
        >
          <Label className="pt-1">{g.category}</Label>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((i) => (
              <Chip key={i}>{i}</Chip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** A bordered panel with its own label — the unit the instrument columns are built from. */
export function Panel({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-lg border border-border bg-card/35 p-5 ${className}`}
    >
      <header className="mb-4 border-b border-border pb-2">
        <Label>{label}</Label>
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
    <div className="border-l border-border pl-4">
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
