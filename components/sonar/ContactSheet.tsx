"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/data/types";

export function ContactSheet({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <p className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
            {project.domain} · bearing {project.bearing}° · range{" "}
            {project.range.toLocaleString("en-US")} m
          </p>
          <SheetTitle className="font-display text-2xl">{project.name}</SheetTitle>
          <SheetDescription className="font-serif text-lg leading-relaxed">
            {project.lede}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-8">
          <dl className="mt-4 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-card p-4">
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
                  {m.label}
                </dt>
                <dd className="mt-1 font-mono text-xl tabular-nums">
                  {m.value}
                </dd>
                {m.note && (
                  <dd className="mt-1 font-mono text-[10px] text-muted-foreground">
                    {m.note}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          {project.caveat && (
            <div
              className="mt-6 rounded-lg border p-4"
              style={{ borderColor: "var(--signal)" }}
            >
              <p
                className="font-mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--signal)" }}
              >
                What this does not claim
              </p>
              <p className="font-serif mt-2 text-base leading-relaxed text-muted-foreground">
                {project.caveat}
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge
                key={s}
                variant="secondary"
                className="font-mono text-[10px]"
              >
                {s}
              </Badge>
            ))}
          </div>

          <a
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block font-mono text-sm underline underline-offset-4"
            style={{ color: "var(--signal)" }}
          >
            Read the code and the evaluation →
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
