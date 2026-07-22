# Common Tasks

Quick lookup: **I need to change X → edit Y**.

| I need to… | Start here |
| --- | --- |
| Add a public (unauthenticated) route | `src/proxy.ts` |
| Change sign-in / sign-up pages | `src/app/sign-in/`, `src/app/sign-up/` |
| Change where users go after login | `src/server/auth/postAuth.ts` |
| Change onboarding requirements | `src/server/services/onboardingService.ts` |
| Fix inbox not updating | `webhookService.handle` / `registerWatches`, `RealtimePoller.tsx`, `/api/mail/sync` |
| Change compose / reply behavior | `mailActions.ts`, `gmailService.send/reply/createDraft`, `mime.ts`, `ComposeDialog.tsx` |
| Add a mail keyboard shortcut | `MailShortcuts.tsx`, `CommandPalette.tsx` |
| Change AI priority buckets | `aiService.classifyPriority` (+ `AI_MODELS`), `aiIndexService.ts` |
| Change semantic search | `searchService.search`, `messageAiRepo.semanticSearch` |
| Change agent tools / behavior | `agentService.run`, `AgentChat.tsx`, `/api/agent` |
| Fix OAuth / Google connect | `integrationService.ts`, `/api/integrations/*` |
| Fix webhooks in production | `webhookService.ts`, env `WEBHOOK_BASE_URL`, `GMAIL_PUBSUB_TOPIC` |
| Change calendar invites | `calendarService.createInvite`, `calendarActions.ts`, `QuickInvite.tsx` |
| Change landing page copy / layout | `src/components/landing/*` |
| Add env variable | `src/lib/env.ts` (function accessors), `.env.example`, README |
| Change onboarding completion rules | `onboardingService.getStatus` |
| Scope a Corsair call to a tenant | `tenantClient()` / `tenantClientFor(id)` from `@/server/tenant` |
| Database schema change | `prisma/schema.prisma` → `bun run db:migrate` |
| Seed Corsair integration keys | `bun run setup:corsair` (`scripts/setup-corsair.ts`) |
| Understand Next.js 16 APIs | `node_modules/next/dist/docs/` |

## App shell UI

| File | Role |
| --- | --- |
| `src/app/(app)/layout.tsx` | Authenticated layout |
| `src/components/app/AppShell.tsx` | Main shell |
| `src/components/app/AppSidebar.tsx` | Sidebar nav |
| `src/components/app/CommandPalette.tsx` | `⌘K` palette |
