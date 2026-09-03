import { MAX_DEPTH, ZONES } from "@/lib/depth";
import { Label, PixelRule, Stamp } from "@/components/ui/primitives";

const W = 1200;
const H = 320;
const PAD_L = 62;
const PAD_R = 14;
const PAD_T = 18;
const PAD_B = 26;

const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

/** Depth on the vertical axis — this is a cross-section, not a bar. */
const y = (d: number) => round(PAD_T + (d / MAX_DEPTH) * PLOT_H);
/** Horizontal position is progress through the page, one sixth per zone. */
const x = (t: number) => round(PAD_L + t * PLOT_W);

/** Rounded so server and client serialise identically. */
function round(n: number) {
  return Math.round(n * 100) / 100;
}

const AXIS = [0, 2000, 4000, 6000, 8000, 10000, MAX_DEPTH];

export function DiveProfile() {
  /*
   * The descent path is the depth function the site actually uses: each zone
   * gets an equal share of the page but a wildly unequal share of the trench,
   * so the curve is near-flat at the top and steepens as it goes. Plotting it
   * is the honest picture of the dive.
   */
  const points = ZONES.flatMap((z, i) => [
    [x(i / ZONES.length), y(z.min)] as const,
    [x((i + 1) / ZONES.length), y(z.max)] as const,
  ]);

  const path = points.map(([px, py]) => `${px} ${py}`).join(" L ");

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <Stamp>Dive profile</Stamp>
        <div className="flex-1">
          <PixelRule />
        </div>
        <Label>0 → 11,034 m</Label>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Cross-section of the descent. Depth runs down the vertical axis from 0 to 11,034 metres; the six ocean zones are drawn as strata in true proportion, and the descent path steepens with depth because each zone occupies an equal share of the page but a very unequal share of the trench."
      >
        <defs>
          <linearGradient id="dive-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--signal)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Strata. Each zone is a band at its true depth, darkening downward —
            the vertical extent is what makes this read as water rather than a
            chart of nothing. */}
        {ZONES.map((z, i) => {
          const l = 0.62 - (i / (ZONES.length - 1)) * 0.5;
          const top = y(z.min);
          const h = round(y(z.max) - top);
          return (
            <g key={z.id}>
              <rect
                x={PAD_L}
                y={top}
                width={PLOT_W}
                height={h}
                fill={`rgb(${Math.round(l * 74)}, ${Math.round(l * 96)}, ${Math.round(l * 108)})`}
              />
              <line
                x1={PAD_L}
                y1={top}
                x2={W - PAD_R}
                y2={top}
                stroke="var(--border)"
                strokeWidth="1"
              />
              {/* Only bands with room get a name inside them. */}
              {h > 26 && (
                <text
                  x={W - PAD_R - 10}
                  y={round(top + h / 2 + 3)}
                  textAnchor="end"
                  fill="var(--muted-foreground)"
                  opacity="0.7"
                  fontSize="11"
                  letterSpacing="2.2"
                  fontFamily="var(--font-mono)"
                >
                  {z.label.toUpperCase()}
                </text>
              )}
            </g>
          );
        })}

        {/* Depth axis. */}
        {AXIS.map((d) => (
          <g key={d}>
            <line
              x1={PAD_L - 6}
              y1={y(d)}
              x2={PAD_L}
              y2={y(d)}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={PAD_L - 12}
              y={round(y(d) + 3)}
              textAnchor="end"
              fill="var(--muted-foreground)"
              opacity="0.6"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {d.toLocaleString("en-US")}
            </text>
          </g>
        ))}

        {/* Water descended through, under the path. */}
        <path
          d={`M ${PAD_L} ${PAD_T} L ${path} L ${x(1)} ${PAD_T} Z`}
          fill="url(#dive-fill)"
        />

        {/* The descent itself. */}
        <path
          d={`M ${path}`}
          fill="none"
          stroke="var(--signal)"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* A mark at each zone floor. */}
        {ZONES.map((z, i) => (
          <rect
            key={z.id}
            x={round(x((i + 1) / ZONES.length) - 3)}
            y={round(y(z.max) - 3)}
            width="6"
            height="6"
            fill="var(--signal)"
          />
        ))}

        {/* Seabed, so the profile lands on something. */}
        <path
          d={`M ${PAD_L} ${H - PAD_B} L 220 ${H - PAD_B - 9} L 360 ${H - PAD_B - 2} L 520 ${H - PAD_B - 12} L 700 ${H - PAD_B - 4} L 880 ${H - PAD_B - 14} L 1040 ${H - PAD_B - 5} L ${W - PAD_R} ${H - PAD_B - 11} L ${W - PAD_R} ${H} L ${PAD_L} ${H} Z`}
          fill="#0b1113"
          stroke="var(--biolum)"
          strokeOpacity="0.3"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t-2 border-border pt-3">
        <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
          Each zone takes a sixth of the page and a very different share of the
          trench — which is why the curve steepens
        </p>
        <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground/70 uppercase">
          Hadal alone is{" "}
          {Math.round(
            ((ZONES[ZONES.length - 1].max - ZONES[ZONES.length - 1].min) /
              MAX_DEPTH) *
              100,
          )}
          % of it
        </p>
      </div>
    </div>
  );
}
