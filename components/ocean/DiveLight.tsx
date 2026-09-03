"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * A lamp on the cursor that matters more the deeper you are.
 *
 * Purely additive — it lightens, never darkens. Dimming the page so the torch
 * "reveals" would read better in a trailer and worse for anyone trying to
 * read, and the page has to stay legible with a pointer parked in a corner.
 */
export function DiveLight() {
  const reduced = useReducedMotion();

  useEffect(() => {
    // A lamp that follows a cursor is meaningless without one.
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement.style;
    let raf = 0;
    let px = -1;
    let py = -1;

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.setProperty("--lamp-x", `${px}px`);
        root.setProperty("--lamp-y", `${py}px`);
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      root.removeProperty("--lamp-x");
      root.removeProperty("--lamp-y");
    };
  }, [reduced]);

  /*
   * Always rendered, never gated on state. The lamp defaults to -999px, so
   * with no pointer listener attached it simply sits off-screen — which avoids
   * a mount-time setState purely to decide whether to exist.
   */
  return (
    <div
      aria-hidden="true"
      data-dive-light
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        mixBlendMode: "screen",
        opacity: "var(--lamp-strength)",
        background:
          "radial-gradient(circle 320px at var(--lamp-x, -999px) var(--lamp-y, -999px), rgba(150,205,215,0.30) 0%, rgba(120,180,195,0.13) 38%, rgba(0,0,0,0) 72%)",
      }}
    />
  );
}
