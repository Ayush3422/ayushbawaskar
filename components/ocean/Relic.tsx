"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * A rotating bust built out of the Res Gestae Divi Augustus, drifting behind
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
 * 97 source frames at 13 MB became 49 frames in a 431 KB animated WebP: every
 * other frame at 760px. A full rotation survives the halving; the file size
 * does not. Encoded at 760 rather than 520 so it stays sharp at the size it is
 * actually drawn — upscaling the smaller file left it visibly soft.
 */
export function Relic() {
  const reduced = useReducedMotion();

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
