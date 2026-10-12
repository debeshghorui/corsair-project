import { requireUser } from "@/server/auth/session";
import { calendarService } from "@/server/services/calendarService";
import { QuickInviteButton } from "@/components/calendar/QuickInvite";
import { EventList } from "@/components/calendar/EventList";

export default async function CalendarPage() {
  await requireUser();
  const events = await calendarService.listEvents(21, 100);

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold tracking-tight">Calendar</h1>
          <p className="text-xs text-muted-foreground">
            {events.length} event{events.length === 1 ? "" : "s"} in the next 3
            weeks
          </p>
        </div>
        <QuickInviteButton />
      </header>
      <div className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto px-6 py-6">
        <EventList events={events} />
      </div>
    </div>
  );
}
