# Webhooks & Integrations

Google OAuth, Corsair webhooks, Gmail Pub/Sub push, and Calendar watch channels.

## OAuth flow

1. `GET /api/integrations/connect` — starts OAuth (`integrationService`).
2. `GET /api/integrations/callback` — finishes OAuth, backfills cache, registers watches.
3. Shared Google client id/secret set once via `bun run setup:corsair`.

## Webhook pipeline

1. Gmail Pub/Sub or Calendar watch → `POST /api/webhooks/corsair?tenantId=<clerkUserId>`.
2. `webhookService.processWebhook()` updates Corsair cache.
3. Affected Next.js routes revalidated; new mail auto-indexed for AI.

## Polling fallback

When push is not configured, `RealtimePoller.tsx` refreshes every 30s (and on tab focus) via `POST /api/mail/sync`.

## Local dev webhooks

Use ngrok → set `WEBHOOK_BASE_URL` → reconnect accounts so watches register.

## Key files

| File | Role |
| --- | --- |
| `src/server/corsair.ts` | Root Corsair + gmail + googlecalendar plugins |
| `src/server/tenant.ts` | `withTenant(tenantId)` helper |
| `src/server/services/integrationService.ts` | OAuth URL + callback processing |
| `src/server/services/webhookService.ts` | Webhook ingestion |
| `src/server/repositories/integrationsRepo.ts` | Integration state |
| `src/app/api/integrations/connect/route.ts` | OAuth start |
| `src/app/api/integrations/callback/route.ts` | OAuth finish |
| `src/app/api/webhooks/corsair/route.ts` | Webhook endpoint |
| `src/app/api/mail/sync/route.ts` | Manual/poll sync |
| `src/components/mail/RealtimePoller.tsx` | Client polling |

## Env vars

| Variable | Role |
| --- | --- |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Shared OAuth app |
| `GMAIL_PUBSUB_TOPIC` | Gmail push topic |
| `WEBHOOK_BASE_URL` | Public webhook URL (ngrok in dev) |
| `CORSAIR_KEK` | Encrypts integration credentials |

## Related

- [onboarding.md](./onboarding.md)
- [mail.md](./mail.md)
- [data-layer.md](./data-layer.md)
