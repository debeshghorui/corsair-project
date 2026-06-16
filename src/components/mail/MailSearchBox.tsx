"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function MailSearchBox() {
  const router = useRouter();

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q");
        const query = String(q ?? "").trim();
        if (query) router.push(`/search?q=${encodeURIComponent(query)}`);
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        name="q"
        placeholder="Search mail…"
        className="h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </form>
  );
}
