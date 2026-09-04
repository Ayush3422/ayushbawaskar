"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MAX_DEPTH } from "@/lib/depth";
import { useDepth } from "@/components/depth/DepthProvider";

const STORAGE_KEY = "abyss:ambience";

/**
 * Events that actually grant user activation. Wheel and scroll do not — a
 * mouse-wheel scroll leaves navigator.userActivation.isActive false, so audio
 * started from one is still refused. Listening for them only produced attempts
 * that were always going to fail.
 */
const GESTURES = [
  "pointerdown",
  "pointerup",
  "click",
  "keydown",
  "keyup",
  "touchend",
] as const;

/**
 * Ambience: the supplied wave recording, routed through a depth-driven lowpass
 * so it muffles as you descend — 4.2 kHz of surf at the surface down to 320 Hz
 * at the trench floor.
 *
 * On by default. It cannot literally autoplay — every current browser refuses
 * audio that begins without a user gesture — so it tries immediately and, when
 * refused, retries on the visitor's first scroll, click or keypress.
 *
 * Structured as a reconciler around one desired state rather than as two things
 * that each start and stop playback. An earlier version let the auto-start
 * listeners and the toggle both mutate it with awaits in between: a refused
 * attempt parks on ctx.resume() until a gesture arrives, so clicking the toggle
 * resolved several stale attempts at once and whether the click turned the
 * sound on or off came down to which promise settled first.
 */
export function Ambience() {
  const { depth } = useDepth();
  const [on, setOn] = useState(false);

  /** What the visitor wants. The only thing that decides playback. */
  const desiredRef = useRef(false);
  /** Set once the visitor uses the toggle; auto-start stops trying after that. */
  const decidedRef = useRef(false);
  const applyingRef = useRef(false);
  const pendingRef = useRef(false);
  const playingRef = useRef(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
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
    playingRef.current = false;
  }, []);

  /** Builds the graph once, then resumes and plays. Never throws. */
  const play = useCallback(async (fromGesture: boolean): Promise<boolean> => {
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new Ctx();
    }
    const ctx = ctxRef.current;

    if (ctx.state !== "running") {
      /*
       * Only ever resume from inside a real gesture. resume() does not reject
       * without user activation, it simply never settles — awaiting it
       * speculatively parked attempts that all resolved at once on the first
       * click, and the toggle then raced them.
       */
      if (!fromGesture) return false;
      try {
        await ctx.resume();
      } catch {
        return false;
      }
      if (ctxRef.current?.state !== "running") return false;
    }

    /*
     * The media graph is built here, after we know playback can actually
     * start. Building it up front meant a 4.5 MB preload="auto" fetch on every
     * page load, for a sound most visitors would never hear.
     */
    if (!audioRef.current) {
      const master = ctx.createGain();
      master.gain.value = 0.0001;
      master.connect(ctx.destination);

      const el = new Audio("/audio/ocean-waves.mp3");
      el.loop = true;
      el.preload = "auto";
      audioRef.current = el;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 4200;
      filter.Q.value = 0.7;
      filterRef.current = filter;

      const waterGain = ctx.createGain();
      waterGain.gain.value = 0.9;

      ctx
        .createMediaElementSource(el)
        .connect(filter)
        .connect(waterGain)
        .connect(master);

      // Ease in, so arriving on the page is not a slap.
      master.gain.exponentialRampToValueAtTime(0.22, ctx.currentTime + 1.8);
    }

    const el = audioRef.current;
    if (!el) return false;

    try {
      await el.play();
      return !el.paused;
    } catch {
      // Refused. A later gesture will get another go.
      return false;
    }
  }, []);

  /**
   * Drives playback to whatever desiredRef says. Serialised, and re-checked
   * after the await, so a desire that flips mid-flight always wins.
   */
  const apply = useCallback(async (fromGesture = false) => {
    /*
     * Overlapping requests are remembered, not dropped. Returning early here
     * meant a toggle that arrived while an auto-start attempt was still in
     * flight did nothing at all — the click looked broken. The loop re-runs
     * until the desired state and the real state agree, so the last request
     * always wins.
     */
    if (applyingRef.current) {
      pendingRef.current = true;
      return;
    }
    applyingRef.current = true;
    try {
      do {
        pendingRef.current = false;

        if (desiredRef.current) {
          const ok = await play(fromGesture);
          if (!desiredRef.current) continue;
          playingRef.current = ok;
          setOn(ok);
        } else {
          teardown();
          setOn(false);
        }
      } while (pendingRef.current);
    } finally {
      applyingRef.current = false;
    }
  }, [play, teardown]);

  // On by default, unless this visitor has said otherwise.
  useEffect(() => {
    let optedOut = false;
    try {
      optedOut = localStorage.getItem(STORAGE_KEY) === "off";
    } catch {
      // Storage unavailable. Treat as no preference.
    }
    if (optedOut) return;

    desiredRef.current = true;

    const onGesture = (event: Event) => {
      // A gesture on the toggle is the toggle's business, not auto-start's.
      if (
        event.target instanceof Element &&
        event.target.closest("[data-ambience]")
      ) {
        return;
      }
      if (decidedRef.current || playingRef.current) return;
      void apply(true);
    };

    // Optimistic: succeeds only where the browser already permits audio.
    void apply(false);
    for (const e of GESTURES) {
      window.addEventListener(e, onGesture, { passive: true });
    }

    return () => {
      for (const e of GESTURES) window.removeEventListener(e, onGesture);
    };
  }, [apply]);

  // Depth drives the filter while it is running.
  useEffect(() => {
    const ctx = ctxRef.current;
    const filter = filterRef.current;
    if (!ctx || !filter) return;

    const t = Math.min(depth / MAX_DEPTH, 1);
    filter.frequency.setTargetAtTime(4200 - 3880 * t, ctx.currentTime, 0.5);
  }, [depth]);

  useEffect(() => teardown, [teardown]);

  const toggle = () => {
    decidedRef.current = true;
    /*
     * Flip against what is actually audible, not against the intent flag.
     * The flag is true from mount while the browser is still refusing to
     * start, so flipping it made the visitor's first click "turn off"
     * something they had never heard.
     */
    desiredRef.current = !playingRef.current;
    try {
      localStorage.setItem(STORAGE_KEY, desiredRef.current ? "on" : "off");
    } catch {
      // Private mode. The toggle still works for this visit.
    }
    void apply(true);
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
