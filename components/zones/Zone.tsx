import type { ZoneId } from "@/lib/depth";
import { Label } from "@/components/ui/primitives";

/**
 * Section chrome: plate number, zone name in the display face, depth range,
 * and a one-line statement of what the section is for. The header alone
 * occupies the top of the viewport with information rather than air.
 */
export function Zone({
  id,
  plate,
  label,
  depthLabel,
  lede,
  children,
  className = "",
}: {
  id: ZoneId;
  plate: string;
  label: string;
  depthLabel: string;
  lede?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative scroll-mt-16 border-t border-border/70 px-6 py-20 md:px-12 md:py-28 ${className}`}
    >
      <header className="mb-12 md:mb-16">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-border pb-4">
          <Label className="shrink-0">Plate {plate}</Label>
          <h2
            id={`${id}-heading`}
            className="font-display text-2xl tracking-[0.18em] uppercase md:text-3xl"
          >
            {label}
          </h2>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {depthLabel}
          </span>
        </div>
        {lede && (
          <p className="mt-5 max-w-3xl font-serif text-xl leading-relaxed text-foreground/80 md:text-2xl">
            {lede}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
