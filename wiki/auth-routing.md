# Auth & Routing

A **session** is the signed-in person the app is acting for: an id, an email, and an optional display name. A **tenant** is the isolation boundary for that person's mail, calendar, secrets, and assistant data. The tenant id is the session id.

Clerk is the current adapter for that session. App pages, sidebars, and server actions do not import `@clerk/nextjs`. Replacing Clerk means swapping the adapter, not those callers.

Next.js 16 uses **`src/proxy.ts`** for middleware (not `middleware.ts`). Next.js has to see `clerkMiddleware` and its matcher written in that file, so the public route list lives in `src/server/auth/public-routes.ts` and the proxy is the one place that still calls the provider middleware directly.

## Public vs protected routes

Defined in `src/server/auth/public-routes.ts` and enforced by `src/proxy.ts`:

| Public | Protected (default) |
| --- | --- |
| `/` | `/mail`, `/calendar`, `/search` |
| `/sign-in(.*)`, `/sign-up(.*)` | `/onboarding` |
| `/login(.*)`, `/signup(.*)` | Most `/api/*` routes |
| `/api/webhooks(.*)` | |

Webhooks stay public because Google/Corsair call them without a session.

## Sign-in entry points

| URL | Behavior |
| --- | --- |
| `/sign-in/[[...sign-in]]` | Renders `SignInScreen` — primary sign-in |
| `/sign-up/[[...sign-up]]` | Renders `SignUpScreen` |
| `/login` | Redirects to `/sign-in` |
| `/signup` | Redirects to `/sign-up` |

The screens live in `src/components/auth/clerk/screens.tsx` and are imported through `src/components/auth/screens.tsx`.

## Post-auth flow

1. User signs in.
2. `POST_AUTH_PATH` = `/auth/continue` (`src/server/auth/paths.ts`, re-exported from `postAuth.ts`).
3. `redirectAfterAuth()` checks onboarding via `onboardingService.getStatus()`.
4. Complete → `/mail`; incomplete → `/onboarding`.

Homepage (`src/app/(marketing)/page.tsx`): if a session exists, calls `redirectAfterAuth()` instead of showing the landing page.

## Session interface

Server helpers: `src/server/auth/session.ts`. They call the Clerk adapter in `src/server/auth/adapters/clerk/session.ts`.

| Function | Returns |
| --- | --- |
| `getCurrentUser()` | `SessionUser \| null` |
| `getTenantId()` | Session id, or null |
| `requireUser()` | Session, or redirect to sign-in |

Client UI uses `AuthProvider` (`src/components/auth/provider.tsx` → `src/components/auth/clerk/provider.tsx`). Sign-out goes through `useAuthActions()` or `SignOutButton` in `src/components/auth/actions.tsx`. The root layout mounts `AuthProvider` inside `<body>`.

## Replacing the auth provider

| Piece | Path |
| --- | --- |
| Server session read + sign-in redirect | `src/server/auth/adapters/clerk/session.ts` |
| Provider and sign-in / sign-up screens | `src/components/auth/clerk/` |
| Stable imports the app uses | `src/components/auth/provider.tsx`, `src/components/auth/screens.tsx` |
| Request gate | `src/proxy.ts` |
| Public route list | `src/server/auth/public-routes.ts` |

## Key files

| File | Role |
| --- | --- |
| `src/proxy.ts` | Request gate; matcher must stay inline |
| `src/server/auth/public-routes.ts` | Public route patterns |
| `src/app/layout.tsx` | Root layout, `AuthProvider` |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Sign-in route |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Sign-up route |
| `src/app/(auth)/login/page.tsx` | Alias → `/sign-in` |
| `src/app/(auth)/signup/page.tsx` | Alias → `/sign-up` |
| `src/app/auth/continue/route.ts` | Post-auth redirect handler |
| `src/server/auth/session.ts` | Session interface |
| `src/server/auth/paths.ts` | `POST_AUTH_PATH` |
| `src/server/auth/postAuth.ts` | Mail vs onboarding destination |
| `src/components/auth/actions.tsx` | `useAuthActions`, `SignOutButton` |

## Common changes

| Task | Edit |
| --- | --- |
| Add a public route | `src/server/auth/public-routes.ts` |
| Change post-login destination logic | `src/server/auth/postAuth.ts` |
| Swap the auth provider | Adapter paths in the table above |
| Change sign-out from the sidebar or onboarding | `useAuthActions()` / `SignOutButton` |

## Related

- [onboarding.md](./onboarding.md)
- [overview.md](./overview.md)
- [data-layer.md](./data-layer.md)
- [common-tasks.md](./common-tasks.md)
