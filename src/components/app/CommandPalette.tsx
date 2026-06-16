"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  Inbox,
  Calendar as CalendarIcon,
  PenSquare,
  Search,
  Sparkles,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
  keywords?: string;
};

export function CommandPalette({
  open,
  onOpenChange,
  onCompose,
  onNewInvite,
  onOpenAgent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompose: () => void;
  onNewInvite: () => void;
  onOpenAgent: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const close = () => {
    onOpenChange(false);
    setQuery("");
    setActive(0);
  };

  const commands = useMemo<Command[]>(() => {
    const q = query.trim();
    const base: Command[] = [
      {
        id: "compose",
        label: "Compose new email",
        hint: "C",
        icon: <PenSquare className="size-4" />,
        run: () => {
          close();
          onCompose();
        },
        keywords: "write send mail",
      },
      {
        id: "invite",
        label: "New calendar invite",
        icon: <CalendarPlus className="size-4" />,
        run: () => {
          close();
          onNewInvite();
        },
        keywords: "event meeting schedule",
      },
      {
        id: "inbox",
        label: "Go to Inbox",
        hint: "G I",
        icon: <Inbox className="size-4" />,
        run: () => {
          close();
          router.push("/mail");
        },
      },
      {
        id: "calendar",
        label: "Go to Calendar",
        hint: "G C",
        icon: <CalendarIcon className="size-4" />,
        run: () => {
          close();
          router.push("/calendar");
        },
      },
      {
        id: "assistant",
        label: "Open assistant",
        hint: "⌘J",
        icon: <Sparkles className="size-4" />,
        run: () => {
          close();
          onOpenAgent();
        },
        keywords: "ai agent chat",
      },
    ];

    if (q) {
      base.unshift({
        id: "search",
        label: `Search mail for “${q}”`,
        icon: <Search className="size-4" />,
        run: () => {
          close();
          router.push(`/search?q=${encodeURIComponent(q)}`);
        },
      });
    }

    const lower = q.toLowerCase();
    return base.filter(
      (c) =>
        c.id === "search" ||
        !lower ||
        c.label.toLowerCase().includes(lower) ||
        c.keywords?.includes(lower),
    );
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent showClose={false} className="top-[20%] max-w-lg gap-0 p-0">
        <div className="flex items-center gap-2 border-b px-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, commands.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                e.preventDefault();
                commands[active]?.run();
              }
            }}
            placeholder="Type a command or search…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {commands.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                  i === active ? "bg-accent" : "hover:bg-accent/60",
                )}
              >
                <span className="text-muted-foreground">{c.icon}</span>
                <span className="flex-1">{c.label}</span>
                {c.hint && (
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {c.hint}
                  </kbd>
                )}
              </button>
            </li>
          ))}
          {commands.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">
              No commands
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
