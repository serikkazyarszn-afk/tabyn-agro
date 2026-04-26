# Tabyn — Session 1: Brand foundation

Этот архив — **первый слой редизайна** по forensic master prompt. Он не трогает
бизнес-логику (Supabase, routing, demo-data), не ломает существующие страницы
и не требует новых зависимостей. Всё строится на том же `package.json`.

## Что изменилось

### Дизайн-токены и типографика
- `app/globals.css` — полностью переписан. Новая цветовая система из брендбука
  (page 10): `bg-950 #07130F`, `surface-900/800/700`, `border-700/600`,
  `text-primary/secondary/tertiary`, `brand` (emerald `#4FA26D`),
  `brand-secondary` (gold `#C6A45D`), `tech` (teal), вся data-palette и
  утилиты `gradient-horizon`, `gradient-yield`, `gradient-proof`,
  `surface-elevated`, `surface-card`.
  Сохранены **легаси-алиасы** (`bg-background`, `bg-surface`, `text-accent`,
  `text-muted`, ...) — поэтому старые экраны продолжают работать, пока их
  переписывают в следующих сессиях.
- `app/layout.tsx` — IBM Plex Sans + IBM Plex Mono через `next/font/google`
  с подключённой кириллицей (`subsets: ['latin', 'latin-ext', 'cyrillic',
  'cyrillic-ext']`), полный metadata-слой: OG, Twitter, canonical, alternates
  для `en/ru/kk`, robots, формат-детекция.
- Tabular numerals включаются классом `.tabular` — для финансовых цифр.

### Бренд и лого
- `components/ui/logo.tsx` — **новый абстрактный знак** (горизонт + дуга
  роста + точка капитала). Убран иллюстративный «лошадиный» логотип.
  Экспорты: `TabynMark` (только символ) и `TabynWordmark` (symbol + wordmark).
- Navbar и Footer используют новый wordmark напрямую, без png-файла.
- Баг `h-63` в старом navbar устранён.

### UI-примитивы
- `components/ui/button.tsx` — 5 вариантов (primary/secondary/tertiary/ghost/
  destructive), 3 размера (40/48/56 px), WCAG-touch-target, focus-visible ring
  в 2px, поддержка `loading` и `fullWidth`.
- `components/ui/card.tsx` — 4 уровня поверхности (flat/raised/elevated/proof),
  опции `hover` и `padded`.
- `components/ui/badge.tsx` — только статусные значения (brand/gold/tech/
  positive/warning/destructive/neutral/outline), опциональный `dot`, обратная
  совместимость со старыми `accent`/`success`/`muted`.
- `components/ui/input.tsx` — persistent labels, 48px высота, `hint` и `error`
  в зарезервированном пространстве (форма не прыгает), `prefix`/`suffix` слоты,
  правильные `aria-invalid` и `aria-describedby`.

### Layout
- `components/layout/navbar.tsx` — sticky-shrink от 64 до 56 px, backdrop-blur,
  трёхсегментный переключатель локалей EN / РУС / ҚАЗ, desktop nav с Explore /
  Learn / Verify, mobile sheet с scrim, корректная поддержка `user` role для
  инвестора и фермера.
- `components/layout/footer.tsx` — брендовая колонка с иконками доверия и
  региона, 4 колонки ссылок (Platform / Company / Legal / Support), отдельный
  disclaimer блок (риск-предупреждение) и нота о валюте `₸ (KZT)`.

### Локализация
- `messages/en.json`, `ru.json`, `kk.json` — добавлены ключи `nav.verify` и
  полный блок `footer.*` (tagline, trustNote, region, legal, support, disclaimer,
  rights, currencyNote). Три локали синхронизированы.

## Что **не** трогалось (остаётся на следующие сессии)
- `app/[locale]/page.tsx` и компоненты `components/landing/*` (Hero, HowItWorks,
  Benefits, FeaturedAnimals, ProfitSharing, TrustSection).
- Каталог `app/[locale]/animals/page.tsx` и детальная страница
  `app/[locale]/animals/[id]/page.tsx`.
- Дашборды инвестора и фермера.
- `components/animals/animal-card.tsx` (эмоджи всё ещё там).
- `app/[locale]/login/page.tsx` и `signup/page.tsx`.
- Низкоразрешённые фото животных в `public/*.jpg`.

Эти экраны **продолжают рендериться корректно** потому, что легаси-токены
(`bg-accent`, `text-muted`, и т.д.) в `globals.css` теперь маппятся на
новые брендовые значения. Визуально — уже не неоновый лайм, а зрелый emerald.

## Как запустить

```bash
npm install
npm run dev
```

Если получаешь ошибку по Google Fonts в закрытой сети — проверь, что
`fonts.googleapis.com` и `fonts.gstatic.com` разрешены. На Vercel всё
заработает из коробки.

## Следующие сессии по мастер-промпту

1. **Session 2 (landing):** Hero, HowItWorks, Benefits, FeaturedAnimals,
   ProfitSharing (payout waterfall), TrustSection.
2. **Session 3 (product surfaces):** Catalog с sticky filters, AnimalCard без
   эмоджи, Animal Detail как due-diligence cockpit с табами.
3. **Session 4 (dashboards + auth):** Investor cockpit, Farmer control room,
   Login / Signup.
4. **Session 5 (imagery + metadata):** image pipeline для Full HD PNG-мастеров,
   placeholder-SVG по брендбуку, schematic-иллюстрации.
