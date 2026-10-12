# Mail

Fast cached inbox with split reading pane, compose/reply/draft, label actions, and keyboard shortcuts.

## Data flow

1. Lists render from the **Corsair local cache** (`client.gmail.db.messages.*`) — no Gmail API per view.
2. `gmailService` wraps `@corsair-dev/gmail` via `tenantClient()` and self-seeds an empty cache (`seedCache`).
3. Reads/detail (`getMessage`), sends, and label mutations hit the Gmail API, then sync the cache (`syncCachedLabels`).
4. Sync sources: OAuth `backfill`, `POST /api/mail/sync` polling, and webhooks.

## gmailService methods

File: `src/server/services/gmailService.ts`

| Method | Role |
| --- | --- |
| `listByLabel(label, limit)` | Cached list for a label (seeds if empty) |
| `cachedMessages(limit)` | All parsed cached messages |
| `cachedByIds(ids)` | Cached messages for ids, input order preserved |
| `seedCache(label, max)` | Fetch full messages into cache |
| `getMessage(id)` | Full message + parsed HTML/text body |
| `listLabels()` | User labels with unread counts |
| `send` / `reply` / `createDraft` | Outbound mail (RFC 822 via `mime.ts`) |
| `modifyLabels` / `archive` / `markRead` / `markUnread` / `setStarred` / `trash` | Label + state mutations |

## Server actions

File: `src/server/actions/mailActions.ts` (all call `requireUser()` then `revalidatePath("/mail")`)

`sendEmailAction`, `saveDraftAction`, `replyAction`, `archiveAction`, `trashAction`, `toggleStarAction`, `markReadAction`. Plain-text bodies are converted to HTML (`textToHtml`).

## Key files — UI

| File | Role |
| --- | --- |
| `src/app/(app)/mail/page.tsx` | Inbox page |
| `src/components/mail/MailList.tsx` | Message list (priority dots via `getPriorityMap`) |
| `src/components/mail/MailBody.tsx` | Reading pane body |
| `src/components/mail/ReadingPaneActions.tsx` | Archive, trash, star, read actions |
| `src/components/mail/ComposeDialog.tsx` | `ComposeDialog` (controlled) and `ComposeButton` (page launcher) |
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
| `g i` / `g c` | Go to inbox / calendar |
| `⌘K` | Command palette |
| `⌘J` | Toggle agent |

Implemented in `MailShortcuts.tsx` and `src/components/app/CommandPalette.tsx`.

## API routes

| Route | Method | Role |
| --- | --- | --- |
| `/api/mail/sync` | POST | Poll Gmail into the cache |
| `/api/ai/index` | POST | Classify + embed cached mail |

## Related

- [ai-search-agent.md](./ai-search-agent.md) — priority buckets, semantic search
- [webhooks-integrations.md](./webhooks-integrations.md) — cache sync
- [calendar.md](./calendar.md) — separate feature area
