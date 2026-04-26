# Tabyn — Session 5: Image pipeline, metadata, SEO, polish

Пятая и **финальная** сессия редизайна. **Билд прошёл** (Next 16.2.3 +
Turbopack, TypeScript чист, 11 роутов собираются, 5 static-страниц
генерируются).

## Что изменилось

### Image pipeline — `public/assets/`

Полная реорганизация assets. Низкорезкие JPG удалены; все subject-images
теперь брендовые SVG:

```
public/assets/
├── animals/
│   ├── cow.svg      800×500 schematic, documentary agri-finance
│   ├── sheep.svg
│   ├── horse.svg
│   ├── goat.svg
│   └── camel.svg    (двугорбый)
├── brand/
│   ├── icon.svg     32×32 фавикон-mark
│   └── wordmark.svg 220×60 горизонтальный знак
├── og/
│   └── og-default.svg  1200×630 social preview с брендом,
│                       tagline, 3 metric chips и asset passport
└── README.md        полный asset pipeline: naming convention,
                     спецификация для photographic upgrade, QA checklist
```

Каждый animal SVG построен по одной системе:
- Градиенты `sky-*` и `land-*` на тех же brand-токенах;
- Grid pattern поверх; brand-green horizon-линия;
- Абстрактный силуэт в `text-primary` цвете;
- Reticle marks (измерительные оси H/L) для ощущения «observed/tracked»;
- Corner registration marks;
- Mono-label внизу: `COW · CATTLE · BOS TAURUS` и т.д.

### `lib/demo-data.ts` — обновлены image_url

Все 6 demo animals ссылаются на новые `/assets/animals/<type>.svg`.
Старые `/cow.jpg`, `/Camel.jpg`, `/sheep.jpg` и т.д. удалены из public.
Также удалены все шаблонные Next SVG (`file.svg`, `globe.svg`, `next.svg`,
`vercel.svg`, `window.svg`, `logo.jpg`, `logo.png`, `desktop.ini`).

### App-router native icons

- `app/icon.svg` — ставится Next-ом в `<link rel="icon">` автоматически.
- `app/apple-icon.svg` — 180×180 для iOS home screen.

Старый `app/favicon.ico` удалён.

### `app/sitemap.ts` и `app/robots.ts`

