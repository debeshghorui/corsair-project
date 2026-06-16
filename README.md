# Corsair Mail

**A faster Gmail + Google Calendar workflow, powered by [Corsair](https://corsair.dev).**

Corsair Mail is a Superhuman-style email and calendar client that sits on top of your real Gmail and Google Calendar accounts. It pairs a keyboard-first, split-pane inbox with on-device search, AI priority triage, and an agent that can read and act on your mail and calendar — all multi-tenant and BYOK.

### The problem

Stock Gmail and Google Calendar are powerful but slow to drive: opening a message is a round-trip, search is server-bound, everything is mouse-driven, and there's no notion of "what actually needs my attention right now."

### Our approach

Corsair Mail mirrors your mailbox into a local Corsair cache so the UI renders instantly without per-action Gmail API calls. On top of that cache we layer:

- **AI priority buckets** so the inbox surfaces what's urgent first.
- **Instant local search** (substring + pgvector semantic) that returns in well under a second.
- **A keyboard-first UX** (`j`/`k`, `e`, `c`, `g i`/`g c`, `⌘K`, `⌘J`) modeled on Superhuman.
- **An AI agent** that operates your Gmail and Calendar through Corsair's MCP tools.
- **Realtime updates** via Gmail Pub/Sub push and Calendar watch channels.

---

## Features

### Mail
- **Fast cached inbox** — messages render from the local Corsair cache (no Gmail round-trip per view), seeded and backfilled automatically.
- **Label views** — Inbox, Starred, Important, and Sent, with unread/starred state.
- **Split reading pane** with parsed HTML/plain-text bodies.
- **Compose, reply, and save draft** with RFC 822 message building (To/Cc, threading via `In-Reply-To`/`References`).
- **One-click actions** — archive, trash, star/unstar, mark read/unread — with optimistic cache sync.

### Calendar
- **Upcoming events** for the next ~3 weeks from the primary calendar.
- **Quick invite** — create events with attendees, time zone resolution, and `sendUpdates: all` so invitations are emailed.
- **Update & delete** events, plus free/busy availability lookups.

### AI
- **BYOK OpenAI** — each tenant supplies their own OpenAI key, encrypted at rest (AES-256-GCM).
- **Priority filtering** — a cheap model (`gpt-4o-mini`) classifies each message into `urgent` / `important` / `normal` / `low`, rendered as inbox buckets and priority dots.
- **Background indexing** — new mail is classified and embedded in bounded batches without blocking render.
- **Semantic search** — messages are embedded with `text-embedding-3-small` (1536-dim) and searched via pgvector cosine distance.
- **Agent chat** — a Corsair Assistant that uses Corsair MCP tools (`list_operations`, `get_schema`, `run_script`) to send mail, create invites, and more on your behalf.

### Realtime
- **Gmail push** — per-tenant `users.watch` registration publishing to a Google Cloud Pub/Sub topic; pushes land on the Corsair webhook endpoint.
- **Calendar watch** — per-tenant `events.watch` channels post change notifications to the same endpoint.
- **Webhook pipeline** — incoming pushes are processed by Corsair, the cache is updated, affected routes are revalidated, and new mail is auto-indexed for AI.
- **Polling fallback** — a client poller refreshes the inbox cache every 30s (and on tab focus) when push isn't configured.

### Productivity / keyboard
- **Command palette** (`⌘K`) — compose, new invite, navigate, open assistant, or search.
- **Agent toggle** (`⌘J`).
- **Vim-style list nav** — `j`/`k` to move, `e` to archive, `x` to close the open message.
- **Go-to sequences** — `g i` (inbox), `g c` (calendar), `c` (compose), `/` (search).
- **Enhanced search UI** — "Smart results" (semantic) above keyword matches.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 |
| Styling | Tailwind CSS v4, shadcn/ui (Radix UI primitives), `lucide-react` |
| Database | Neon Postgres + `pgvector` |
| ORM | Prisma 7 with `@prisma/adapter-pg` (over a `pg` Pool) |
| Auth | Clerk (`@clerk/nextjs`) |
| Integrations | Corsair (`@corsair-dev/gmail`, `@corsair-dev/googlecalendar`, `@corsair-dev/mcp`) |
| AI | OpenAI (BYOK per tenant) via `@openai/agents` |
| Tooling | Bun (package manager + runtime), ESLint |
| Webhooks (dev) | ngrok (optional, for public webhook URL) |

---

## Architecture

The app is organized into clear layers under `src/`:

- **`lib/`** — framework-agnostic primitives: typed `env` access, the `pg` `Pool` (`db`), the Prisma client (`prisma`), AES-256-GCM `crypto` helpers, and MIME/format utilities.
- **`server/auth/`** — Clerk session helpers (`getTenantId`, `getCurrentUser`, `requireUser`).
- **`server/corsair.ts` + `server/tenant.ts`** — the root multi-tenant Corsair instance and the `withTenant`-scoped client helpers.
- **`server/repositories/`** — data access: `secretsRepo` (encrypted BYOK secrets via Prisma), `messageAiRepo` (raw-SQL pgvector sidecar), `integrationsRepo`.
- **`server/services/`** — business logic: `gmailService`, `calendarService`, `searchService`, `aiService`, `aiIndexService`, `agentService`, `integrationService`, `webhookService`, `onboardingService`.
- **`server/actions/`** — `"use server"` Server Actions for forms (compose/reply/draft, label mutations, invites, OpenAI key).
- **`app/`** — App Router routes (pages + API route handlers).
- **`components/`** — UI: `ui/` (shadcn primitives), plus `app/`, `mail/`, `calendar/`, `agent/`, `onboarding/` feature components.
- **`types/`** — shared domain types (`mail`, `calendar`).

### Multi-tenancy model

- **Each Clerk user is a tenant.** The Corsair `tenantId` *is* the Clerk `userId` — there is no local users table; identity is fully owned by Clerk.
- The root Corsair client is created with `multiTenancy: true`; every per-user operation is scoped through `corsair.withTenant(tenantId)` (see `server/tenant.ts`).
- **Google OAuth app credentials are shared** across all tenants (set once at the integration level via `setup:corsair`), while each tenant's OAuth tokens are stored per-account.
- **BYOK secrets are per-tenant and encrypted.** A tenant's OpenAI key is encrypted with AES-256-GCM (`SECRETS_ENC_KEY`, falling back to `CORSAIR_KEK`) and only ever decrypted server-side on demand.

### Next.js 16 note

Clerk's middleware lives in **`src/proxy.ts`** (Next.js 16 uses `proxy.ts`, **not** `middleware.ts`). It protects all routes except `/sign-in`, `/sign-up`, and `/api/webhooks/*` (which are called by Google, not the user).

---

## Corsair features used

- **Gmail plugin** (`@corsair-dev/gmail`) — message list/get/send/draft/modify/trash, labels, and the local message cache (`gmail.db`).
- **Google Calendar plugin** (`@corsair-dev/googlecalendar`) — events list/create/update/delete and availability.
- **Multi-tenancy** — `multiTenancy: true` with `corsair.withTenant(tenantId)` scoping.
- **OAuth connect / callback** — `generateOAuthUrl` + `processOAuthCallback` (`/api/integrations/connect`, `/api/integrations/callback`).
- **Integration key management** — shared Google client id/secret/redirect + Gmail Pub/Sub topic stored via `corsair.keys.*` in `setup:corsair`.
- **Webhooks** — `processWebhook` handling Gmail Pub/Sub pushes and Calendar watch notifications.
- **Cached messages / search** — local-first reads from the Corsair cache powering instant inbox + keyword search.
- **Corsair MCP for the agent** — `@corsair-dev/mcp` `OpenAIAgentsProvider` exposes Corsair operations as agent tools.
- **ORM / database** — Corsair-managed tables persisted in Postgres alongside the app's Prisma schema.

## Bonus tasks attempted

- **Corsair MCP agent chat** — natural-language assistant that operates Gmail + Calendar via MCP tools.
- **Realtime webhooks** — Gmail push via Google Cloud Pub/Sub and Calendar `events.watch` channels, with per-tenant watch registration.
- **AI priority filtering** — cheap-LLM triage into urgent/important/normal/low, surfaced as inbox buckets.
- **Keyboard shortcuts** — Superhuman-style `j`/`k`/`e`/`x`, `c`, `/`, and `g i`/`g c` sequences.
- **Command palette (`⌘K`)** — fuzzy commands + jump-to-search.
- **Enhanced search UI** — semantic "Smart results" alongside keyword matches.
- **Fast local pgvector semantic search** — embeddings stored in a per-tenant `message_ai` sidecar, queried with cosine distance.

---

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (package manager + runtime)
- Node.js 20+
- A **Neon Postgres** database URL (with `pgvector` available)
- A **Google Cloud** project with the Gmail API + Calendar API enabled, an OAuth client, and (optionally) a Pub/Sub topic for Gmail push
- A **Clerk** application
- An **OpenAI API key** (entered per-tenant in the app's onboarding, not via env)

### 1. Install

```bash
bun install
```

`postinstall` runs `prisma generate` automatically.

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in the values — see the [Environment variables](#environment-variables) table below.

### 3. Set up the database

```bash
bunx prisma migrate deploy   # apply migrations (enables pgvector, creates tables)
bunx prisma generate         # regenerate the client if needed
```

> Convenience scripts also exist: `bun run db:deploy`, `bun run db:generate`, `bun run db:studio`, etc.

### 4. Configure shared Corsair integration credentials

After filling in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (and optionally `GMAIL_PUBSUB_TOPIC`):

```bash
bun run setup:corsair
```

This stores the shared Google OAuth client id/secret/redirect URI for both plugins and the Gmail Pub/Sub topic at the integration level.

### 5. Run the dev server

```bash
bun dev      # or: bun run dev  (runs `next dev`)
```

Open [http://localhost:3000](http://localhost:3000). Sign in with Clerk, then complete onboarding: connect Gmail, connect Google Calendar, and paste your OpenAI key.

### 6. Test realtime webhooks (optional, local)

Push notifications need a public URL. Use [ngrok](https://ngrok.com):

```bash
ngrok http 3000
```

Set `WEBHOOK_BASE_URL` to the ngrok HTTPS URL and `GMAIL_PUBSUB_TOPIC` to your Pub/Sub topic, restart dev, and reconnect your accounts so watches register against the new URL. Inbound pushes hit `POST /api/webhooks/corsair?tenantId=<clerkUserId>`. Without this, the app falls back to its 30-second polling refresh.

---

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | ✅ | Neon Postgres connection string (pgvector required). |
| `CORSAIR_KEK` | ✅ | Corsair key-encryption-key; encrypts integration credentials at rest. |
| `SECRETS_ENC_KEY` | ➖ | Key for encrypting per-tenant BYOK secrets (AES-256-GCM). Defaults to `CORSAIR_KEK`. |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key. |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key. |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | ➖ | Path to the sign-in page (`/sign-in`). |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | ➖ | Path to the sign-up page (`/sign-up`). |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | ➖ | Post-sign-in fallback redirect. |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | ➖ | Post-sign-up fallback redirect. |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client id (shared across tenants). |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret (shared across tenants). |
| `NEXT_PUBLIC_APP_URL` | ➖ | Public base URL of the app. Defaults to `http://localhost:3000`. |
| `GMAIL_PUBSUB_TOPIC` | ➖ | Google Cloud Pub/Sub topic for Gmail push (`projects/<id>/topics/<topic>`). |
| `WEBHOOK_BASE_URL` | ➖ | Public URL that receives Corsair webhooks (ngrok in dev). Falls back to `NEXT_PUBLIC_APP_URL`. |

> The OpenAI API key is **not** an env var — each tenant enters their own key during onboarding, and it is stored encrypted per-tenant.

---

## Deployment (Vercel)

1. **Set environment variables** in the Vercel project (all required vars above; set `NEXT_PUBLIC_APP_URL` to the deployed URL).
2. **Run migrations** against your production database: `bunx prisma migrate deploy` (e.g. as a build/release step).
3. **Google OAuth redirect URI** — add `${NEXT_PUBLIC_APP_URL}/api/integrations/callback` to the authorized redirect URIs of your Google OAuth client.
4. **Clerk** — configure a production instance and use its production publishable/secret keys.
5. **Webhooks** — set `WEBHOOK_BASE_URL` to the deployed URL and ensure `GMAIL_PUBSUB_TOPIC` is set so per-tenant watches register against production.
6. **Run `setup:corsair`** once against the production database to seed the shared integration credentials.

---

## Project structure

```
src/
├── app/
│   ├── (app)/                # Authenticated app shell
│   │   ├── mail/             # Inbox + reading pane
│   │   ├── calendar/         # Calendar + invites
│   │   ├── search/           # Keyword + semantic search
│   │   └── layout.tsx
│   ├── api/
│   │   ├── agent/            # POST: run the Corsair MCP agent
│   │   ├── ai/index/         # POST: classify + embed cached mail
│   │   ├── mail/sync/        # POST: poll Gmail into the cache
│   │   ├── integrations/
│   │   │   ├── connect/      # GET: start OAuth
│   │   │   └── callback/     # GET: finish OAuth, backfill, register watches
│   │   └── webhooks/corsair/ # POST: Gmail Pub/Sub + Calendar watch
│   ├── onboarding/           # Connect accounts + add OpenAI key
│   ├── sign-in/ , sign-up/   # Clerk auth pages
│   ├── layout.tsx            # Root layout (ClerkProvider)
│   └── page.tsx              # Redirect to /mail or /sign-in
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── app/                  # AppShell, AppSidebar, CommandPalette
│   ├── mail/                 # MailList, ComposeDialog, shortcuts, pollers…
│   ├── calendar/             # EventList, QuickInvite
│   ├── agent/                # AgentChat
│   └── onboarding/           # OpenAiKeyForm
├── server/
│   ├── auth/                 # Clerk session helpers
│   ├── repositories/         # secretsRepo, messageAiRepo, integrationsRepo
│   ├── services/             # gmail, calendar, ai, search, agent, webhook…
│   ├── actions/              # "use server" form actions
│   ├── corsair.ts            # Root multi-tenant Corsair instance
│   └── tenant.ts             # withTenant-scoped client helpers
├── lib/                      # env, db (pg Pool), prisma, crypto, mime, utils
├── types/                    # Shared domain types
└── proxy.ts                  # Clerk middleware (Next.js 16)
```
