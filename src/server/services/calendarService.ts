import type { Event } from "@corsair-dev/googlecalendar";

import { tenantClient } from "@/server/tenant";
import type { CalendarEvent } from "@/types/calendar";

function toCalendarEvent(event: Event): CalendarEvent {
  return {
    id: event.id ?? "",
    title: event.summary?.trim() || "(no title)",
    description: event.description ?? "",
    location: event.location ?? "",
    start: event.start?.dateTime ?? event.start?.date ?? null,
    end: event.end?.dateTime ?? event.end?.date ?? null,
    allDay: Boolean(event.start?.date && !event.start?.dateTime),
    organizer: event.organizer?.email ?? null,
    htmlLink: event.htmlLink ?? null,
    attendees: (event.attendees ?? []).map((a) => ({
      email: a.email ?? "",
      name: a.displayName ?? null,
      responseStatus: a.responseStatus ?? null,
    })),
  };
}

export const calendarService = {
  /** Upcoming events within a day-range window. */
  async listEvents(rangeDays = 14, max = 100): Promise<CalendarEvent[]> {
    const client = await tenantClient();
    const now = new Date();
    const timeMax = new Date(now.getTime() + rangeDays * 24 * 60 * 60 * 1000);

    const res = await client.googlecalendar.api.events.getMany({
      timeMin: now.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: max,
    });

    return (res.items ?? [])
      .map(toCalendarEvent)
      .filter((e) => e.id);
  },

  async createInvite(input: {
    title: string;
    attendees: string[];
    start: string;
    end: string;
    description?: string;
    location?: string;
    timeZone?: string;
    sendUpdates?: "all" | "externalOnly" | "none";
  }): Promise<CalendarEvent> {
    const client = await tenantClient();
    const timeZone =
      input.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

    const event = await client.googlecalendar.api.events.create({
      sendUpdates: input.sendUpdates ?? "all",
      event: {
        summary: input.title,
        description: input.description,
        location: input.location,
        start: { dateTime: new Date(input.start).toISOString(), timeZone },
        end: { dateTime: new Date(input.end).toISOString(), timeZone },
        attendees: input.attendees
          .filter(Boolean)
          .map((email) => ({ email })),
      },
    });

    return toCalendarEvent(event);
  },

  async updateEvent(
    id: string,
    changes: {
      title?: string;
      start?: string;
      end?: string;
      description?: string;
      location?: string;
    },
  ): Promise<CalendarEvent> {
    const client = await tenantClient();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const event = await client.googlecalendar.api.events.update({
      id,
      sendUpdates: "all",
      event: {
        ...(changes.title ? { summary: changes.title } : {}),
        ...(changes.description !== undefined
          ? { description: changes.description }
          : {}),
        ...(changes.location !== undefined
          ? { location: changes.location }
          : {}),
        ...(changes.start
          ? { start: { dateTime: new Date(changes.start).toISOString(), timeZone } }
          : {}),
        ...(changes.end
          ? { end: { dateTime: new Date(changes.end).toISOString(), timeZone } }
          : {}),
      },
    });
    return toCalendarEvent(event);
  },

  async deleteEvent(id: string): Promise<void> {
    const client = await tenantClient();
    await client.googlecalendar.api.events.delete({ id, sendUpdates: "all" });
  },

  /** Free/busy windows for the user's primary calendar. */
  async getAvailability(timeMin: string, timeMax: string) {
    const client = await tenantClient();
    const res = await client.googlecalendar.api.calendar.getAvailability({
      timeMin,
      timeMax,
      items: [{ id: "primary" }],
    });
    return res.calendars?.primary?.busy ?? [];
  },
};
