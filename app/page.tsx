import { DepthProvider } from "@/components/depth/DepthProvider";
import { DepthNav } from "@/components/nav/DepthNav";
import { DiveComputer } from "@/components/hud/DiveComputer";
import { OceanLayer } from "@/components/ocean/OceanLayer";
import { MarineSnow } from "@/components/ocean/MarineSnow";
import { Bioluminescence } from "@/components/ocean/Bioluminescence";
import { Caustics } from "@/components/ocean/Caustics";
import { DiveLight } from "@/components/ocean/DiveLight";
import { TrenchFloor } from "@/components/ocean/TrenchFloor";
import { Zone } from "@/components/zones/Zone";
import { Surface } from "@/components/zones/Surface";
import { About } from "@/components/zones/About";
import { Work } from "@/components/zones/Work";
import { Capability } from "@/components/zones/Capability";
import { CareerLog } from "@/components/zones/CareerLog";
import { Contact } from "@/components/zones/Contact";

export default function Page() {
  return (
    <DepthProvider>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <OceanLayer />
      <MarineSnow />
      <Bioluminescence />
      <Caustics />
      <DiveLight />

      {/*
       * Near-surface scrim. It has to be fixed and full-viewport like the
       * ocean it sits over — bounded to the hero section it produced a hard
       * brightness step at the section edge, where unscrimmed water resumed.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[7]"
        style={{
          opacity: "var(--surface-scrim)",
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 45%, rgba(10,10,10,0.8) 100%)",
        }}
      />

      {/* Light falling off with depth. Alpha is written by DepthProvider. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-[5] bg-black"
        style={{ opacity: "var(--depth-veil)" }}
      />

      <DepthNav />
      <DiveComputer />

      <main id="main">
        <Surface />

        <Zone
          id="sunlight"
          plate="01"
          label="Sunlight"
          depthLabel="40 — 200 m"
          lede="Light still reaches here, so this is where the claims get made — and where you should start checking them."
        >
          <About />
        </Zone>

        <Zone
          id="twilight"
          plate="02"
          label="Twilight"
          depthLabel="200 — 1,000 m"
          lede="Bearing is the domain. Range is how deep the work goes — the same scale as the depth you are at. Deeper contacts took more to get right."
        >
          <Work />
        </Zone>

        <Zone
          id="midnight"
          plate="03"
          label="Midnight"
          depthLabel="1,000 — 4,000 m"
          lede="Competence plotted against evidence rather than confidence. Every marker names the project that put it there."
        >
          <Capability />
        </Zone>

        <Zone
          id="abyssal"
          plate="04"
          label="Abyssal"
          depthLabel="4,000 — 6,000 m"
          lede="What happened, in order — and the working rules each piece of it taught."
        >
          <CareerLog />
        </Zone>

        <Zone
          id="hadal"
          plate="05"
          label="Hadal"
          depthLabel="6,000 — 11,034 m"
          lede="The bottom of the trench. Nothing below this."
        >
          <TrenchFloor />
          <Contact />
        </Zone>
      </main>
    </DepthProvider>
  );
}
