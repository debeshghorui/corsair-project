# Landing & Marketing

Public homepage at `/` for signed-out users. Signed-in users redirect to mail or onboarding.

## Route

| File | Role |
| --- | --- |
| `src/app/(marketing)/page.tsx` | Home: auth check + `<LandingPage />` or redirect |
| `src/app/(marketing)/layout.tsx` | Marketing layout wrapper |

## Components

All under `src/components/landing/`:

| Component | Section |
| --- | --- |
| `LandingPage.tsx` | Composes all sections |
| `LandingNav.tsx` | Top navigation |
| `LandingHero.tsx` | Hero |
| `LandingFeatures.tsx` | Feature grid |
| `LandingShortcuts.tsx` | Keyboard shortcuts showcase |
| `LandingHowItWorks.tsx` | How-it-works steps |
| `LandingClosingCta.tsx` | Final CTA |
| `LandingFooter.tsx` | Footer |
| `InboxMockup.tsx` | Product mockup visual |
| `landing-tokens.css` | Landing-specific CSS variables |

Styling uses `--landing-*` tokens from `landing-tokens.css` and global styles in `src/app/globals.css`.

## Related

- [auth-routing.md](./auth-routing.md) — public `/` route, signed-in redirect
