"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Honors the OS "reduce motion" setting for every motion component on the
 * landing page — including JS-driven ambient loops the CSS media query
 * can't reach (spinning marks, pulsing glyphs).
 */
export function LandingMotionConfig({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
