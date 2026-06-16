"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { archiveAction } from "@/server/actions/mailActions";

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  return (
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.isContentEditable
  );
}

/** j/k to move through the list, e to archive, x to close the open message. */
export function MailShortcuts({
  orderedIds,
  selectedId,
  label,
}: {
  orderedIds: string[];
  selectedId?: string;
  label: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const go = (id: string) =>
      router.push(`/mail?label=${encodeURIComponent(label)}&id=${id}`);

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey) return;
      const index = selectedId ? orderedIds.indexOf(selectedId) : -1;

      if (e.key === "j") {
        e.preventDefault();
        const next = orderedIds[Math.min(index + 1, orderedIds.length - 1)];
        if (next) go(next);
      } else if (e.key === "k") {
        e.preventDefault();
        const prev = orderedIds[Math.max(index - 1, 0)];
        if (prev) go(prev);
      } else if (e.key === "e" && selectedId) {
        e.preventDefault();
        archiveAction(selectedId).then(() => router.push(`/mail?label=${label}`));
      } else if (e.key === "x" && selectedId) {
        e.preventDefault();
        router.push(`/mail?label=${encodeURIComponent(label)}`);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [orderedIds, selectedId, label, router]);

  return null;
}
