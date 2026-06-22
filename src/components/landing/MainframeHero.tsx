"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { MainframeScrubVideo } from "@/components/landing/MainframeScrubVideo";
import { useTypewriter } from "@/components/landing/useTypewriter";

const TYPEWRITER_TEXT =
  "Priority-triaged by AI, searched instantly, driven by keyboard — with an agent that acts on your behalf.";

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  };
}

export function MainframeHero() {
  const { displayed, done } = useTypewriter(TYPEWRITER_TEXT);
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@mainframe.co");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable; ignore silently.
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <MainframeScrubVideo className="absolute inset-0 z-0 h-full w-full object-cover" />

      {/* Left scrim only — keep the right side clear for the video subject */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[var(--lg-bg-base)] via-[var(--lg-bg-base)]/75 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-[var(--lg-bg-base)] to-transparent"
      />

      <div className="relative z-[1] mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8 md:px-10 lg:pt-32">
        <div className="max-w-xl">
          <motion.span
            {...fadeUp(0)}
            className="lg-keycap inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] text-black/70 dark:text-white/70"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Now in private beta — BYOK
          </motion.span>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-[44px] leading-[1.02] tracking-[-0.03em] text-black sm:text-[60px] md:text-[72px] dark:text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Your inbox,
            <br />
            finally{" "}
            <span className="lg-shimmer bg-gradient-to-r from-sky-500 via-violet-500 to-teal-400 bg-clip-text text-transparent">
              fast
            </span>
            .
          </motion.h1>

          <p className="mt-6 min-h-[3.5em] text-[17px] leading-relaxed text-black/70 sm:text-[19px] dark:text-white/70">
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-black align-middle dark:bg-white"
                style={{ animation: "blink 1s step-end infinite" }}
              />
            )}
          </p>

          <motion.div
            {...fadeUp(0.6)}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <motion.a
              href="/sign-up"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-[15px] text-white dark:bg-white dark:text-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Create free account
              <span aria-hidden>→</span>
            </motion.a>

            <motion.button
              type="button"
              onClick={copyEmail}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-3.5 text-[15px] text-black dark:text-white"
            >
              {copied ? "Copied ✓" : "hello@mainframe.co"}
            </motion.button>
          </motion.div>

          <motion.p
            {...fadeUp(0.72)}
            className="mt-6 text-[13px] text-black/45 dark:text-white/45"
          >
            Sits on top of real Gmail + Google Calendar. No migration.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
