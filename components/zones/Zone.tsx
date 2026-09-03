import type { ZoneId } from "@/lib/depth";

export function Zone({
  id,
  label,
  depthLabel,
  children,
  className = "",
}: {
  id: ZoneId;
  label: string;
  depthLabel: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative min-h-screen scroll-mt-16 px-6 py-24 md:px-12 ${className}`}
    >
      <header className="mb-12 flex items-baseline gap-4 border-b border-border pb-4">
        <h2
          id={`${id}-heading`}
          className="font-display text-base font-medium tracking-[0.3em] uppercase"
        >
          {label}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {depthLabel}
        </span>
      </header>
      {children}
    </section>
  );
}
