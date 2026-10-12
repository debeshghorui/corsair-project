# Wiki Log

Append-only record of wiki ingests and maintenance. Newest entries at the bottom.

---

## [2026-06-21] bootstrap

- **Operation:** initial wiki build
- **Source:** README.md + codebase scan (`src/`, `prisma/`, `proxy.ts`)
- **Pages created:** index, overview, auth-routing, onboarding, mail, calendar, ai-search-agent, webhooks-integrations, data-layer, landing-marketing, common-tasks
- **Notes:** Karpathy LLM Wiki pattern (Option A — markdown + AGENTS.md schema). No external CLI.

## [2026-07-22] lint — verify against source

- **Operation:** rebuild/lint pages against actual code (not just README)
- **Source:** `src/server/**` services, actions, repos; `src/lib/env.ts`; API routes; `package.json`; `.env.example`
- **Pages updated:** data-layer, webhooks-integrations, ai-search-agent, mail, calendar, onboarding, overview, common-tasks
- **Corrections:**
  - Tenancy helper is `tenantClient` / `tenantClientFor` (from `@/server/tenant`), not an importable `withTenant`.
  - Webhook entry is `webhookService.handle()` + `registerWatches()` (corsair's `processWebhook` is called inside `handle`).
  - Documented real method names: `aiService.classifyPriority/embed` + `AI_MODELS`, `aiIndexService.indexMessage/indexCachedBatch`, `messageAiRepo.*`, `searchService.search`, `agentService.run` (maxTurns 12), `gmailService.*`, `calendarService.*`, `onboardingService.getStatus`.
  - `env.ts` accessors are functions (`env.appUrl()` etc.); `SECRET_OPENAI_KEY = "openai_api_key"`.
  - Pinned versions (Next 16.2.9, React 19.2.4) and noted unused `@corsair-dev/github` dep.

## [2026-10-12] lint — auth provider seam

- **Operation:** lint after the session interface was split from the Clerk adapter
- **Pages updated:** auth-routing, overview, common-tasks, mail, calendar, data-layer, index
- **Notes:** Removed a root `GLOSSARY.md` and `docs/adr/0001-auth-provider-seam.md`. Session and tenant language, and how to swap the auth provider, live on [auth-routing.md](./auth-routing.md).
