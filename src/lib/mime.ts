import type { MessagePart } from "@corsair-dev/gmail";

/** Base64url-encode a UTF-8 string (Gmail `raw` format). */
export function base64UrlEncode(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Decode Gmail's base64url message body data. */
export function base64UrlDecode(data: string): string {
  const normalized = data.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

/** RFC 2047 encode a header value if it contains non-ASCII characters. */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

export type OutgoingEmail = {
  to: string;
  cc?: string;
  bcc?: string;
  from?: string;
  subject: string;
  /** HTML body. */
  html: string;
  /** Optional headers for threaded replies. */
  inReplyTo?: string;
  references?: string;
};

/** Build a base64url-encoded RFC 822 message for `messages.send` / `drafts.create`. */
export function buildRawEmail(email: OutgoingEmail): string {
  const headers: string[] = [];
  if (email.from) headers.push(`From: ${email.from}`);
  headers.push(`To: ${email.to}`);
  if (email.cc) headers.push(`Cc: ${email.cc}`);
  if (email.bcc) headers.push(`Bcc: ${email.bcc}`);
  headers.push(`Subject: ${encodeHeader(email.subject)}`);
  if (email.inReplyTo) headers.push(`In-Reply-To: ${email.inReplyTo}`);
  if (email.references) headers.push(`References: ${email.references}`);
  headers.push("MIME-Version: 1.0");
  headers.push('Content-Type: text/html; charset="UTF-8"');
  headers.push("Content-Transfer-Encoding: 7bit");

  const message = `${headers.join("\r\n")}\r\n\r\n${email.html}`;
  return base64UrlEncode(message);
}

/** Find a header value (case-insensitive) on a message payload. */
export function getHeader(payload: MessagePart | undefined, name: string): string {
  const header = payload?.headers?.find(
    (h) => h.name?.toLowerCase() === name.toLowerCase(),
  );
  return header?.value ?? "";
}

type ExtractedBody = { html: string; text: string };

/** Recursively extract HTML and plain-text bodies from a message payload. */
export function extractBody(payload: MessagePart | undefined): ExtractedBody {
  const result: ExtractedBody = { html: "", text: "" };
  if (!payload) return result;

  const walk = (part: MessagePart) => {
    const mime = part.mimeType ?? "";
    const data = part.body?.data;
    if (data && mime === "text/html" && !result.html) {
      result.html = base64UrlDecode(data);
    } else if (data && mime === "text/plain" && !result.text) {
      result.text = base64UrlDecode(data);
    }
    part.parts?.forEach(walk);
  };

  walk(payload);
  return result;
}
