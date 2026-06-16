"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, MapPin, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { deleteEventAction } from "@/server/actions/calendarActions";
import type { CalendarEvent } from "@/types/calendar";

function groupByDay(events: CalendarEvent[]): [string, CalendarEvent[]][] {
  const groups = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = event.start
      ? new Date(event.start).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "Undated";
    const list = groups.get(key) ?? [];
    list.push(event);
    groups.set(key, list);
  }
  return [...groups.entries()];
}

export function EventList({ events }: { events: CalendarEvent[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-24 text-center text-sm text-muted-foreground">
        <p>No upcoming events.</p>
        <p className="text-xs">Create an invite to get started.</p>
      </div>
    );
  }

  const onDelete = (id: string) =>
    startTransition(async () => {
      await deleteEventAction(id);
      router.refresh();
    });

  return (
    <div className="flex flex-col gap-6">
      {groupByDay(events).map(([day, dayEvents]) => (
        <section key={day} className="flex flex-col gap-2">
          <h3 className="sticky top-0 bg-background/80 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
            {day}
          </h3>
          <ul className="flex flex-col gap-2">
            {dayEvents.map((event) => (
              <li
                key={event.id}
                className="group flex items-start gap-3 rounded-lg border bg-card p-3"
              >
                <div className="flex w-16 shrink-0 flex-col text-sm">
                  <span className="font-medium">
                    {event.start
                      ? new Date(event.start).toLocaleTimeString(undefined, {
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="font-medium">{event.title}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {formatDateTime(event.start)}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {event.location}
                      </span>
                    )}
                    {event.attendees.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {event.attendees.length} guest
                        {event.attendees.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  disabled={pending}
                  onClick={() => onDelete(event.id)}
                  aria-label="Delete event"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
