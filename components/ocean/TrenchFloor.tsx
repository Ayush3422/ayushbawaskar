/**
 * Sediment suspended over the trench floor.
 *
 * There were drawn ridges here too, but a flat polygon silhouette read as a
 * cartoon against a live wave simulation. Now that the ocean stays visible at
 * depth, the underside of the swell does the job better than a drawn floor
 * did, so this is only the haze that sits over it.
 */
export function TrenchFloor() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-[1] h-[30rem] overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(12,16,18,0.96) 0%, rgba(12,16,18,0.82) 26%, rgba(10,12,14,0.45) 58%, rgba(10,10,10,0) 100%)",
          opacity: "var(--hadal-presence)",
        }}
      />
      <div
        className="dither absolute inset-x-0 bottom-0 h-44"
        style={{ opacity: "calc(var(--hadal-presence) * 0.5)" }}
      />
    </div>
  );
}
