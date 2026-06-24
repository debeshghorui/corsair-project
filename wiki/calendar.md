# Calendar

Google Calendar integration for upcoming events and quick invites (~3 week window).

## Key files — server

| File | Role |
| --- | --- |
| `src/server/services/calendarService.ts` | List/create/update/delete events, free/busy |
| `src/server/actions/calendarActions.ts` | Server actions for invites and mutations |
| `src/types/calendar.ts` | Calendar domain types |

## Key files — UI

| File | Role |
| --- | --- |
| `src/app/(app)/calendar/page.tsx` | Calendar page |
| `src/components/calendar/EventList.tsx` | Upcoming events list |
| `src/components/calendar/QuickInvite.tsx` | Create event with attendees |

## Corsair plugin

Uses `@corsair-dev/googlecalendar` via root `corsair` instance, scoped with `withTenant(tenantId)`.

Invites use `sendUpdates: all` so attendees receive email.

## Related

- [webhooks-integrations.md](./webhooks-integrations.md) — Calendar watch channels
- [ai-search-agent.md](./ai-search-agent.md) — agent can create invites via MCP
