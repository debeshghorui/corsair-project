import { aiService } from "@/server/services/aiService";
import { gmailService } from "@/server/services/gmailService";
import { messageAiRepo } from "@/server/repositories/messageAiRepo";
import type { MailMessage } from "@/types/mail";

export type SearchResults = {
  keyword: MailMessage[];
  semantic: MailMessage[];
  semanticAvailable: boolean;
};

function matches(message: MailMessage, terms: string[]): boolean {
  const haystack =
    `${message.subject} ${message.from} ${message.to} ${message.snippet}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

export const searchService = {
  /**
   * Local-first search:
   * - keyword: substring match over the Corsair cache (no Gmail API, <1s)
   * - semantic: pgvector cosine search over embedded messages (BYOK OpenAI)
   */
  async search(tenantId: string, query: string): Promise<SearchResults> {
    const trimmed = query.trim();
    if (!trimmed) {
      return { keyword: [], semantic: [], semanticAvailable: false };
    }

    const terms = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    const cached = await gmailService.cachedMessages(400);
    const keyword = cached
      .filter((m) => matches(m, terms))
      .sort((a, b) => Number(b.date ?? 0) - Number(a.date ?? 0))
      .slice(0, 50);

    let semantic: MailMessage[] = [];
    let semanticAvailable = false;
    try {
      const embedding = await aiService.embed(tenantId, trimmed);
      const hits = await messageAiRepo.semanticSearch(tenantId, embedding, 20);
      semantic = await gmailService.cachedByIds(hits.map((h) => h.messageId));
      semanticAvailable = true;
    } catch {
      // BYOK key missing or nothing embedded yet; keyword results still work.
      semanticAvailable = false;
    }

    return { keyword, semantic, semanticAvailable };
  },
};
