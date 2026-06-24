# Auth & Routing

Clerk handles identity. Next.js 16 uses **`src/proxy.ts`** for middleware (not `middleware.ts`).

## Public vs protected routes

Defined in `src/proxy.ts` via `createRouteMatcher`:

| Public | Protected (default) |
| --- | --- |
| `/` | `/mail`, `/calendar`, `/search` |
| `/sign-in(.*)`, `/sign-up(.*)` | `/onboarding` |
| `/login(.*)`, `/signup(.*)` | Most `/api/*` routes |
| `/api/webhooks(.*)` | |

Webhooks stay public because Google/Corsair call them without a Clerk session.

## Sign-in entry points

| URL | Behavior |
| --- | --- |
| `/sign-in/[[...sign-in]]` | Clerk `<SignIn />` — primary sign-in |
| `/sign-up/[[...sign-up]]` | Clerk `<SignUp />` |
| `/login` | Redirects to `/sign-in` |
| `/signup` | Redirects to `/sign-up` |

## Post-auth flow

1. User signs in via Clerk.
2. `POST_AUTH_PATH` = `/auth/continue` (`src/server/auth/postAuth.ts`).
3. `redirectAfterAuth()` checks onboarding via `onboardingService.getStatus()`.
4. Complete → `/mail`; incomplete → `/onboarding`.

Homepage (`src/app/(marketing)/page.tsx`): if already signed in, calls `redirectAfterAuth()` instead of showing landing.

## Session helpers

File: `src/server/auth/session.ts`

| Function | Returns |
| --- | --- |
| `getCurrentUser()` | `SessionUser \| null` |
| `getTenantId()` | Clerk user id or null |
| `requireUser()` | User or redirect to sign-in |

## Key files

| File | Role |
| --- | --- |
| `src/proxy.ts` | Clerk middleware, public route list |
| `src/app/layout.tsx` | Root layout, `ClerkProvider` |
| `src/app/sign-in/[[...sign-in]]/page.tsx` | Sign-in UI |
| `src/app/sign-up/[[...sign-up]]/page.tsx` | Sign-up UI |
| `src/app/(auth)/login/page.tsx` | Alias → `/sign-in` |
| `src/app/auth/continue/route.ts` | Post-auth redirect handler |
| `src/server/auth/session.ts` | Server session helpers |
| `src/server/auth/postAuth.ts` | Mail vs onboarding destination |

## Common changes

| Task | Edit |
| --- | --- |
| Add a public route | `src/proxy.ts` → `isPublicRoute` matcher |
| Change post-login destination logic | `src/server/auth/postAuth.ts` |
| Change Clerk redirect URLs | `.env` + Clerk dashboard |

## Related

- [onboarding.md](./onboarding.md)
- [overview.md](./overview.md)
