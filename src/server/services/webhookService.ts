import { randomUUID } from "node:crypto";

import { processWebhook } from "corsair";

import { corsair } from "@/server/corsair";
import { tenantClientFor } from "@/server/tenant";
import { aiIndexService } from "@/server/services/aiIndexService";
import { env } from "@/lib/env";

type KeyGetter = () => Promise<string | null | undefined>;

type AccountKeys = {
  get_access_token?: KeyGetter;
  get_refresh_token?: KeyGetter;
};

type IntegrationKeys = {
  get_client_id?: KeyGetter;
  get_client_secret?: KeyGetter;
};

async function refreshAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
): Promise<string | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function accessTokenFor(
  tenantId: string,
  plugin: "gmail" | "googlecalendar",
): Promise<string | null> {
  const tenant = tenantClientFor(tenantId);
  const accountKeys = (tenant[plugin] as { keys: AccountKeys }).keys;
  const integrationKeys = corsair.keys[plugin] as unknown as IntegrationKeys;

  const [clientId, clientSecret, refreshToken] = await Promise.all([
    integrationKeys.get_client_id?.(),
    integrationKeys.get_client_secret?.(),
    accountKeys.get_refresh_token?.(),
  ]);

  if (clientId && clientSecret && refreshToken) {
    const token = await refreshAccessToken(clientId, clientSecret, refreshToken);
    if (token) return token;
  }
  return (await accountKeys.get_access_token?.()) ?? null;
}

type Headers = Record<string, string | string[] | undefined>;

export type WebhookOutcome = {
  plugin: string | null;
  action: string | null;
};

/**
 * Processes an incoming Corsair webhook (Gmail Pub/Sub push or Calendar watch).
 * The tenant is resolved from `query.tenantId`. After Corsair syncs new data
 * into the cache, we classify + embed any new mail for that tenant.
 */
export const webhookService = {
  async handle(
    headers: Headers,
    body: string,
    query: { tenantId?: string } & Record<string, string | undefined>,
  ): Promise<WebhookOutcome> {
    const result = await processWebhook(
      corsair,
      headers as never,
      body as never,
      query as never,
    );

    const tenantId = query.tenantId;
    if (tenantId && result.plugin === "gmail") {
      // New messages are now in the cache; index a small batch for AI features.
      await aiIndexService.indexCachedBatch(tenantId, 10).catch(() => undefined);
    }

    return { plugin: result.plugin ?? null, action: result.action ?? null };
  },

  /**
   * Best-effort per-tenant watch registration so new mail/events push to our
   * webhook in real time. No-ops gracefully if env/credentials are missing.
   */
  async registerWatches(tenantId: string): Promise<void> {
    const base = env.webhookBaseUrl();
    const callbackUrl = `${base}/api/webhooks/corsair?tenantId=${encodeURIComponent(tenantId)}`;

    // Gmail: users.watch -> publishes to the configured Pub/Sub topic.
    const topic = env.gmailPubsubTopic();
    if (topic && base) {
      try {
        const token = await accessTokenFor(tenantId, "gmail");
        if (token) {
          await fetch("https://gmail.googleapis.com/gmail/v1/users/me/watch", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ topicName: topic, labelIds: ["INBOX"] }),
          });
        }
      } catch (err) {
        console.error("[webhooks] gmail watch failed:", err);
      }
    }

    // Calendar: events.watch -> pushes change notifications to our endpoint.
    if (base) {
      try {
        const token = await accessTokenFor(tenantId, "googlecalendar");
        if (token) {
          await fetch(
            "https://www.googleapis.com/calendar/v3/calendars/primary/events/watch",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: randomUUID(),
                type: "web_hook",
                address: callbackUrl,
              }),
            },
          );
        }
      } catch (err) {
        console.error("[webhooks] calendar watch failed:", err);
      }
    }
  },
};
