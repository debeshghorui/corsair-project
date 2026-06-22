"use client";

import { useRef } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon, Sun } from "lucide-react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> };
};

/**
 * Liquid theme toggle. Clicking triggers a View Transition that clips the
 * incoming theme in as an expanding circle originating from the button —
 * the radius reaches the farthest screen corner so the wipe always covers
 * the viewport. Falls back to an instant switch where unsupported or when
 * reduced motion is requested.
 */
export function MainframeThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    const doc = document as ViewTransitionDocument;
    const root = document.documentElement;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!doc.startViewTransition || prefersReduced) {
      setTheme(next);
      return;
    }

    // Origin = centre of the button; radius = distance to farthest corner.
    const rect = buttonRef.current?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    root.style.setProperty("--lg-x", `${x}px`);
    root.style.setProperty("--lg-y", `${y}px`);
    root.style.setProperty("--lg-r", `${radius}px`);
    root.classList.add("lg-theme-anim");

    const transition = doc.startViewTransition(() => setTheme(next));
    transition.ready.finally(() => {
      window.setTimeout(() => root.classList.remove("lg-theme-anim"), 700);
    });
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      aria-label="Toggle color theme"
      onClick={toggle}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`lg-keycap relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full text-black dark:text-white ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ y: 14, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inline-flex"
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
