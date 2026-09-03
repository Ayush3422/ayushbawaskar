"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const COUNT = 90;

/**
 * Sparse points of cold light drifting upward. Below 6,000 m this is the only
 * light there is, which is why it is the one place on the page allowed a
 * second colour. Fades in with --hadal-presence, so it costs nothing visually
 * until the reader is deep enough for it to make sense.
 */
export function Bioluminescence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.max(Math.floor(window.innerWidth * dpr), 1);
      canvas.height = Math.max(Math.floor(window.innerHeight * dpr), 1);
    };
    resize();
    window.addEventListener("resize", resize);

    // Randomised on the client only — this never renders on the server, so
    // there is no markup to mismatch.
    const motes = Array.from({ length: COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.6 + 0.5,
      v: Math.random() * 0.00012 + 0.00003,
      // Each mote breathes at its own rate and phase, so the field never
      // pulses in unison.
      period: Math.random() * 5200 + 2600,
      phase: Math.random() * Math.PI * 2,
    }));

    const draw = (now: number) => {
      const presence = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--hadal-presence",
        ) || "0",
      );

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (presence > 0.01) {
        for (const m of motes) {
          m.y -= m.v;
          if (m.y < 0) {
            m.y = 1;
            m.x = Math.random();
          }

          const pulse =
            0.35 + 0.65 * (0.5 + 0.5 * Math.sin((now / m.period) * Math.PI * 2 + m.phase));
          const alpha = pulse * presence * 0.55;

          const px = m.x * canvas.width;
          const py = m.y * canvas.height;
          const rad = m.r * dpr;

          // A soft halo around a bright core, which is what a point of light
          // in water actually looks like.
          const grad = ctx.createRadialGradient(px, py, 0, px, py, rad * 6);
          grad.addColorStop(0, `rgba(87, 207, 192, ${alpha})`);
          grad.addColorStop(1, "rgba(87, 207, 192, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(px, py, rad * 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(190, 245, 238, ${alpha * 0.9})`;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      data-biolum
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[6]"
    />
  );
}
