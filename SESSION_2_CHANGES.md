# Tabyn — Session 2: Landing surfaces redesigned

Второй слой редизайна. **Билд прошёл** (next.js 16.2.3 + turbopack),
TypeScript-проверка чистая, все страницы генерируются (включая старые
экраны, которые ещё не переделаны).

## Что изменилось

### Landing components — полностью переписаны
- `components/landing/hero.tsx` — documentary agri-finance hero. Два столбца:
  value stack слева (badge dot, заголовок, subtitle, два CTA, 4 real-metric chip),
  asset passport card справа (schematic SVG подложка вместо низкорезкого
  фото, верифицирован, asset ID, регион, live-трекинг, три метрика-tile —
  Return / Term / Risk, funding bar, 4 proof-строки). Hero не использует
  background photo — вместо этого мягкий gradient-horizon + brand radial
  накладываются на bg-950.

- `components/landing/how-it-works.tsx` — полный **investment lifecycle**
  из 6 стадий: `verify → fund → track → sale → payout → archive`. На десктопе
  горизонтальный рельс с connector-линией и номерами `01..06`; на мобильном
  — вертикальный список с step-маркерами. Три фазы подкрашены разным цветом
  (brand / tech / brand-secondary) с легендой внизу.

- `components/landing/benefits.tsx` — dual-mode story-arc. Toggle
  «Инвестору / Фермеру» сверху, 4-карточная benefit-матрица. Каждая карточка
  содержит иконку, title, description и **proof-point** (разделённый
  hairline-линией, префикс точкой). Без стоковых фото.

- `components/landing/featured-animals.tsx` — новая секция входа в каталог.
  Rationale strip сверху («Подбор для вас» + объяснение), 3 карточки,
  сильный CTA «View all». Использует новую AnimalCard.

- `components/landing/profit-sharing.tsx` — **payout waterfall**.
  Слева narrative + 70/30 split bars (с proof-описанием и disclosure-note).
  Справа waterfall-таблица: Principal → Sale price → Gross profit →
  Platform fee → Investor share → Farmer share, с подсветкой ключевых
  строк. Наверху — toggle **Bear / Base / Bull** (×1.06 / ×1.28 / ×1.45),
  который пересчитывает всё live. Внизу 3-tile summary: ROI, срок,
  активный сценарий.

- `components/landing/trust-section.tsx` — **evidence grid**.
  Восемь элементов доверия: verified farmers, vet passport, animal ID,
  legal agreement, payout history, monthly updates, document viewer,
  support SLA. Каждый элемент имеет **evidence-строку** в mono-шрифте
  (формы, tag-номера, SLA-времена). Внизу closure-strip с ссылкой
  «Как работает верификация».

### Animal Card — переписан полностью
- `components/animals/animal-card.tsx` — **asset passport**. Эмоджи удалены
  из product layer полностью. Media занимает 16:10. Верхний бейдж слева —
  asset ID (`CO-2026-0001`). Верхний справа — статус. Внизу слева —
  verified-farm chip. В контенте: название, порода, регион + ферма,
  metrics-row (return / term), funding-bar. Schematic SVG-fallback
  используется когда `image_url` отсутствует — вместо пустой области
  показывается «data card» с лэйблом типа животного.

### UI primitives — минорные фиксы
- `components/ui/badge.tsx` — тип `variant` теперь явно принимает
  legacy-варианты (`accent`/`success`/`muted`), чтобы старые экраны,
  ещё не переписанные в Session 3, продолжали компилироваться.
- `components/ui/input.tsx` — `prefix`/`suffix` переименованы в
  `leading`/`trailing`, потому что HTML-атрибут `prefix: string`
  конфликтовал с `ReactNode`.

### Locale messages
- `messages/en.json`, `ru.json`, `kk.json` — добавлено ~100 новых ключей:
  - `hero.passport.*` (verified, region, statusLive, assetName, breed,
    perSlot, return, term, months12, risk, riskLow, funded, proof*)
  - `howItWorks.badge`, `howItWorks.title`, `howItWorks.subtitle`,
    `howItWorks.phase{1,2,3}Label`, `howItWorks.stages.{verify,fund,track,
    sale,payout,archive}.{title,description}`
  - `benefits.modeLabel`, `benefits.modeInvestor`, `benefits.modeFarmer`,
    `benefits.{investors,farmers}.proofs.*`
  - `featuredAnimals.rationale`, `featuredAnimals.rationaleDetail`,
    `featuredAnimals.verifiedShort`
  - `profitSharing.disclosure`, `profitSharing.waterfall.*`
  - `trust.subtitle`, `trust.closureNote`, `trust.closureLink`,
    `trust.items.*.evidence` и новые элементы (vetPassport, animalId,
    payoutHistory, docViewer)

## Статус билда

- `✓ Compiled successfully` (Turbopack, 25.5s)
- `✓ TypeScript` (13.3s)
- `✓ Generating static pages (3/3)`
- Все маршруты подтверждены: `/[locale]`, `/[locale]/animals`,
  `/[locale]/animals/[id]`, `/[locale]/dashboard`,
  `/[locale]/farmer/{dashboard,animals/new}`, `/[locale]/login`,
  `/[locale]/signup`.

Билд в моей sandbox был проверен с временной подменой IBM Plex на
системный стек (sandbox блокирует fonts.googleapis.com). **В архиве
вернул настоящий `IBM_Plex_Sans + IBM_Plex_Mono`** — локально и на
Vercel всё работает.

## Что пока не тронуто (остаётся для Sessions 3–5)

- `app/[locale]/animals/page.tsx` — каталог (фильтры, grid).
- `app/[locale]/animals/[id]/page.tsx` — detail page.
- `app/[locale]/dashboard/page.tsx` — портфель инвестора.
- `app/[locale]/farmer/dashboard/page.tsx` — кабинет фермера.
- `app/[locale]/farmer/animals/new/page.tsx` — форма добавления.
- `app/[locale]/login/page.tsx`, `signup/page.tsx`.
- Низкорезкие фото в `public/` — оставлены до image-pipeline сессии.

Эти экраны **продолжают рендериться** благодаря обратной совместимости
цветовых токенов и типов. Визуально они уже подтянуты к новой палитре.

## Как запустить

```bash
npm install
npm run dev
```

Если ещё нет `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` —
задай их в `.env.local` или запусти с поддельными значениями для
визуальной проверки страниц без auth.
