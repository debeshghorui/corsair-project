"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Realtime fallback: periodically syncs the inbox cache and refreshes the view.
 * When Corsair push webhooks are configured, updates also arrive via
 * `revalidatePath`, so this just guarantees freshness during the demo.
 */
export function RealtimePoller({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      try {
        await fetch("/api/mail/sync", { method: "POST" });
        if (!cancelled) router.refresh();
      } catch {
        /* ignore transient errors */
      }
    };

    const id = setInterval(tick, intervalMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [intervalMs, router]);

  return null;
}
