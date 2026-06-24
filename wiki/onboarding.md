# Onboarding

New tenants must connect Gmail, Google Calendar, and supply a BYOK OpenAI key before using the app.

## Flow

1. After Clerk sign-in → `/auth/continue` → `/onboarding` if incomplete.
2. User connects Google accounts via OAuth (`/api/integrations/connect`).
3. User submits OpenAI API key (encrypted per-tenant).
4. `onboardingService.getStatus(tenantId)` returns `complete: true` → future auth redirects to `/mail`.

## Key files

| File | Role |
| --- | --- |
| `src/app/onboarding/page.tsx` | Onboarding UI |
| `src/server/services/onboardingService.ts` | Completion checks |
| `src/server/actions/onboardingActions.ts` | Server actions for forms |
| `src/components/onboarding/OpenAiKeyForm.tsx` | BYOK key form |
| `src/components/onboarding/OnboardingSignOut.tsx` | Sign-out during onboarding |
| `src/server/repositories/secretsRepo.ts` | Encrypted OpenAI key storage |
| `src/lib/crypto.ts` | AES-256-GCM encrypt/decrypt |

## BYOK secrets

- OpenAI key is **not** an env var — stored in `TenantSecret` (Prisma).
- Encrypted with `SECRETS_ENC_KEY` (falls back to `CORSAIR_KEK`).
- Decrypted only server-side when calling OpenAI.

## Related

- [webhooks-integrations.md](./webhooks-integrations.md) — OAuth connect/callback
- [data-layer.md](./data-layer.md) — `TenantSecret` model
- [auth-routing.md](./auth-routing.md) — post-auth redirect
