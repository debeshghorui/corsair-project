# Data Layer

Postgres (Neon) with Prisma for app tables and Corsair-managed integration tables. pgvector powers semantic search via a raw-SQL sidecar.

## Prisma schema

File: `prisma/schema.prisma` → generated client output: `src/generated/prisma` (gitignored).

| Model | Table | Purpose |
| --- | --- | --- |
| `TenantSecret` | `tenant_secrets` | Encrypted BYOK secrets (OpenAI key) per Clerk user |
| `CorsairIntegration` | `corsair_integrations` | Shared integration config (Google OAuth, Pub/Sub) |
| `CorsairAccount` | `corsair_accounts` | Per-tenant connected account (one row per completed OAuth) |
| `CorsairEntity` | `corsair_entities` | Cached entity versions (mail, etc.) |
| `CorsairEvent` | `corsair_events` | Integration events |

Migrations live in `prisma/migrations/`. The `add_message_ai_vectors` migration enables `pgvector` and creates the `message_ai` table (not modelled in Prisma — queried with raw SQL).

## Repositories

| File | Key methods |
| --- | --- |
| `src/server/repositories/secretsRepo.ts` | `set` / `get` / `has` / `delete`; exports `SECRET_OPENAI_KEY = "openai_api_key"` |
| `src/server/repositories/messageAiRepo.ts` | `upsert`, `semanticSearch`, `getPriorityMap`, `existingIds` (raw SQL over `message_ai`) |
| `src/server/repositories/integrationsRepo.ts` | `connectedPlugins`, `isConnected` (reads `corsair_accounts`/`corsair_integrations`) |

## Lib primitives

| File | Role |
| --- | --- |
| `src/lib/env.ts` | Typed env accessors as **functions**, e.g. `env.appUrl()`, `env.corsairKek()`, `env.gmailPubsubTopic()`, `env.webhookBaseUrl()` |
| `src/lib/db.ts` | `pg` connection `Pool` (`db`) — used by raw-SQL repos + Corsair |
| `src/lib/prisma.ts` | Prisma client singleton (`@prisma/adapter-pg`) |
| `src/lib/crypto.ts` | `encryptSecret` / `decryptSecret` (AES-256-GCM) for BYOK secrets |

## Corsair tenancy

Root instance: `src/server/corsair.ts` (`createCorsair({ plugins: [gmail(), googlecalendar()], multiTenancy: true })`).

Scope every per-user operation through `@/server/tenant`:

```ts
import { tenantClient, tenantClientFor } from "@/server/tenant";

const client = await tenantClient();          // current session
const scoped = tenantClientFor(tenantId);      // explicit tenant id

await client.gmail.db.messages.list({ limit: 400 });
```

> Note: the underlying primitive is `corsair.withTenant(tenantId)`, but app code should use `tenantClient` / `tenantClientFor`, not import `withTenant` directly.

## `message_ai` sidecar (pgvector)

- Columns: `tenant_id`, `message_id`, `account_id`, `priority`, `summary`, `embedding vector(1536)`.
- Unique on `(tenant_id, message_id)`.
- Search: `embedding <=> $vector` cosine distance, `ORDER BY distance ASC` (`messageAiRepo.semanticSearch`).

## Scripts

| Command | Runs | Role |
| --- | --- | --- |
| `bun run setup:corsair` | `scripts/setup-corsair.ts` | Seed shared Google OAuth + Pub/Sub keys |
| `bun run db:deploy` | `prisma migrate deploy` | Apply migrations |
| `bun run db:migrate` | `prisma migrate dev` | Create/apply a dev migration |
| `bun run db:studio` | `prisma studio` | Inspect data |

## Related

- [onboarding.md](./onboarding.md) — BYOK secrets
- [ai-search-agent.md](./ai-search-agent.md) — pgvector search
- [webhooks-integrations.md](./webhooks-integrations.md) — Corsair tables populated by OAuth
