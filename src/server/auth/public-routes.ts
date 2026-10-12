/** Routes that do not require a session. The auth adapter enforces this list. */
export const PUBLIC_ROUTE_PATTERNS = [
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/login(.*)",
  "/signup(.*)",
  "/api/webhooks(.*)",
] as const;
