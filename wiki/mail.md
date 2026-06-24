# Mail

Fast cached inbox with split reading pane, compose/reply, label actions, and keyboard shortcuts.

## Data flow

1. Messages read from **Corsair local cache** (not Gmail API per view).
2. `gmailService` wraps `@corsair-dev/gmail` via `withTenant(tenantId)`.
3. Sync: OAuth callback backfills; `POST /api/mail/sync` polls; webhooks push updates.
4. UI: `src/app/(app)/mail/page.tsx` + mail components.

## Key files — server

| File | Role |
| --- | --- |
| `src/server/services/gmailService.ts` | List/get/send/draft/modify/trash |
| `src/server/actions/mailActions.ts` | Server actions: compose, reply, archive, star… |
| `src/types/mail.ts` | Mail domain types |
| `src/lib/mime.ts` | RFC 822 message building |
| `src/lib/format.ts` | Display formatting |

## Key files — UI

| File | Role |
| --- | --- |
| `src/app/(app)/mail/page.tsx` | Inbox page |
| `src/components/mail/MailList.tsx` | Message list |
| `src/components/mail/MailBody.tsx` | Reading pane body |
| `src/components/mail/ReadingPaneActions.tsx` | Archive, trash, star actions |
| `src/components/mail/ComposeDialog.tsx` | Compose / reply dialog |
| `src/components/mail/MailShortcuts.tsx` | `j`/`k`/`e`/`x`/`c` keyboard nav |
| `src/components/mail/RealtimePoller.tsx` | 30s polling fallback |
| `src/components/mail/InboxAiIndexer.tsx` | Triggers AI classify + embed |
| `src/components/mail/MailSearchBox.tsx` | In-app search input |

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `j` / `k` | Move selection |
| `e` | Archive |
| `x` | Close message |
| `c` | Compose |
| `/` | Focus search |
| `g i` | Go to inbox |
| `⌘K` | Command palette |
| `⌘J` | Toggle agent |

Implemented in `MailShortcuts.tsx` and `CommandPalette.tsx`.

## API routes

| Route | Method | Role |
| --- | --- | --- |
| `/api/mail/sync` | POST | Poll Gmail into cache |

## Related

- [ai-search-agent.md](./ai-search-agent.md) — priority buckets, semantic search
- [webhooks-integrations.md](./webhooks-integrations.md) — cache sync
- [calendar.md](./calendar.md) — separate feature area
