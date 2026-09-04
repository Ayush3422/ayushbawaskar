"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { depthSignal } from "@/lib/depthSignal";

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
    // Decorative and soft-edged: rendering it at 2x buys nothing and doubles
    // the pixels cleared and filled every frame.
    const dpr = 1;

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

    // One soft halo with a bright core, rasterised once.
    const sprite = document.createElement("canvas");
    sprite.width = 64;
    sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(214, 250, 244, 1)");
    grad.addColorStop(0.18, "rgba(87, 207, 192, 0.72)");
    grad.addColorStop(1, "rgba(87, 207, 192, 0)");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);

    const draw = (now: number) => {
      const presence = depthSignal.hadal;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (presence > 0.01) {
        ctx.globalCompositeOperation = "lighter";
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
          const size = m.r * 14;

          // The sprite is drawn once at init and stamped here. Building a
          // radial gradient per mote per frame meant ninety gradient objects
          // allocated sixty times a second, which is most of what this layer
          // used to cost.
          ctx.globalAlpha = alpha;
          ctx.drawImage(sprite, px - size / 2, py - size / 2, size, size);
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = "source-over";
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
