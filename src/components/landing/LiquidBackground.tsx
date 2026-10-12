/**
 * Flat black canvas behind the landing page. Matches the Obsidian-style
 * black UI: no color wash, just the page ground.
 */
export function LiquidBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{ background: "var(--lg-bg-base)" }}
    />
  );
}
