import { timeline } from "@/data/timeline";

export function CareerLog() {
  return (
    <ol className="max-w-2xl space-y-8 border-l border-border pl-6">
      {timeline.map((t) => (
        <li
          key={t.when + t.title}
          data-timeline-entry={t.when}
          className="relative"
        >
          <span
            aria-hidden="true"
            className="absolute top-2 -left-[1.65rem] h-1.5 w-1.5 rounded-full bg-border"
          />
          <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            {t.when}
          </p>
          <h3 className="mt-1 font-display text-xl">{t.title}</h3>
          <p className="mt-1 font-serif text-base leading-relaxed text-muted-foreground">
            {t.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
