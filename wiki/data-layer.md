# Data Layer

Postgres (Neon) with Prisma for app tables and Corsair-managed integration tables.

## Prisma schema

File: `prisma/schema.prisma` → client output: `src/generated/prisma`

| Model | Purpose |
| --- | --- |
| `TenantSecret` | Encrypted BYOK secrets (OpenAI key) per Clerk user |
| `CorsairIntegration` | Shared integration config (Google OAuth, Pub/Sub) |
| `CorsairAccount` | Per-tenant connected account |
| `CorsairEntity` | Cached entity versions (mail, etc.) |
| `CorsairEvent` | Integration events |

Migrations live in `prisma/migrations/`. pgvector enabled for `message_ai` sidecar (see `messageAiRepo`).

## Repositories

| File | Role |
| --- | --- |
| `src/server/repositories/secretsRepo.ts` | Read/write encrypted tenant secrets |
| `src/server/repositories/messageAiRepo.ts` | pgvector embeddings + priority metadata |
| `src/server/repositories/integrationsRepo.ts` | Integration/account lookups |

## Lib primitives

| File | Role |
| --- | --- |
| `src/lib/env.ts` | Typed environment access |
| `src/lib/db.ts` | `pg` connection pool |
| `src/lib/prisma.ts` | Prisma client singleton |
| `src/lib/crypto.ts` | AES-256-GCM for BYOK secrets |

## Corsair tenancy

```ts
// Always scope per-user operations:
import { withTenant } from "@/server/tenant";
const client = withTenant(tenantId);
```

Root instance: `src/server/corsair.ts` with `multiTenancy: true`.

## Scripts

| Command | Role |
| --- | --- |
| `bun run setup:corsair` | Seed shared Google OAuth + Pub/Sub keys |
| `bun run db:deploy` | Apply migrations |
| `bun run db:studio` | Prisma Studio |

## Related

- [onboarding.md](./onboarding.md) — BYOK secrets
- [ai-search-agent.md](./ai-search-agent.md) — pgvector search
