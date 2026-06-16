import "dotenv/config";

import { corsair } from "@/server/corsair";
import { env } from "@/lib/env";

/**
 * One-time setup: store the shared Google OAuth app credentials at the
 * integration level (shared across all tenants). Run after filling in
 * GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in .env:
 *
 *   bun run setup:corsair
 */
async function main() {
  const redirectUri = `${env.appUrl()}/api/integrations/callback`;
  const plugins = ["gmail", "googlecalendar"] as const;

  for (const plugin of plugins) {
    const keys = corsair.keys[plugin] as unknown as {
      set_client_id: (v: string) => Promise<void>;
      set_client_secret: (v: string) => Promise<void>;
      set_redirect_url: (v: string) => Promise<void>;
    };
    await keys.set_client_id(env.googleClientId());
    await keys.set_client_secret(env.googleClientSecret());
    await keys.set_redirect_url(redirectUri);
    console.log(`✓ Set integration keys for ${plugin}`);
  }

  const topic = env.gmailPubsubTopic();
  if (topic) {
    const gmailKeys = corsair.keys.gmail as unknown as {
      set_topic_id: (v: string) => Promise<void>;
    };
    await gmailKeys.set_topic_id(topic);
    console.log("✓ Set Gmail Pub/Sub topic_id");
  }

  console.log("\nCorsair integration setup complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
