"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { depthSignal } from "@/lib/depthSignal";

const MAX_PARTICLES = 220;

/**
 * Particulate drifting upward past the reader, to sell descent. Density reads
 * --snow-density, which the depth provider peaks in the twilight zone.
 * Rendered only as a decorative layer; disabled entirely under reduced motion.
 */
export function MarineSnow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = 1;

    const resize = () => {
      canvas.width = Math.max(Math.floor(window.innerWidth * dpr), 1);
      canvas.height = Math.max(Math.floor(window.innerHeight * dpr), 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: MAX_PARTICLES }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      v: Math.random() * 0.00022 + 0.00006,
    }));

    const draw = () => {
      const density = depthSignal.snow;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const visible = Math.floor(MAX_PARTICLES * (density || 0));
      for (let i = 0; i < visible; i++) {
        const p = particles[i];
        p.y -= p.v;
        if (p.y < 0) {
          p.y = 1;
          p.x = Math.random();
        }
        ctx.beginPath();
        ctx.arc(
          p.x * canvas.width,
          p.y * canvas.height,
          p.r * dpr,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(250,250,250,${0.05 + p.r * 0.05})`;
        ctx.fill();
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
      data-marine-snow
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[6]"
    />
  );
}
