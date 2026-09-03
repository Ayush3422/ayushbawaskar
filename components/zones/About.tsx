import { profile } from "@/data/profile";

export function About() {
  return (
    <div className="max-w-2xl space-y-6">
      {profile.about.map((p) => (
        <p
          key={p.slice(0, 24)}
          className="font-serif text-lg leading-relaxed text-muted-foreground"
        >
          {p}
        </p>
      ))}

      <dl className="mt-10 space-y-4 border-t border-border pt-6">
        {profile.education.map((e) => (
          <div key={e.degree}>
            <dt className="text-sm">{e.degree}</dt>
            <dd className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              {e.institution} · {e.period}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
        {profile.interests.map((i) => (
          <li
            key={i}
            className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase"
          >
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