- `sitemap.xml` генерируется динамически для всех 3 локалей × стабильных
  публичных путей (`/`, `/animals`, `/#how-it-works`, `/#trust`), с
  `alternates.languages` для hreflang. Dashboards, login, signup и
  farmer/* исключены (auth-only → не для индексации).
- `robots.txt` разрешает всё `/`, запрещает `/*/dashboard`, `/*/farmer/`,
  `/*/login`, `/*/signup`, `/api/`. Указывает путь к `sitemap.xml`.

### `app/not-found.tsx`

Новая брендовая 404. Ambient horizon gradient + brand radial glow,
TabynMark в surface-card, 404 badge, H1, body, две кнопки (Back home /
Browse catalog), support-email ссылка.

### `next.config.ts` — images + security headers

Переписан полностью:
- `images.formats: ['image/avif', 'image/webp']` — современные форматы
  первыми;
- `images.deviceSizes` и `imageSizes` настроены под сетку проекта
  (360/480/640/768/1024/1280/1440/1920);
- `dangerouslyAllowSVG: true` c CSP-sandbox (мы авторы всех SVG, это
  безопасно — не для user-uploaded);
- `remotePatterns` подготовлен для Supabase Storage bucket
  (`fsmbwtpgzcubbquoavlj.supabase.co`) под будущие real photos;
- Security headers через `async headers()`: `X-Content-Type-Options:
  nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy: camera=(),
  microphone=(), geolocation=()`.

### `app/[locale]/layout.tsx` — metadata + structured data + bug-fix

Переписан со следующими изменениями:
- **Bug-fix**: старый check `routing.locales.includes(locale as 'en' |
  'ru')` молча 404-ил локаль `kk`, хотя она зарегистрирована в
  `i18n/routing.ts`. Теперь check корректен: `as 'en' | 'ru' | 'kk'`.
- `generateMetadata` — per-locale title/description из `meta.*`
  namespace, canonical URL, hreflang alternates (включая `x-default`),
  OG image из `/assets/og/og-default.svg`, Twitter card, alternateLocale.
- **JSON-LD structured data**: Organization + WebSite, в конце body.
- `<main lang={locale}>` — reflects locale в DOM.
- `NextIntlClientProvider` получает `locale` prop явно.

### Per-route metadata через server/client split

6 страниц были client-only (`'use client'`). Для добавления metadata в
App Router каждая превращена в server-page, который рендерит
client-компонент:

| Server page                                  | Client component              |
|-----------------------------------------------|-------------------------------|
| `animals/page.tsx`                            | `_client.tsx: AnimalsCatalogClient` |
| `animals/[id]/page.tsx`                       | `_client.tsx: AnimalDetailClient`    |
| `dashboard/page.tsx`                          | `_client.tsx: DashboardClient`       |
| `login/page.tsx`                              | `_client.tsx: LoginClient`           |
| `signup/page.tsx`                             | `_client.tsx: SignupClient`          |
| `farmer/dashboard/page.tsx`                   | `_client.tsx: FarmerDashboardClient` |
| `farmer/animals/new/page.tsx`                 | `_client.tsx: NewAnimalClient`       |

Каждый server-wrapper:
- Экспортирует `generateMetadata` с per-locale `meta.*` namespace;
- Публичные страницы (catalog, detail) имеют canonical + hreflang;
- Animal detail динамически подставляет `{name}` и `{breed}` в title;
- Приватные страницы (dashboards, login, signup, farmer/*) помечены
  `robots: { index: false, follow: false }`.

Underscore-prefix (`_client.tsx`) предотвращает автоматическое
превращение файла в роут Next-ом.

### Messages — `meta.*` namespace

Добавлен в en/ru/kk:
- `meta.defaultTitle` / `meta.defaultDescription`;
- `meta.catalog.title/description`;
- `meta.animal.title` (с ICU-плейсхолдерами `{name}` и `{breed}`),
  `fallbackDescription`, `notFoundTitle`, `notFoundDescription`;
- `meta.dashboard.title/description`;
- `meta.login.title/description`;
- `meta.signup.title/description`;
- `meta.farmer.dashboard.title/description`;
- `meta.farmer.addAnimal.title/description`.

## Финальный статус билда

```
✓ Compiled successfully in 23.2s
✓ TypeScript finished in 12.4s
✓ Generating static pages (5/5) in 366ms

Route (app)
┌ ○ /_not-found
├ ƒ /[locale]
├ ƒ /[locale]/animals
├ ƒ /[locale]/animals/[id]
├ ƒ /[locale]/dashboard
├ ƒ /[locale]/farmer/animals/new
├ ƒ /[locale]/farmer/dashboard
├ ƒ /[locale]/login
├ ƒ /[locale]/signup
├ ○ /icon.svg          ← новое
├ ○ /robots.txt        ← новое
└ ○ /sitemap.xml       ← новое
```

IBM Plex восстановлен в `app/layout.tsx` для production (в sandbox
временно стабился на system fonts из-за 403 на `fonts.googleapis.com`
— это не касается локальной разработки и Vercel).

## Полный 5-сессионный редизайн закрыт

```
Session 1  ✓  Foundation: tokens, typography, UI primitives, navbar, footer
Session 2  ✓  Landing: hero, lifecycle, benefits, featured, waterfall, trust grid
Session 3  ✓  Product: catalog + due-diligence cockpit с 5 табами
Session 4  ✓  Dashboards + auth: investor cockpit, farmer control, login, signup
Session 5  ✓  Image pipeline, metadata, SEO, 404, structured data
```

## Как запустить

```bash
npm install
npm run dev
```

Или production:

```bash
npm run build
npm start
```

`/sitemap.xml` и `/robots.txt` доступны сразу после запуска.
