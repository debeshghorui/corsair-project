/**
 * Centralised, typed access to environment variables.
 * Keeps `process.env` lookups out of the rest of the codebase.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string, fallback = ""): string {
  return process.env[name] ?? fallback;
}

export const env = {
  databaseUrl: () => required("DATABASE_URL"),
  corsairKek: () => required("CORSAIR_KEK"),
  /** Key used to encrypt per-tenant secrets (BYOK). Falls back to the Corsair KEK. */
  secretsEncKey: () => process.env.SECRETS_ENC_KEY ?? required("CORSAIR_KEK"),
  googleClientId: () => required("GOOGLE_CLIENT_ID"),
  googleClientSecret: () => required("GOOGLE_CLIENT_SECRET"),
  appUrl: () => optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  gmailPubsubTopic: () => optional("GMAIL_PUBSUB_TOPIC"),
  webhookBaseUrl: () =>
    optional("WEBHOOK_BASE_URL", optional("NEXT_PUBLIC_APP_URL", "http://localhost:3000")),
} as const;
