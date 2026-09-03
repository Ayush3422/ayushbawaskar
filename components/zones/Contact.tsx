import { profile } from "@/data/profile";

export function Contact() {
  return (
    <div className="max-w-2xl">
      <p className="font-serif text-2xl leading-snug md:text-3xl">
        Open to internships and graduate roles in applied ML, data, and backend
        engineering.
      </p>

      <ul className="mt-10 space-y-3">
        {profile.links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noreferrer" : undefined}
              className="font-mono text-sm underline underline-offset-4"
              style={{ color: "var(--signal)" }}
            >
              {l.href.replace(/^mailto:/, "").replace(/^https:\/\//, "")}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-16 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
        11,034 m · Challenger Deep · you have reached the bottom
      </p>
    </div>
  );
}
