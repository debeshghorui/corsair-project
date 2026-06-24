# Overview

Corsair Mail is a Superhuman-style Gmail + Google Calendar client built on [Corsair](https://corsair.dev). It mirrors mail into a local cache for instant UI, adds AI priority buckets and semantic search, and exposes an MCP agent for mail/calendar actions.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router, React 19, TypeScript |
| Styling | Tailwind v4, shadcn/ui, `lucide-react` |
| Database | Neon Postgres + pgvector |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Clerk (`@clerk/nextjs`) |
| Integrations | `@corsair-dev/gmail`, `@corsair-dev/googlecalendar`, `@corsair-dev/mcp` |
| AI | OpenAI BYOK per tenant via `@openai/agents` |
| Runtime | Bun |

## Source layout (`src/`)

```
lib/           → env, db pool, prisma, crypto, mime, format
server/
  auth/        → Clerk session helpers, post-auth redirect
  corsair.ts   → Root multi-tenant Corsair instance
  tenant.ts    → withTenant() scoping
  repositories/→ secretsRepo, messageAiRepo, integrationsRepo
  services/    → Business logic (gmail, calendar, ai, search, agent, webhook…)
  actions/     → "use server" form actions
app/           → App Router pages + API routes
components/    → ui/, app/, mail/, calendar/, agent/, onboarding/, landing/
types/         → mail.ts, calendar.ts
proxy.ts       → Clerk middleware (Next.js 16 — NOT middleware.ts)
```

## Multi-tenancy

- **Tenant id = Clerk `userId`.** No local users table.
- All Corsair ops use `corsair.withTenant(tenantId)` — see [data-layer.md](./data-layer.md).
- Google OAuth app credentials are shared; per-tenant OAuth tokens and BYOK secrets are isolated.

## Route groups

| Group | Path prefix | Auth |
| --- | --- | --- |
| Marketing | `/` | Public |
| Auth pages | `/sign-in`, `/sign-up`, `/login`, `/signup` | Public |
| App shell | `/mail`, `/calendar`, `/search` | Protected |
| Onboarding | `/onboarding` | Protected |
| API | `/api/*` | Mostly protected; webhooks public |

## Related pages

- [auth-routing.md](./auth-routing.md) — how protection works
- [common-tasks.md](./common-tasks.md) — change lookup table
