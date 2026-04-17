# Tabyn — CLAUDE.md

## Project Overview

Agricultural investment platform where investors fund farm animals and share profit with farmers after sale. Built as an MVP/prototype — demo data drives listings, Supabase handles auth and production DB.

**Live URL**: https://tabyn-project.vercel.app
**GitHub repo**: https://github.com/serikkazyarszn-afk/Tabyn_Project
**Vercel project**: `serikkazyarszn-afks-projects/tabyn-project`
**Supabase project**: `https://fsmbwtpgzcubbquoavlj.supabase.co`

## Tech Stack

- **Framework**: Next.js 16 (App Router) — `proxy.ts` not `middleware.ts` (renamed in Next.js 16)
- **Styling**: Tailwind CSS v4 — configured via `app/globals.css` `@theme` block, **no** `tailwind.config.ts`
- **Database/Auth**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **i18n**: next-intl — locale routing via `app/[locale]/`, translations in `messages/`
- **Icons**: lucide-react

## Project Structure

```
app/
  layout.tsx              — root HTML shell (fonts, globals.css)
  [locale]/
    layout.tsx            — NextIntlClientProvider + Navbar + Footer + server-side session fetch
    page.tsx              — Landing page
    animals/
      page.tsx            — Browse animals with filters
      [id]/page.tsx       — Animal detail + invest modal
    login/page.tsx
    signup/page.tsx
    dashboard/page.tsx    — Investor portfolio
    farmer/
      dashboard/page.tsx  — Farmer animal management
      animals/new/page.tsx — Add animal form

components/
  ui/                     — button.tsx, card.tsx, badge.tsx, input.tsx
  layout/                 — navbar.tsx, footer.tsx
  landing/                — hero.tsx, how-it-works.tsx, benefits.tsx,
                            featured-animals.tsx, profit-sharing.tsx, trust-section.tsx
  animals/animal-card.tsx

lib/
  types.ts                — TypeScript interfaces (Profile, Animal, Investment, etc.)
  supabase.ts             — browser Supabase client (createClient) — singleton at module level
  supabase-server.ts      — server Supabase client (uses cookies)
  demo-data.ts            — DEMO_ANIMALS and DEMO_INVESTMENTS (mock data for MVP)

i18n/
  routing.ts              — locales: ['en', 'ru'], defaultLocale: 'en'
  request.ts              — getRequestConfig for next-intl

messages/
  en.json                 — English strings
  ru.json                 — Russian strings

supabase/migrations/
  001_initial.sql         — Full DB schema (profiles, farmers, animals, investments + RLS)
```

## Design System

Design tokens are CSS variables in `app/globals.css`. All colors reference these vars.

| Variable | Value | Usage |
|---|---|---|
| `--background` | `#0d0d0d` | Page background |
| `--surface` | `#161616` | Cards, inputs |
| `--surface-hover` | `#1e1e1e` | Hover states |
| `--border` | `#2a2a2a` | Card borders |
| `--accent` | `#a8e63d` | Neon lime green — primary brand color |
| `--accent-dim` | `#8bc931` | Accent hover |
| `--foreground` | `#ffffff` | Primary text |
| `--muted` | `#888888` | Secondary text |
| `--muted-2` | `#555555` | Tertiary text |

In Tailwind classes these are: `bg-background`, `bg-surface`, `text-accent`, `border-border`, etc.

## Key Conventions

- All pages are `'use client'` when they use state/hooks. Server components for static/data pages.
- `params` in App Router pages are a `Promise` — always `use(params)` or `await params`.
- Navigation links are built as `/${locale}/path` — use the `navLink` helper pattern in components.
- Demo data (`lib/demo-data.ts`) is used until Supabase is configured. Pages currently read from it directly.
- Auth redirects: investors → `/[locale]/dashboard`, farmers → `/[locale]/farmer/dashboard`.
- **Supabase browser client** (`lib/supabase.ts`) is instantiated at module level (outside the component) so the same instance is shared across the auth listener and logout handler. Never create it inside a click handler.

## Auth Pattern (Navbar)

The Navbar (`components/layout/navbar.tsx`) handles auth state in two layers:
1. **Server layer**: `app/[locale]/layout.tsx` fetches the session via `supabase-server.ts` and passes `user` as a prop — handles the initial HTML render correctly.
2. **Client layer**: Navbar subscribes to `supabase.auth.onAuthStateChange()` on mount — handles live updates after login/logout without a page reload.

The Supabase client is created once at module level (outside the component function) so the logout button and the auth listener both share the same session-aware instance.

## Known Issues Fixed

- **Next.js 16**: middleware file must be named `proxy.ts` not `middleware.ts`
- **Navbar auth state**: After client-side login, Next.js doesn't re-run server layout. Fixed by using `onAuthStateChange` subscription in Navbar client component.
- **Logout not working**: `createClient()` inside a click handler creates a new instance with no session. Fixed by moving client instantiation to module level.
- **Supabase key format**: Supabase now uses `sb_publishable_` prefix for anon keys (not JWT). This works with `@supabase/ssr` browser client but server-side cookie reading may vary.

## Environment Variables

`.env.local` (local) and Vercel dashboard (production):

```
NEXT_PUBLIC_SUPABASE_URL=https://fsmbwtpgzcubbquoavlj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
```

## Development

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (runs in /Users/arsen.serikkazy/Desktop/tabyn-agro)
vercel --prod    # deploy to production
```

## Database Setup (Supabase)

Migration already applied to production. Schema:
- `profiles` — extends auth.users, stores role (investor/farmer) and balance
- `farmers` — farm name, location, verified flag
- `animals` — listings with type, price, expected_return_pct, slots, status
- `investments` — investor ↔ animal link with amount, profit_share_pct, status

Auto-trigger creates a `profiles` row on every new signup using `raw_user_meta_data` (full_name, role).

## Deployment (Vercel)

```bash
vercel --prod
```

Env vars are set in Vercel dashboard. After any env var change, redeploy for them to take effect.

## Adding Translations

All UI strings live in `messages/en.json` and `messages/ru.json`. To add a new string:
1. Add the key to both files under the appropriate namespace
2. Use `useTranslations('namespace')` in the component
3. Call `t('key')` to render it

## Profit Sharing Model

Fixed 70/30 split: investor receives 70% of profit, farmer receives 30%. Hardcoded in UI and DB schema (`profit_share_pct DEFAULT 70`).

## What's Still Demo / Not Yet Wired to Supabase DB

- Animal listings on browse/detail pages read from `lib/demo-data.ts`
- Investor dashboard reads from `lib/demo-data.ts`
- Farmer dashboard reads from `lib/demo-data.ts`
- Investment modal simulates the action (fake delay, no DB write)
- Farmer "add animal" form simulates submission (no DB write)

Next step when ready: replace demo-data reads with Supabase queries in each page.
