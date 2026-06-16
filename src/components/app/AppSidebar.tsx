"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { Calendar, Inbox, LogOut, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV = [
  { href: "/mail", label: "Inbox", icon: Inbox },
  { href: "/calendar", label: "Calendar", icon: Calendar },
];

export function AppSidebar({
  user,
  onOpenAgent,
}: {
  user: { email: string; name: string | null };
  onOpenAgent?: () => void;
}) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const display = user.name || user.email;
  const initial = display.charAt(0).toUpperCase();

  return (
    <nav className="flex h-full w-16 flex-col items-center gap-1 border-r bg-sidebar py-3 lg:w-56 lg:items-stretch lg:px-3">
      <Link
        href="/mail"
        className="mb-3 flex items-center gap-2 px-2 text-base font-semibold tracking-tight"
      >
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
          C
        </span>
        <span className="hidden lg:inline">Corsair Mail</span>
      </Link>

      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
              active && "bg-sidebar-accent text-sidebar-foreground",
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}

      <button
        type="button"
        onClick={onOpenAgent}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
      >
        <Sparkles className="size-5 shrink-0" />
        <span className="hidden lg:inline">Assistant</span>
      </button>

      <div className="mt-auto flex flex-col gap-1">
        <div className="hidden px-2 pb-1 lg:block">
          <kbd className="rounded border bg-sidebar-accent px-1.5 py-0.5 text-[10px] text-sidebar-foreground/60">
            ⌘K
          </kbd>{" "}
          <span className="text-[10px] text-sidebar-foreground/50">
            for commands
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold">
            {initial}
          </span>
          <span className="hidden min-w-0 flex-1 truncate text-left lg:inline">
            {display}
          </span>
          <LogOut className="hidden size-4 shrink-0 lg:inline" />
        </button>
      </div>
    </nav>
  );
}
