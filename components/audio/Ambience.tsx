"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

const STORAGE_KEY = "abyss:ambience";

/** Any of these counts as the gesture browsers demand before audio may start. */
const GESTURES = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/**
 * Ambience: the supplied wave recording, routed through a depth-driven lowpass
 * so it muffles as you descend — 4.2 kHz of surf at the surface down to 320 Hz
 * at the trench floor.
 *
 * On by default, but it cannot literally autoplay: every current browser
 * refuses audio that starts without a user gesture, and an attempt is rejected
 * rather than delayed. So it tries immediately, and if refused it arms itself
 * to start on the visitor's first scroll, click or keypress — which on a page
 * whose first instruction is "scroll to descend" is a second or two away.
 *
 * Turning it off is remembered, and a visitor who has turned it off is never
 * asked again.
 */
export function Ambience() {
  const { depth } = useDepth();
  const [on, setOn] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const teardown = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    void ctxRef.current?.close();
    ctxRef.current = null;
    filterRef.current = null;
    masterRef.current = null;
  }, []);

  /**
   * Builds the graph on first call and resumes it on later ones, so a refused
   * attempt can simply be retried on the next gesture without leaking a second
   * AudioContext. Resolves to whether sound is actually playing.
   */
  const start = useCallback(async (): Promise<boolean> => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);
      masterRef.current = master;
      // Ease in, so arriving on the page is not a slap.
      master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 1.8);

      const el = new Audio("/audio/ocean-waves.mp3");
      el.loop = true;
      el.preload = "auto";
      audioRef.current = el;

      const source = ctx.createMediaElementSource(el);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 4200;
      filter.Q.value = 0.7;
      filterRef.current = filter;

      const waterGain = ctx.createGain();
      waterGain.gain.value = 0.9;

      source.connect(filter).connect(waterGain).connect(master);
    }

    const ctx = ctxRef.current;
    const el = audioRef.current;
    if (!ctx || !el) return false;

    try {
      if (ctx.state === "suspended") await ctx.resume();
      await el.play();
      return !el.paused;
    } catch {
      // Refused. The caller will try again on the next gesture.
      return false;
    }
  }, []);

  // On by default, unless this visitor has said otherwise.
  useEffect(() => {
    let optedOut = false;
    try {
      optedOut = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      // Storage unavailable. Treat as no preference.
    }
    if (optedOut) return;

    let settled = false;
    const detach = () => {
      for (const e of GESTURES) window.removeEventListener(e, attempt);
      window.removeEventListener("scroll", attempt);
    };

    async function attempt() {
      if (settled) return;
      const playing = await start();
      if (!playing) return;
      settled = true;
      setOn(true);
      detach();
    }

    void attempt();
    for (const e of GESTURES) {
      window.addEventListener(e, attempt, { passive: true });
    }
    window.addEventListener("scroll", attempt, { passive: true });

    return detach;
  }, [start]);

  // Depth drives the filter while it is running.
  useEffect(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;

    const t = Math.min(depth / MAX_DEPTH, 1);
    filter.frequency.setTargetAtTime(4200 - 3880 * t, ctx.currentTime, 0.5);
  }, [depth]);

  useEffect(() => teardown, [teardown]);

  const toggle = async () => {
    if (on) {
      teardown();
      setOn(false);
      try {
        localStorage.setItem(STORAGE_KEY, "off");
      } catch {
        // Private mode. The toggle still works for this visit.
      }
      return;
    }
    const playing = await start();
    setOn(playing);
    try {
      localStorage.setItem(STORAGE_KEY, "on");
    } catch {
      // As above.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      data-ambience={on ? "on" : "off"}
      aria-pressed={on}
      aria-label={on ? "Turn ambience off" : "Turn ambience on"}
      className="flex items-center gap-2 border-2 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
      style={{
        borderColor: on ? "var(--signal)" : "var(--border)",
        color: on ? "var(--signal)" : "var(--muted-foreground)",
      }}
    >
      <span aria-hidden="true">{on ? "▮▮▮" : "▮▯▯"}</span>
      <span className="hidden sm:inline">Sonar</span>
    </button>
  );
}
