# Corsair Mail — Wiki Index

> **Agents:** Read this file first before exploring the codebase. Jump to the relevant topic page, then open only the listed source files.

## Concepts

| Page | Summary |
| --- | --- |
| [overview.md](./overview.md) | Product purpose, tech stack, layer diagram |
| [auth-routing.md](./auth-routing.md) | Session interface, Clerk adapter, `proxy.ts`, post-auth flow |
| [onboarding.md](./onboarding.md) | Connect Gmail/Calendar, BYOK OpenAI key, completion checks |
| [mail.md](./mail.md) | Cached inbox, compose/reply, labels, keyboard shortcuts |
| [calendar.md](./calendar.md) | Events list, quick invite, server actions |
| [ai-search-agent.md](./ai-search-agent.md) | Priority triage, pgvector search, MCP agent chat |
| [webhooks-integrations.md](./webhooks-integrations.md) | OAuth, Gmail Pub/Sub, Calendar watch, sync polling |
| [data-layer.md](./data-layer.md) | Prisma, Corsair tables, repos, env vars, crypto |
| [landing-marketing.md](./landing-marketing.md) | Public homepage at `/`, landing components |
| [common-tasks.md](./common-tasks.md) | Quick lookup: “I need to change X → edit Y” |

## External docs

| Resource | Purpose |
| --- | --- |
| [../README.md](../README.md) | Setup, env vars, deployment |
| [../AGENTS.md](../AGENTS.md) | Agent rules + wiki maintenance schema |
| [../node_modules/next/dist/docs/](../node_modules/next/dist/docs/) | Next.js 16 APIs (breaking vs training data) |

## Maintenance

| File | Purpose |
| --- | --- |
| [log.md](./log.md) | Append-only changelog of wiki ingests and updates |
