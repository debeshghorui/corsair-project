import { generateOAuthUrl, processOAuthCallback } from "corsair/oauth";

import { corsair } from "@/server/corsair";
import { tenantClientFor } from "@/server/tenant";
import { env } from "@/lib/env";

export const SUPPORTED_PLUGINS = ["gmail", "googlecalendar"] as const;
export type IntegrationPlugin = (typeof SUPPORTED_PLUGINS)[number];

function redirectUri(): string {
  return `${env.appUrl()}/api/integrations/callback`;
}

export const integrationService = {
  isSupported(plugin: string): plugin is IntegrationPlugin {
    return (SUPPORTED_PLUGINS as readonly string[]).includes(plugin);
  },

  /** OAuth authorization URL to start connecting a plugin for a tenant. */
  async getConnectUrl(plugin: IntegrationPlugin, tenantId: string): Promise<string> {
    const { url } = await generateOAuthUrl(corsair, plugin, {
      tenantId,
      redirectUri: redirectUri(),
    });
    return url;
  },

  /** Complete the OAuth flow; returns the connected plugin + tenant. */
  async completeOAuth(input: { code: string; state: string }) {
    return processOAuthCallback(corsair, {
      code: input.code,
      state: input.state,
      redirectUri: redirectUri(),
    });
  },

  /** Seed the local Corsair cache for a freshly connected plugin (best-effort). */
  async backfill(plugin: string, tenantId: string): Promise<void> {
    const client = tenantClientFor(tenantId);
    try {
      if (plugin === "gmail") {
        const list = await client.gmail.api.messages.list({ maxResults: 30 });
        const ids = (list.messages ?? [])
          .map((m) => m.id)
          .filter(Boolean) as string[];
        await Promise.all(
          ids.map((id) =>
            client.gmail.api.messages
              .get({ id, format: "full" })
              .catch(() => null),
          ),
        );
      } else if (plugin === "googlecalendar") {
        const now = new Date();
        const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await client.googlecalendar.api.events.getMany({
          timeMin: now.toISOString(),
          timeMax: in30.toISOString(),
        });
      }
    } catch (err) {
      console.error(`[integrations] backfill failed for ${plugin}:`, err);
    }
  },
};
