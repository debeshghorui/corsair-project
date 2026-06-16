import { aiService } from "@/server/services/aiService";
import { gmailService } from "@/server/services/gmailService";
import { messageAiRepo } from "@/server/repositories/messageAiRepo";
import type { MailMessage, MailPriority } from "@/types/mail";

export const aiIndexService = {
  /** Classify + embed a single message and store it in the AI sidecar. */
  async indexMessage(
    tenantId: string,
    message: Pick<MailMessage, "id" | "subject" | "from" | "snippet">,
  ): Promise<MailPriority> {
    const text = `Subject: ${message.subject}\nFrom: ${message.from}\n\n${message.snippet}`;
    const [priority, embedding] = await Promise.all([
      aiService.classifyPriority(tenantId, {
        subject: message.subject,
        from: message.from,
        snippet: message.snippet,
      }),
      aiService.embed(tenantId, text),
    ]);

    await messageAiRepo.upsert({
      tenantId,
      messageId: message.id,
      priority,
      summary: message.subject,
      embedding,
    });
    return priority;
  },

  /**
   * Index a bounded batch of cached messages that don't yet have embeddings.
   * Returns the number of messages indexed. Safe to call repeatedly.
   */
  async indexCachedBatch(tenantId: string, max = 12): Promise<number> {
    const cached = await gmailService.cachedMessages(400);
    const existing = await messageAiRepo.existingIds(
      tenantId,
      cached.map((m) => m.id),
    );
    const pending = cached.filter((m) => !existing.has(m.id)).slice(0, max);

    let indexed = 0;
    for (const message of pending) {
      try {
        await aiIndexService.indexMessage(tenantId, message);
        indexed += 1;
      } catch {
        // Stop early on auth/quota errors; nothing more we can do this pass.
        break;
      }
    }
    return indexed;
  },
};
