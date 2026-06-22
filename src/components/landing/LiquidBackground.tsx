/**
 * Fixed, theme-aware aurora mesh that lives behind every glass surface.
 * Four slowly drifting colour blobs read through the frosted panels and
 * give the page its "liquid glass" refraction. Pure CSS animation keeps
 * it off the main thread; a faint grain overlay kills colour banding.
 */
export function LiquidBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 120% at 50% -10%, var(--lg-bg-base-2), var(--lg-bg-base) 60%)",
      }}
    >
      <div
        className="lg-aurora lg-aurora-a absolute -left-[10%] -top-[15%] h-[55vmax] w-[55vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--lg-aurora-1), transparent 70%)",
        }}
      />
      <div
        className="lg-aurora lg-aurora-b absolute -right-[15%] top-[5%] h-[50vmax] w-[50vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--lg-aurora-2), transparent 70%)",
        }}
      />
      <div
        className="lg-aurora lg-aurora-c absolute bottom-[-20%] left-[10%] h-[48vmax] w-[48vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--lg-aurora-3), transparent 70%)",
        }}
      />
      <div
        className="lg-aurora lg-aurora-d absolute bottom-[-10%] right-[5%] h-[40vmax] w-[40vmax] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--lg-aurora-4), transparent 70%)",
        }}
      />

      {/* Grain — defeats gradient banding on large flat blends */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-soft-light dark:opacity-[0.18]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
