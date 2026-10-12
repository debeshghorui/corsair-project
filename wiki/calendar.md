# Calendar

Google Calendar integration for upcoming events and quick invites, via `@corsair-dev/googlecalendar`.

## calendarService methods

File: `src/server/services/calendarService.ts` (each uses `tenantClient()`)

| Method | Role |
| --- | --- |
| `listEvents(rangeDays = 14, max = 100)` | Upcoming events in a day-range window (`singleEvents`, ordered by start) |
| `createInvite(input)` | Create event; resolves time zone (defaults to system), `sendUpdates: "all"` |
| `updateEvent(id, changes)` | Partial update (title/start/end/description/location), `sendUpdates: "all"` |
| `deleteEvent(id)` | Delete event, `sendUpdates: "all"` |
| `getAvailability(timeMin, timeMax)` | Free/busy for `primary` calendar |

Events are normalized to the `CalendarEvent` type (`src/types/calendar.ts`), including attendees with `responseStatus`.

## Server actions

File: `src/server/actions/calendarActions.ts` — invite/update/delete server actions used by the UI.

## Key files — UI

| File | Role |
| --- | --- |
| `src/app/(app)/calendar/page.tsx` | Calendar page |
| `src/components/calendar/EventList.tsx` | Upcoming events list |
| `src/components/calendar/QuickInvite.tsx` | `QuickInvite` (controlled) and `QuickInviteButton` (page launcher) |

## Notes

- Invites use `sendUpdates: "all"` so attendees receive email.
- Time zones default to `Intl.DateTimeFormat().resolvedOptions().timeZone` when not provided.

## Related

- [webhooks-integrations.md](./webhooks-integrations.md) — Calendar watch channels
- [ai-search-agent.md](./ai-search-agent.md) — agent can create invites via MCP
