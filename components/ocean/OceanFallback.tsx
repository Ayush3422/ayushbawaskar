/**
 * Shown whenever the WebGL ocean cannot run — no WebGL2, no float render
 * targets, or a lost context. Purely decorative: the page reads identically
 * without it.
 */
export function OceanFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(120% 80% at 50% -10%, #1d2a33 0%, #101820 35%, #0a0a0a 75%)",
      }}
    />
  );
}
