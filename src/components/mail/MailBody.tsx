"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders email HTML inside a sandboxed iframe so message markup/styles can't
 * touch the app or run scripts.
 */
export function MailBody({ html, text }: { html: string; text: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(240);

  const content = html
    ? html
    : `<pre style="white-space:pre-wrap;font-family:inherit;margin:0">${text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</pre>`;

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8" />
<base target="_blank" />
<style>
  :root { color-scheme: light dark; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 14px; line-height: 1.6; color: #18181b; padding: 4px; word-break: break-word; }
  img { max-width: 100%; height: auto; }
  a { color: #2563eb; }
</style></head><body>${content}</body></html>`;

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc) setHeight(doc.body.scrollHeight + 24);
      } catch {
        /* cross-origin guard */
      }
    };
    iframe.addEventListener("load", onLoad);
    return () => iframe.removeEventListener("load", onLoad);
  }, [srcDoc]);

  return (
    <iframe
      ref={ref}
      title="Email content"
      sandbox="allow-same-origin allow-popups"
      srcDoc={srcDoc}
      className="w-full"
      style={{ height }}
    />
  );
}
