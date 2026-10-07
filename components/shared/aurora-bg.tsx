/**
 * Animated gradient backdrop: two drifting radial meshes + hairline grid.
 * Pure CSS (no JS thread cost), decorative and hidden from assistive tech.
 */
export function AuroraBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-[0.55]" />
      <div
        className="absolute -left-[15%] top-[-20%] h-[420px] w-[420px] rounded-full bg-primary/20 blur-[90px] animate-aurora"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute -right-[10%] top-[15%] h-[380px] w-[380px] rounded-full bg-secondary/25 blur-[100px] animate-aurora"
        style={{ animationDelay: "-6s", animationDuration: "22s" }}
      />
      <div className="absolute bottom-[-25%] left-1/3 h-[340px] w-[340px] rounded-full bg-primary/10 blur-[80px] animate-aurora" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </div>
  );
}
