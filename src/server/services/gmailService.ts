import type { Message, MessagePart } from "@corsair-dev/gmail";

import { tenantClient } from "@/server/tenant";
import { buildRawEmail, extractBody, getHeader } from "@/lib/mime";
import type {
  MailLabel,
  MailMessage,
  MailMessageDetail,
} from "@/types/mail";

type CachedMessage = Message & { internalDate?: string | number | Date | null };

function toTime(value: string | number | Date | null | undefined): number {
  if (value == null) return 0;
  if (value instanceof Date) return value.getTime();
  const asNumber = Number(value);
  if (!Number.isNaN(asNumber) && String(value).length >= 10) return asNumber;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

/** Build the list-level view of a message from its cached Gmail payload. */
function toMailMessage(data: CachedMessage): MailMessage {
  const labelIds = data.labelIds ?? [];
  const payload = data.payload;
  return {
    id: data.id ?? "",
    threadId: data.threadId ?? null,
    subject: getHeader(payload, "Subject") || "(no subject)",
    from: getHeader(payload, "From"),
    to: getHeader(payload, "To"),
    snippet: data.snippet ?? "",
    date: data.internalDate ? String(toTime(data.internalDate)) : null,
    unread: labelIds.includes("UNREAD"),
    starred: labelIds.includes("STARRED"),
    labelIds,
  };
}

function hasHeaders(payload: MessagePart | undefined): boolean {
  return Boolean(payload?.headers && payload.headers.length > 0);
}

export const gmailService = {
  /**
   * List messages for a label from the local Corsair cache (fast, no Gmail
   * API round-trip). Falls back to seeding the cache if it's empty.
   */
  async listByLabel(label = "INBOX", limit = 50): Promise<MailMessage[]> {
    const client = await tenantClient();
    let entities = await client.gmail.db.messages.list({ limit: 400 });

    const usable = entities.filter((e) => hasHeaders((e.data as CachedMessage).payload));
    if (usable.length === 0) {
      try {
        await gmailService.seedCache(label);
        entities = await client.gmail.db.messages.list({ limit: 400 });
      } catch (err) {
        console.error("[gmailService.listByLabel] seed failed:", err);
        return [];
      }
    }

    return entities
      .filter((e) => hasHeaders((e.data as CachedMessage).payload))
      .map((e) => toMailMessage(e.data as CachedMessage))
      .filter((m) => m.id && m.labelIds.includes(label))
      .sort((a, b) => Number(b.date ?? 0) - Number(a.date ?? 0))
      .slice(0, limit);
  },

  /** All parsed messages currently in the local cache (fast, no API call). */
  async cachedMessages(limit = 400): Promise<MailMessage[]> {
    const client = await tenantClient();
    const entities = await client.gmail.db.messages.list({ limit });
    return entities
      .filter((e) => hasHeaders((e.data as CachedMessage).payload))
      .map((e) => toMailMessage(e.data as CachedMessage))
      .filter((m) => m.id);
  },

  /** Parsed cached messages for specific ids, preserving the input order. */
  async cachedByIds(ids: string[]): Promise<MailMessage[]> {
    if (ids.length === 0) return [];
    const client = await tenantClient();
    const entities = await client.gmail.db.messages.findManyByEntityIds(ids);
    const byId = new Map(
      entities
        .map((e) => toMailMessage(e.data as CachedMessage))
        .map((m) => [m.id, m]),
    );
    return ids.map((id) => byId.get(id)).filter((m): m is MailMessage => !!m);
  },

  /** Seed the cache with full messages for a label (bounded). */
  async seedCache(label = "INBOX", max = 30): Promise<void> {
    const client = await tenantClient();
    const list = await client.gmail.api.messages.list({
      maxResults: max,
      labelIds: [label],
    });
    const ids = (list.messages ?? []).map((m) => m.id).filter(Boolean) as string[];
    // Fetch full messages so the cache has headers/snippets for fast rendering.
    await Promise.all(
      ids.map((id) =>
        client.gmail.api.messages.get({ id, format: "full" }).catch(() => null),
      ),
    );
  },

  /** Read a full message from the Gmail API and parse its body + headers. */
  async getMessage(id: string): Promise<MailMessageDetail | null> {
    const client = await tenantClient();
    const message = await client.gmail.api.messages.get({ id, format: "full" });
    if (!message?.id) return null;

    const { html, text } = extractBody(message.payload);
    const labelIds = message.labelIds ?? [];

    return {
      id: message.id,
      threadId: message.threadId ?? null,
      subject: getHeader(message.payload, "Subject") || "(no subject)",
      from: getHeader(message.payload, "From"),
      to: getHeader(message.payload, "To"),
      snippet: message.snippet ?? "",
      date: message.internalDate ?? null,
      unread: labelIds.includes("UNREAD"),
      starred: labelIds.includes("STARRED"),
      labelIds,
      bodyHtml: html,
      bodyText: text,
      messageIdHeader: getHeader(message.payload, "Message-ID"),
      referencesHeader: getHeader(message.payload, "References"),
    };
  },

  /** List user labels with unread counts (from Gmail API). */
  async listLabels(): Promise<MailLabel[]> {
    const client = await tenantClient();
    const res = await client.gmail.api.labels.list({});
    return (res.labels ?? [])
      .filter((l) => l.id && l.name)
      .map((l) => ({ id: l.id!, name: l.name!, unread: l.messagesUnread ?? 0 }));
  },

  async send(input: {
    to: string;
    subject: string;
    html: string;
    cc?: string;
    bcc?: string;
  }): Promise<void> {
    const client = await tenantClient();
    await client.gmail.api.messages.send({ raw: buildRawEmail(input) });
  },

  async reply(input: {
    threadId: string;
    to: string;
    subject: string;
    html: string;
    inReplyTo?: string;
    references?: string;
  }): Promise<void> {
    const client = await tenantClient();
    const raw = buildRawEmail({
      to: input.to,
      subject: input.subject.startsWith("Re:") ? input.subject : `Re: ${input.subject}`,
      html: input.html,
      inReplyTo: input.inReplyTo,
      references: input.references,
    });
    await client.gmail.api.messages.send({ raw, threadId: input.threadId });
  },

  async createDraft(input: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    const client = await tenantClient();
    await client.gmail.api.drafts.create({
      draft: { message: { raw: buildRawEmail(input) } },
    });
  },

  async modifyLabels(id: string, add: string[], remove: string[]): Promise<void> {
    const client = await tenantClient();
    await client.gmail.api.messages.modify({
      id,
      addLabelIds: add,
      removeLabelIds: remove,
    });
    await gmailService.syncCachedLabels(id, add, remove);
  },

  archive(id: string) {
    return gmailService.modifyLabels(id, [], ["INBOX"]);
  },
  markRead(id: string) {
    return gmailService.modifyLabels(id, [], ["UNREAD"]);
  },
  markUnread(id: string) {
    return gmailService.modifyLabels(id, ["UNREAD"], []);
  },
  setStarred(id: string, starred: boolean) {
    return starred
      ? gmailService.modifyLabels(id, ["STARRED"], [])
      : gmailService.modifyLabels(id, [], ["STARRED"]);
  },

  async trash(id: string): Promise<void> {
    const client = await tenantClient();
    await client.gmail.api.messages.trash({ id });
    await client.gmail.db.messages.deleteByEntityId(id).catch(() => undefined);
  },

  /** Keep the local cache in sync after a label mutation (best-effort). */
  async syncCachedLabels(id: string, add: string[], remove: string[]): Promise<void> {
    try {
      const client = await tenantClient();
      const entity = await client.gmail.db.messages.findByEntityId(id);
      if (!entity) return;
      const data = entity.data as CachedMessage;
      const set = new Set(data.labelIds ?? []);
      add.forEach((l) => set.add(l));
      remove.forEach((l) => set.delete(l));
      await client.gmail.db.messages.upsertByEntityId(id, {
        ...data,
        id,
        labelIds: [...set],
      });
    } catch {
      // Cache self-corrects on next backfill / webhook.
    }
  },
};
