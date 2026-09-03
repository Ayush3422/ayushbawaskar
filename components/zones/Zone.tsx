import type { ZoneId } from "@/lib/depth";
import { PixelRule, Stamp } from "@/components/ui/primitives";

/**
 * Section chrome: a stamped plate number, the zone name at display size, the
 * depth range, and a statement of what the section is for. The plate is
 * inverted rather than set quietly — brutalism stamps its labels.
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
      className={`relative scroll-mt-24 border-t-2 border-border px-6 py-20 md:px-12 md:py-28 lg:pr-[15rem] ${className}`}
    >
      <header className="mb-12 md:mb-16">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Stamp signal>Plate {plate}</Stamp>
          <h2
            id={`${id}-heading`}
            className="font-display text-3xl tracking-[0.16em] uppercase md:text-5xl"
          >
            {label}
          </h2>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {depthLabel}
          </span>
        </div>

        <div className="mt-4">
          <PixelRule />
        </div>

        {lede && (
          <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-foreground/80 md:text-2xl">
            {lede}
          </p>
        )}
      </header>
      {children}
    </section>
  );
}
