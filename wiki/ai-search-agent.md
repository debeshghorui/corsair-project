# AI, Search & Agent

Three AI surfaces: priority triage, semantic search, and Corsair MCP agent chat.

## Priority filtering

- Model: `gpt-4o-mini` (cheap classification).
- Buckets: `urgent` / `important` / `normal` / `low`.
- Runs in background via `aiIndexService` — does not block inbox render.

## Semantic search

- Embeddings: `text-embedding-3-small` (1536-dim).
- Storage: `message_ai` sidecar table via raw SQL + pgvector (`messageAiRepo`).
- Search: cosine distance in `searchService`.
- UI: `src/app/(app)/search/page.tsx` — "Smart results" above keyword matches.

## Agent chat

- Corsair Assistant uses `@corsair-dev/mcp` `OpenAIAgentsProvider`.
- Tools: `list_operations`, `get_schema`, `run_script` against tenant-scoped Corsair.
- Toggle: `⌘J` → `AgentChat.tsx`.
- API: `POST /api/agent`.

## Key files

| File | Role |
| --- | --- |
| `src/server/services/aiService.ts` | OpenAI calls, priority classification |
| `src/server/services/aiIndexService.ts` | Background classify + embed batches |
| `src/server/services/searchService.ts` | Keyword + semantic search |
| `src/server/services/agentService.ts` | MCP agent orchestration |
| `src/server/repositories/messageAiRepo.ts` | pgvector sidecar queries |
| `src/components/agent/AgentChat.tsx` | Agent UI |
| `src/components/mail/InboxAiIndexer.tsx` | Client trigger for indexing |
| `src/app/api/agent/route.ts` | Agent API handler |
| `src/app/api/ai/index/route.ts` | Classify + embed endpoint |
| `src/app/(app)/search/page.tsx` | Search results page |

## BYOK requirement

Tenant must complete onboarding with an OpenAI key before AI features work. Key decrypted server-side only — see [onboarding.md](./onboarding.md).

## Related

- [data-layer.md](./data-layer.md) — `message_ai` / pgvector
- [mail.md](./mail.md) — inbox UI integration
