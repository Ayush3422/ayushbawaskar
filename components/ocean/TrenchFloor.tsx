/**
 * The seabed at the end of the descent, plus the sediment haze that sits over
 * it. Anchored to the bottom of the final section rather than fixed to the
 * viewport, because a floor that scrolls with you is not a floor.
 *
 * The ridge is a hand-authored path, not generated: a random silhouette would
 * differ between the server and client renders and React would report a
 * hydration mismatch.
 */
export function TrenchFloor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-[30rem] overflow-hidden"
    >
      {/* Sediment: particulate suspended over the floor, densest at the bottom. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(22,28,30,0.95) 0%, rgba(16,20,22,0.6) 34%, rgba(10,10,10,0) 100%)",
          opacity: "var(--hadal-presence)",
        }}
      />
      <div
        className="dither absolute inset-x-0 bottom-0 h-40"
        style={{ opacity: "calc(var(--hadal-presence) * 0.55)" }}
      />

      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[17rem] w-full"
        style={{ opacity: "var(--hadal-presence)" }}
      >
        {/* Far ridge, hazier and higher. */}
        <path
          d="M0 168 L84 140 L152 158 L232 118 L310 150 L392 126 L468 156 L548 132 L636 162 L714 138 L802 166 L884 142 L960 170 L1046 144 L1128 172 L1210 148 L1292 174 L1366 152 L1440 176 L1440 220 L0 220 Z"
          fill="#1c262a"
        />
        {/* Near ridge, darker and lower, so the floor has depth of its own. */}
        <path
          d="M0 196 L96 176 L178 200 L262 172 L348 198 L436 178 L520 204 L610 180 L698 206 L788 184 L874 208 L962 186 L1052 210 L1140 188 L1228 212 L1316 190 L1404 214 L1440 198 L1440 220 L0 220 Z"
          fill="#111a1d"
        />
        <path
          d="M0 168 L84 140 L152 158 L232 118 L310 150 L392 126 L468 156 L548 132 L636 162 L714 138 L802 166 L884 142 L960 170 L1046 144 L1128 172 L1210 148 L1292 174 L1366 152 L1440 176"
          fill="none"
          stroke="var(--biolum)"
          strokeOpacity="0.18"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* A thin rim of light along the near crest — the only thing down here
            catching what little light exists. */}
        <path
          d="M0 196 L96 176 L178 200 L262 172 L348 198 L436 178 L520 204 L610 180 L698 206 L788 184 L874 208 L962 186 L1052 210 L1140 188 L1228 212 L1316 190 L1404 214 L1440 198"
          fill="none"
          stroke="var(--biolum)"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
