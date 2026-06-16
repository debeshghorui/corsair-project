export type MailPriority = "urgent" | "important" | "normal" | "low";

export type MailMessage = {
  id: string;
  threadId: string | null;
  subject: string;
  from: string;
  to: string;
  snippet: string;
  date: string | null;
  unread: boolean;
  starred: boolean;
  labelIds: string[];
  priority?: MailPriority | null;
};

export type MailMessageDetail = MailMessage & {
  bodyHtml: string;
  bodyText: string;
  messageIdHeader: string;
  referencesHeader: string;
};

export type MailLabel = {
  id: string;
  name: string;
  unread: number;
};
