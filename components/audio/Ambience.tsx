"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

const STORAGE_KEY = "abyss:ambience";

/**
 * Ambience: a recording of ocean waves for the water, plus a synthesised drone
 * for pressure and an occasional sonar return.
 *
 * The recording is routed through the same depth-driven lowpass the noise bed
 * used, so it still muffles as you descend — a flat loop would sound identical
 * at 40 m and 11,000 m, which would waste the one thing this page can do that
 * a music player cannot.
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
  const droneRef = useRef<OscillatorNode | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const pingRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const depthRef = useRef(0);

  const teardown = useCallback(() => {
    if (pingRef.current) window.clearTimeout(pingRef.current);
    pingRef.current = null;
    droneRef.current?.stop();
    droneRef.current = null;
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

    // --- pressure: a low drone that sinks with you ------------------------
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 62;
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.16;
    drone.connect(droneGain).connect(master);
    drone.start();
    droneRef.current = drone;

    // --- the occasional return --------------------------------------------
    const schedule = () => {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      // Deeper pings come back lower, as a longer sound path would.
      osc.frequency.setValueAtTime(
        880 - 420 * Math.min(depthRef.current / MAX_DEPTH, 1),
        t,
      );
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
      osc.connect(g).connect(master);
      osc.start(t);
      osc.stop(t + 1.6);
      pingRef.current = window.setTimeout(schedule, 7000 + Math.random() * 9000);
    };
    pingRef.current = window.setTimeout(schedule, 3500);
  }, []);

  // Depth drives the filter and the drone while it is running.
  useEffect(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    const drone = droneRef.current;
    if (!ctx || !filter || !drone) return;

    depthRef.current = depth;
    const t = Math.min(depth / MAX_DEPTH, 1);
    // Water muffles as it deepens. A recording carries real high end, so the
    // sweep runs much further than the synthetic bed needed: 4.2 kHz of surf at
    // the surface down to 320 Hz of muffled rumble at the floor.
    filter.frequency.setTargetAtTime(4200 - 3880 * t, ctx.currentTime, 0.5);
    drone.frequency.setTargetAtTime(62 - 22 * t, ctx.currentTime, 0.6);
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
