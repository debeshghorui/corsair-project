"use client";

import { useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Pointer-tracking specular highlight on hover. */
  spotlight?: boolean;
  /** Use the heavier blur / brighter fill variant. */
  strong?: boolean;
};

/**
 * The page's primary surface. A frosted glass panel that picks up the
 * aurora behind it; with `spotlight`, a soft specular highlight tracks
 * the pointer. Position is written straight to CSS vars (no re-render).
 */
export function GlassCard({
  children,
  className,
  style,
  spotlight = true,
  strong = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={spotlight ? handleMove : undefined}
      className={cn(
        "lg-glass-card relative overflow-hidden rounded-[28px]",
        strong ? "glass-strong" : "glass",
        className,
      )}
      style={style}
    >
      {spotlight && (
        <span
          aria-hidden
          className="lg-spotlight pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        />
      )}
      <div className="relative z-[1] h-full">{children}</div>
    </div>
  );
}
