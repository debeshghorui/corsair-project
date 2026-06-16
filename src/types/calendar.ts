export type CalendarAttendee = {
  email: string;
  name: string | null;
  responseStatus: string | null;
};

export type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  start: string | null;
  end: string | null;
  allDay: boolean;
  attendees: CalendarAttendee[];
  organizer: string | null;
  htmlLink: string | null;
};
