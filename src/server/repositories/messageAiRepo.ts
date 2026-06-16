import { db } from "@/lib/db";
import type { MailPriority } from "@/types/mail";

/** Serialize an embedding for a pgvector parameter. */
function toVectorLiteral(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export type MessageAiRecord = {
  tenantId: string;
  messageId: string;
  accountId?: string | null;
  priority?: MailPriority | null;
  summary?: string | null;
  embedding?: number[] | null;
};

export type SemanticHit = { messageId: string; distance: number };

/**
 * Tenant-scoped AI sidecar for cached messages (priority + embedding).
 * Uses raw SQL on the pg pool because pgvector isn't modelled in Prisma.
 */
export const messageAiRepo = {
  async upsert(record: MessageAiRecord): Promise<void> {
    const embedding = record.embedding?.length
      ? toVectorLiteral(record.embedding)
      : null;

    await db.query(
      `INSERT INTO message_ai (tenant_id, message_id, account_id, priority, summary, embedding)
       VALUES ($1, $2, $3, $4, $5, $6::vector)
       ON CONFLICT (tenant_id, message_id) DO UPDATE SET
         account_id = COALESCE(EXCLUDED.account_id, message_ai.account_id),
         priority   = COALESCE(EXCLUDED.priority, message_ai.priority),
         summary    = COALESCE(EXCLUDED.summary, message_ai.summary),
         embedding  = COALESCE(EXCLUDED.embedding, message_ai.embedding)`,
      [
        record.tenantId,
        record.messageId,
        record.accountId ?? null,
        record.priority ?? null,
        record.summary ?? null,
        embedding,
      ],
    );
  },

  /** Map of messageId -> priority for the given ids. */
  async getPriorityMap(
    tenantId: string,
    messageIds: string[],
  ): Promise<Map<string, MailPriority>> {
    if (messageIds.length === 0) return new Map();
    const res = await db.query<{ message_id: string; priority: MailPriority }>(
      `SELECT message_id, priority FROM message_ai
        WHERE tenant_id = $1 AND message_id = ANY($2) AND priority IS NOT NULL`,
      [tenantId, messageIds],
    );
    return new Map(res.rows.map((r) => [r.message_id, r.priority]));
  },

  /** Message ids that already have an embedding (to skip re-embedding). */
  async existingIds(tenantId: string, messageIds: string[]): Promise<Set<string>> {
    if (messageIds.length === 0) return new Set();
    const res = await db.query<{ message_id: string }>(
      `SELECT message_id FROM message_ai
        WHERE tenant_id = $1 AND message_id = ANY($2) AND embedding IS NOT NULL`,
      [tenantId, messageIds],
    );
    return new Set(res.rows.map((r) => r.message_id));
  },

  /** Cosine nearest-neighbour search over the tenant's embedded messages. */
  async semanticSearch(
    tenantId: string,
    embedding: number[],
    limit = 20,
  ): Promise<SemanticHit[]> {
    if (embedding.length === 0) return [];
    const res = await db.query<{ message_id: string; distance: number }>(
      `SELECT message_id, embedding <=> $2::vector AS distance
         FROM message_ai
        WHERE tenant_id = $1 AND embedding IS NOT NULL
        ORDER BY distance ASC
        LIMIT $3`,
      [tenantId, toVectorLiteral(embedding), limit],
    );
    return res.rows.map((r) => ({
      messageId: r.message_id,
      distance: Number(r.distance),
    }));
  },
};
