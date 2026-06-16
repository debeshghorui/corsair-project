"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Progressively classifies + embeds inbox messages in the background so
 * priority buckets and semantic search fill in without blocking render.
 * Indexes in bounded batches and refreshes the page when new data lands.
 */
export function InboxAiIndexer({ pendingCount }: { pendingCount: number }) {
  const router = useRouter();
  const running = useRef(false);

  useEffect(() => {
    if (pendingCount <= 0 || running.current) return;
    running.current = true;

    (async () => {
      try {
        const res = await fetch("/api/ai/index", { method: "POST" });
        const data = await res.json();
        if (data.indexed > 0) router.refresh();
      } catch {
        /* best-effort */
      } finally {
        running.current = false;
      }
    })();
  }, [pendingCount, router]);

  return null;
}
