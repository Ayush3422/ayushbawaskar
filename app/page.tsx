import { DepthProvider } from "@/components/depth/DepthProvider";
import { DepthNav } from "@/components/nav/DepthNav";
import { OceanFallback } from "@/components/ocean/OceanFallback";
import { Zone } from "@/components/zones/Zone";
import { profile } from "@/data/profile";

export default function Page() {
  return (
    <DepthProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <OceanFallback />
      </div>

      {/* Light falling off with depth. Alpha is written by DepthProvider. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[5] bg-black"
        style={{ opacity: "var(--depth-veil)" }}
      />

      <DepthNav />

      <main id="main">
        <Zone id="surface" label="Surface" depthLabel="0 — 40 m">
          <h1 className="max-w-4xl text-4xl leading-tight font-semibold md:text-6xl">
            {profile.heroLine}
          </h1>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            {profile.name} · {profile.role}
          </p>
        </Zone>

        <Zone id="sunlight" label="Sunlight" depthLabel="40 — 200 m" />
        <Zone id="twilight" label="Twilight" depthLabel="200 — 1,000 m" />
        <Zone id="midnight" label="Midnight" depthLabel="1,000 — 4,000 m" />
        <Zone id="abyssal" label="Abyssal" depthLabel="4,000 — 6,000 m" />
        <Zone id="hadal" label="Hadal" depthLabel="6,000 — 11,034 m" />
      </main>
    </DepthProvider>
  );
}
