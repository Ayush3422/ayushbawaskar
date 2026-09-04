"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { depthSignal } from "@/lib/depthSignal";

/** Start fetching a little before it is due to appear at 200 m. */
const PRELOAD_DEPTH = 120;

/**
 * A rotating bust built out of the Res Gestae Divi Augusti, drifting behind
 * the middle of the descent.
 *
 * One fixed layer rather than three copies. It is wanted in Twilight, Midnight
 * and Abyssal, but mounting it in each section would run three animated images
 * at once, all decoding whether or not they are on screen. Instead its opacity
 * is driven by depth: it surfaces past 200 m, holds through the dark zones and
 * has dissolved before the trench floor.
 *
 * mix-blend-mode: screen is what merges it. The source is white text on solid
 * black, so screen drops the black entirely and leaves only the lettering — no
 * visible frame, no box, just the sculpture suspended in the water.
 *
 * All 97 source frames at 25fps, 760px, in a 795 KB animated WebP. An earlier
 * pass dropped every other frame to halve the file, which put the rotation at
 * 12.5fps and made it judder — the saving was not worth the only thing this
 * asset does. It is instead deferred until the reader is near the depth it
 * appears at, so anyone who never leaves the hero never fetches it.
 */
export function Relic() {
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    if (near) return;

    const check = () => {
      if (depthSignal.depth >= PRELOAD_DEPTH) {
        // Latched: once fetched it stays, so drifting back up cannot unmount
        // it and force the browser to load it again.
        setNear(true);
        return;
      }
      raf.current = requestAnimationFrame(check);
    };
    raf.current = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf.current);
  }, [near]);

  if (!near) return null;

  return (
    <div
      aria-hidden="true"
      data-relic
      className="pointer-events-none fixed inset-0 -z-[3] flex items-center justify-center overflow-hidden"
      style={{ opacity: "var(--relic)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- an animated
          WebP must not go through the image optimiser, which would flatten it
          to a single frame. */}
      <img
        src={reduced ? "/media/bust-still.webp" : "/media/bust.webp"}
        alt=""
        width={760}
        height={743}
        decoding="async"
        className="h-auto w-[min(104vw,68rem)] max-w-none"
        style={{
          mixBlendMode: "screen",
          // Dissolve the frame's own edges. Screen blend shows every non-black
          // pixel, so without this the image announces its own rectangle.
          maskImage:
            "radial-gradient(ellipse 68% 62% at 50% 50%, #000 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 68% 62% at 50% 50%, #000 55%, transparent 100%)",
        }}
      />
    </div>
  );
}
