# Onboarding

New tenants must connect Gmail, connect Google Calendar, and supply a BYOK OpenAI key before the app is fully usable.

## Flow

1. After Clerk sign-in → `/auth/continue` → `/onboarding` if incomplete (see [auth-routing.md](./auth-routing.md)).
2. User connects Google accounts via OAuth (`/api/integrations/connect` → callback → back to `/onboarding?connected=<plugin>`).
3. User submits their OpenAI API key (encrypted per-tenant).
4. `onboardingService.getStatus(tenantId)` reports completion → future auth redirects to `/mail`.

## Completion status

`onboardingService.getStatus()` (`src/server/services/onboardingService.ts`) returns:

```ts
{ gmailConnected, calendarConnected, openaiKeySet, complete }
```

- `gmailConnected` / `calendarConnected` — from `integrationsRepo.connectedPlugins()` (checks `corsair_accounts`).
- `openaiKeySet` — `secretsRepo.has(tenantId, SECRET_OPENAI_KEY)`.
- `complete` — all three true.

## Key files

| File | Role |
| --- | --- |
| `src/app/onboarding/page.tsx` | Onboarding UI |
| `src/server/services/onboardingService.ts` | `getStatus` completion checks |
| `src/server/actions/onboardingActions.ts` | Server action to save the OpenAI key |
| `src/components/onboarding/OpenAiKeyForm.tsx` | BYOK key form |
| `src/components/onboarding/OnboardingSignOut.tsx` | Sign-out during onboarding |
| `src/server/repositories/secretsRepo.ts` | Encrypted secret storage (`SECRET_OPENAI_KEY = "openai_api_key"`) |
| `src/lib/crypto.ts` | AES-256-GCM `encryptSecret` / `decryptSecret` |

## BYOK secrets

- The OpenAI key is **not** an env var — stored in `TenantSecret` (Prisma), unique per `(userId, name)`.
- Encrypted with `SECRETS_ENC_KEY` (falls back to `CORSAIR_KEK`).
- Decrypted only server-side, on demand, when calling OpenAI.

## Related

- [webhooks-integrations.md](./webhooks-integrations.md) — OAuth connect/callback
- [data-layer.md](./data-layer.md) — `TenantSecret` model
- [auth-routing.md](./auth-routing.md) — post-auth redirect
