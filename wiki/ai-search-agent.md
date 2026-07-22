# AI, Search & Agent

Three AI surfaces: priority triage, semantic search, and the Corsair MCP agent. All require the tenant's BYOK OpenAI key.

## Models

`aiService.AI_MODELS` (`src/server/services/aiService.ts`):

| Key | Model | Used for |
| --- | --- | --- |
| `fast` | `gpt-4o-mini` | Priority classification + agent reasoning |
| `embedding` | `text-embedding-3-small` (1536-dim) | Semantic search vectors |

OpenAI client is built per tenant from the decrypted BYOK key (`aiService.clientFor`); throws `MissingOpenAiKeyError` if unset.

## Priority filtering

- `aiService.classifyPriority()` → one of `urgent` / `important` / `normal` / `low` (temperature 0, `max_tokens: 1`, defaults to `normal`).
- `aiIndexService.indexMessage()` classifies **and** embeds a message, then `messageAiRepo.upsert()` stores it.
- `aiIndexService.indexCachedBatch(tenantId, max)` indexes only messages without embeddings (`messageAiRepo.existingIds`); stops early on auth/quota errors. Triggered by the inbox indexer and Gmail webhooks.
- Buckets in the UI use `messageAiRepo.getPriorityMap()`.

## Semantic search

`searchService.search()` returns `{ keyword, semantic, semanticAvailable }`:

- **keyword** — substring match over the Corsair cache (`gmailService.cachedMessages(400)`), top 50, no API call.
- **semantic** — `aiService.embed(query)` → `messageAiRepo.semanticSearch()` (pgvector cosine) → `gmailService.cachedByIds()`.
- If the BYOK key is missing or nothing is embedded yet, `semanticAvailable: false` and keyword results still work.
- UI: `src/app/(app)/search/page.tsx` — "Smart results" (semantic) above keyword matches.

## Agent chat

`agentService.run(tenantId, prompt)` (`src/server/services/agentService.ts`):

- Builds tools with `@corsair-dev/mcp` `OpenAIAgentsProvider` scoped to `tenantClientFor(tenantId)`.
- Runs an `@openai/agents` `Agent` using `OpenAIChatCompletionsModel(openai, AI_MODELS.fast)`, `maxTurns: 12`, tracing disabled.
- MCP tools available to the model: `list_operations`, `get_schema`, `run_script` (writes JS against a `corsair` object, e.g. `corsair.gmail.api.messages.send`, `corsair.googlecalendar.api.events.create`).
- Toggle: `⌘J` → `AgentChat.tsx`. API: `POST /api/agent`.

## Key files

| File | Role |
| --- | --- |
| `src/server/services/aiService.ts` | `AI_MODELS`, `clientFor`, `classifyPriority`, `embed` |
| `src/server/services/aiIndexService.ts` | `indexMessage`, `indexCachedBatch` |
| `src/server/services/searchService.ts` | `search` (keyword + semantic) |
| `src/server/services/agentService.ts` | `run` — MCP agent orchestration |
| `src/server/repositories/messageAiRepo.ts` | `upsert`, `semanticSearch`, `getPriorityMap`, `existingIds` |
| `src/components/agent/AgentChat.tsx` | Agent UI |
| `src/components/mail/InboxAiIndexer.tsx` | Client trigger for background indexing |
| `src/app/api/agent/route.ts` | Agent API handler |
| `src/app/api/ai/index/route.ts` | Classify + embed endpoint |
| `src/app/(app)/search/page.tsx` | Search results page |

## BYOK requirement

Tenant must finish onboarding with an OpenAI key before AI features work. Key decrypted server-side only — see [onboarding.md](./onboarding.md).

## Related

- [data-layer.md](./data-layer.md) — `message_ai` / pgvector
- [mail.md](./mail.md) — inbox UI integration
- [webhooks-integrations.md](./webhooks-integrations.md) — auto-index on push
