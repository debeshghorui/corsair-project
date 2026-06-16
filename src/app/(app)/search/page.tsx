import { Sparkles } from "lucide-react";

import { requireUser } from "@/server/auth/session";
import { searchService } from "@/server/services/searchService";
import { MailList } from "@/components/mail/MailList";
import { MailSearchBox } from "@/components/mail/MailSearchBox";

type SearchParams = Promise<{ q?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const { q = "" } = await searchParams;
  const results = q
    ? await searchService.search(user.id, q)
    : { keyword: [], semantic: [], semanticAvailable: false };

  const seen = new Set(results.semantic.map((m) => m.id));
  const keywordOnly = results.keyword.filter((m) => !seen.has(m.id));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex flex-col gap-3 border-b px-6 py-4">
        <h1 className="text-lg font-semibold tracking-tight">Search</h1>
        <div className="max-w-xl">
          <MailSearchBox />
        </div>
        {q && (
          <p className="text-sm text-muted-foreground">
            Results for <span className="font-medium text-foreground">{q}</span>
          </p>
        )}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!q ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Search across your mail — instantly, on-device.
          </div>
        ) : (
          <div className="flex flex-col">
            {results.semantic.length > 0 && (
              <section>
                <div className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Sparkles className="size-3.5 text-primary" /> Smart results
                </div>
                <MailList messages={results.semantic} label="INBOX" />
              </section>
            )}
            <section>
              <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Keyword matches
              </div>
              <MailList messages={keywordOnly} label="INBOX" />
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
