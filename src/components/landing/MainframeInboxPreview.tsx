"use client";

import { useRef } from "react";
import { motion } from "motion/react";

import { MainframeMark } from "@/components/brand/MainframeMark";
import { GlassCard } from "@/components/landing/GlassCard";

const EASE = [0.16, 1, 0.3, 1] as const;

type InboxRow = {
  priority: "urgent" | "important" | "normal";
  sender: string;
  subject: string;
  time: string;
};

const ROWS: InboxRow[] = [
  {
    priority: "urgent",
    sender: "Stripe",
    subject: "Action needed: verify your payout account",
    time: "9:41",
  },
  {
    priority: "important",
    sender: "Dana Lin",
    subject: "Re: Q3 roadmap — can we lock the launch date?",
    time: "9:12",
  },
  {
    priority: "normal",
    sender: "GitHub",
    subject: "corsair-mail: 3 new pull requests",
    time: "8:50",
  },
];

const PRIORITY_DOT: Record<InboxRow["priority"], string> = {
  urgent: "bg-rose-500",
  important: "bg-amber-400",
  normal: "bg-sky-400",
};

/** Frosted inbox preview — tilts toward the pointer on hover. */
export function MainframeInboxPreview() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
  };

  const reset = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <div
      style={{ perspective: "1400px" }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <div
        ref={cardRef}
        className="transition-transform duration-300 ease-out [transform-style:preserve-3d]"
      >
        <GlassCard strong className="p-2.5 sm:p-3.5">
          <div className="flex items-center justify-between px-2 pb-3 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <span className="text-[12px] text-black/45 dark:text-white/45">
              Inbox · 3 urgent
            </span>
            <span className="lg-keycap rounded-md px-1.5 py-0.5 text-[11px] font-medium text-black/70 dark:text-white/70">
              ⌘K
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            {ROWS.map((row, index) => (
              <motion.div
                key={row.subject}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
                className="glass flex items-center gap-3 rounded-2xl px-3 py-2.5"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[row.priority]}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-medium text-black dark:text-white">
                      {row.sender}
                    </span>
                    <span className="shrink-0 text-[11px] text-black/40 dark:text-white/40">
                      {row.time}
                    </span>
                  </div>
                  <p className="truncate text-[12px] text-black/55 dark:text-white/55">
                    {row.subject}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.35 }}
            className="mt-2.5 flex items-center gap-2.5 rounded-2xl bg-black/[0.04] px-3 py-2.5 dark:bg-white/[0.05]"
          >
            <motion.span
              className="text-black dark:text-white"
              animate={{ scale: [1, 1.18, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <MainframeMark className="size-3.5" />
            </motion.span>
            <span className="text-[12px] text-black/60 dark:text-white/60">
              <span className="font-medium text-black dark:text-white">A.R.I.A</span>{" "}
              drafted 2 replies and scheduled your 3pm sync
            </span>
          </motion.div>
        </GlassCard>
      </div>
    </div>
  );
}
