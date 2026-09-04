"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

const STORAGE_KEY = "abyss:ambience";

/**
 * Ambience: the supplied wave recording, and nothing else. An earlier pass
 * layered a synthesised pressure drone and sonar returns over it; those are
 * gone.
 *
 * It is still routed through a depth-driven lowpass, which is processing of
 * the same recording rather than another sound: it muffles as you descend,
 * 4.2 kHz of surf at the surface down to 320 Hz at the floor.
 *
 * The file is 4.5 MB and is fetched only when the toggle is switched on, so a
 * visitor who never touches it never pays for it.
 *
 * It never autoplays. Browsers block that, and a page that makes noise at a
 * stranger uninvited deserves to be closed.
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

  const start = useCallback(() => {
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
    // Ease in, so switching it on is not a slap.
    master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 1.6);

    // --- water: the recording, through a lowpass that closes with depth ----
    const el = new Audio("/audio/ocean-waves.mp3");
    el.loop = true;
    el.preload = "auto";
    el.crossOrigin = "anonymous";
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
    // Autoplay policy is satisfied: this only ever runs from a click.
    void el.play().catch(() => {
      // Blocked anyway on some setups. The drone and pings still work.
    });

  }, []);

  // Depth drives the filter while it is running.
  useEffect(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;

    // Water muffles as it deepens: 4.2 kHz of surf at the surface down to
    // 320 Hz of rumble at the floor.
    const t = Math.min(depth / MAX_DEPTH, 1);
    filter.frequency.setTargetAtTime(4200 - 3880 * t, ctx.currentTime, 0.5);
  }, [depth]);

  useEffect(() => teardown, [teardown]);

  const toggle = () => {
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
    start();
    setOn(true);
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
