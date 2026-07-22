# Webhooks & Integrations

Google OAuth (via Corsair), Corsair webhooks, Gmail Pub/Sub push, and Calendar watch channels.

## OAuth flow

1. `GET /api/integrations/connect?plugin=gmail|googlecalendar` → `integrationService.getConnectUrl()` → `generateOAuthUrl` (from `corsair/oauth`) → redirect to Google.
2. `GET /api/integrations/callback` → `integrationService.completeOAuth({ code, state })` (`processOAuthCallback`), then:
   - `integrationService.backfill(plugin, tenantId)` — seed the cache (best-effort).
   - `webhookService.registerWatches(tenantId)` — register realtime push.
   - Redirect to `/onboarding?connected=<plugin>` (errors → `?error=...`).
3. Shared Google client id/secret are set once via `bun run setup:corsair` (`scripts/setup-corsair.ts`).

`redirectUri()` = `${env.appUrl()}/api/integrations/callback`. Supported plugins: `SUPPORTED_PLUGINS = ["gmail", "googlecalendar"]`.

## Webhook pipeline

1. Gmail Pub/Sub or Calendar watch → `POST /api/webhooks/corsair?tenantId=<clerkUserId>`.
2. Route calls `webhookService.handle(headers, body, query)`, which runs `processWebhook(corsair, …)`.
3. If the push is Gmail, `aiIndexService.indexCachedBatch(tenantId, 10)` classifies + embeds new mail.
4. Route revalidates `/mail` (gmail) or `/calendar` (googlecalendar).
5. **Always returns HTTP 200** (even on error) so Pub/Sub/Google don't retry forever. A `GET` handler acks Calendar channel-creation syncs.

## Watch registration

`webhookService.registerWatches(tenantId)`:

- **Gmail:** `users.watch` → publishes to `env.gmailPubsubTopic()` (only if topic + base URL set), labels `["INBOX"]`.
- **Calendar:** `events.watch` on `primary` → posts to the callback URL.
- Refreshes an access token via Google's token endpoint using stored client id/secret + refresh token; no-ops gracefully if creds/env are missing.

## Polling fallback

When push isn't configured, `src/components/mail/RealtimePoller.tsx` refreshes every 30s (and on tab focus) via `POST /api/mail/sync`.

## Local dev webhooks

Run ngrok → set `WEBHOOK_BASE_URL` to the HTTPS URL → reconnect accounts so watches register against the public URL.

## Key files

| File | Role |
| --- | --- |
| `src/server/corsair.ts` | Root Corsair + gmail + googlecalendar plugins |
| `src/server/tenant.ts` | `tenantClient` / `tenantClientFor` scoping |
| `src/server/services/integrationService.ts` | `getConnectUrl`, `completeOAuth`, `backfill` |
| `src/server/services/webhookService.ts` | `handle`, `registerWatches` |
| `src/server/repositories/integrationsRepo.ts` | `connectedPlugins`, `isConnected` |
| `src/app/api/integrations/connect/route.ts` | OAuth start |
| `src/app/api/integrations/callback/route.ts` | OAuth finish + backfill + watches |
| `src/app/api/webhooks/corsair/route.ts` | Webhook endpoint (POST + GET ack) |
| `src/app/api/mail/sync/route.ts` | Manual/poll sync |
| `src/components/mail/RealtimePoller.tsx` | Client polling |

## Env vars

| Variable | Role |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Shared OAuth app |
| `GMAIL_PUBSUB_TOPIC` | Gmail push topic (`projects/<id>/topics/<topic>`) |
| `WEBHOOK_BASE_URL` | Public webhook URL (ngrok in dev); falls back to `NEXT_PUBLIC_APP_URL` |
| `CORSAIR_KEK` | Encrypts integration credentials at rest |

## Related

- [onboarding.md](./onboarding.md)
- [mail.md](./mail.md)
- [data-layer.md](./data-layer.md)
