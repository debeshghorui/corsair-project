"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app/AppSidebar";
import { AgentChat } from "@/components/agent/AgentChat";
import { CommandPalette } from "@/components/app/CommandPalette";
import { ComposeDialog } from "@/components/mail/ComposeDialog";
import { QuickInvite } from "@/components/calendar/QuickInvite";

type Props = {
  children: React.ReactNode;
  user: { email: string; name: string | null };
};

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

/**
 * Client shell hosting global UI: sidebar, agent chat, command palette,
 * global compose / invite dialogs, and keyboard shortcuts.
 */
export function AppShell({ children, user }: Props) {
  const router = useRouter();
  const [agentOpen, setAgentOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const pendingG = useRef(false);

  const toggleAgent = useCallback(() => setAgentOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      if (mod && e.key.toLowerCase() === "j") {
        e.preventDefault();
        toggleAgent();
        return;
      }

      if (isTypingTarget(e.target) || mod) return;

      // Two-key "go to" sequences: g then i/c.
      if (pendingG.current) {
        pendingG.current = false;
        if (e.key === "i") {
          e.preventDefault();
          router.push("/mail");
          return;
        }
        if (e.key === "c") {
          e.preventDefault();
          router.push("/calendar");
          return;
        }
      }
      if (e.key === "g") {
        pendingG.current = true;
        setTimeout(() => (pendingG.current = false), 800);
        return;
      }

      if (e.key === "c") {
        e.preventDefault();
        setComposeOpen(true);
      } else if (e.key === "/") {
        e.preventDefault();
        router.push("/search");
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, toggleAgent]);

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <AppSidebar user={user} onOpenAgent={() => setAgentOpen(true)} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>

      <AgentChat open={agentOpen} onClose={() => setAgentOpen(false)} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onCompose={() => setComposeOpen(true)}
        onNewInvite={() => setInviteOpen(true)}
        onOpenAgent={() => setAgentOpen(true)}
      />
      <ComposeDialog open={composeOpen} onOpenChange={setComposeOpen} />
      <QuickInvite open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
