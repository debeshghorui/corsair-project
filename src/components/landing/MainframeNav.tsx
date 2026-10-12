"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";

import { MainframeMark } from "@/components/brand/MainframeMark";
import { MainframeThemeToggle } from "@/components/landing/MainframeThemeToggle";

const NAV_LINKS = [
  { label: "Product", href: "#studio" },
  { label: "Features", href: "#work" },
  { label: "Under the hood", href: "#labs" },
  { label: "Get started", href: "#openings" },
] as const;

const SHRINK_AT = 72;
const EXPAND_AT = 16;

/** Soft ease-out: starts gently, then settles. The old expo curve slammed most of the squeeze into the first frames. */
const SQUEEZE_TRANSITION =
  "width 1.05s cubic-bezier(0.33, 0.7, 0.18, 1), max-width 1.05s cubic-bezier(0.33, 0.7, 0.18, 1), padding 1.05s cubic-bezier(0.33, 0.7, 0.18, 1)";

function useMinWidth(minWidth: number) {
  const query = `(min-width: ${minWidth}px)`;

  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => true,
  );
}

export function MainframeNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isSm = useMinWidth(640);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((isShrunk) => {
          if (!isShrunk && y > SHRINK_AT) return true;
          if (isShrunk && y < EXPAND_AT) return false;
          return isShrunk;
        });
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const padX = isSm ? (scrolled ? 16 : 24) : scrolled ? 12 : 16;
  const padY = isSm ? (scrolled ? 8 : 12) : scrolled ? 8 : 10;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-4">
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="mx-auto"
            style={{
              width: scrolled ? "calc(100% - 36px)" : "calc(100% - 0px)",
              maxWidth: scrolled ? 896 : 1152,
              transition: SQUEEZE_TRANSITION,
            }}
          >
          <div
            className="glass flex items-center justify-between rounded-full"
            style={{
              padding: `${padY}px ${padX}px`,
              transition: SQUEEZE_TRANSITION,
            }}
          >
          {/* Wordmark */}
          <a
            href="#"
            className="flex items-center gap-2 text-black dark:text-white"
          >
            <motion.span
              aria-hidden
              className="grid size-5 shrink-0 place-items-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <MainframeMark className="size-5" />
            </motion.span>
            <span
              className="text-[18px] tracking-tight sm:text-[20px]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Mainframe
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3.5 py-1.5 text-[14px] text-black/70 transition-colors hover:bg-black/[0.06] hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <MainframeThemeToggle />
            <motion.a
              href="/sign-up"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
              className="rounded-full bg-black px-4 py-2 text-[14px] text-white dark:bg-white dark:text-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sign up
            </motion.a>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <MainframeThemeToggle />
            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
            >
              <span
                className={`h-[2px] w-5 bg-black transition-all duration-300 dark:bg-white ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[2px] w-5 bg-black transition-all duration-300 dark:bg-white ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-[2px] w-5 bg-black transition-all duration-300 dark:bg-white ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
          </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="glass-strong fixed inset-x-3 top-20 z-20 flex flex-col gap-1 rounded-[28px] p-4 md:hidden"
          >
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * index }}
                className="rounded-2xl px-4 py-3 text-[20px] font-medium text-black dark:text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </motion.a>
            ))}
            <a
              href="/sign-up"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-black px-4 py-3 text-center text-[18px] text-white dark:bg-white dark:text-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Sign up free
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
