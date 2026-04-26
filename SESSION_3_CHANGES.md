# Tabyn — Session 3: Product surfaces

Третий слой редизайна — **product surfaces**: каталог и детальная страница
как due-diligence cockpit. **Билд прошёл** (Next 16.2.3 + Turbopack),
TypeScript-проверка чистая, все 8 роутов генерируются.

## Что изменилось

### Каталог — `app/[locale]/animals/page.tsx`

Переписан полностью. Из "узкие горизонтальные фильтры + 3 карточки" стал
полноценным investment browser-ом:

- **Sticky filter bar** (top-16, backdrop blur), активируется скроллом.
  Внутри:
  - поиск по названию, породе, ферме, региону (с кнопкой clear);
  - сортировка: Featured / Return desc/asc / Price asc/desc / Shortest term;
  - **density toggle** — Comfortable (3 cols) / Compact (4 cols) на
    десктопе;
  - кнопка **Filters** с счётчиком активных (мобильный drawer);
- **Filter chip rail** (desktop) — сгруппированные чипы по Species / Status /
  Risk / Region с tone-подсветкой (low=positive, medium=warning, high=destructive);
- **Risk derivation** — вычисляется из `expected_return_pct`
  (≥22% → high, ≥16% → medium, иначе low);
- **Featured sort** — verified farmers первыми, потом по funding velocity;
- **Mobile bottom-sheet** для фильтров с lock-scroll, drawer с секциями
  Sort / Species / Status / Risk / Region, footer с Clear + "Показать N";
- **Trust strip** над гридом с пояснением: каждый лот имеет vet passport
  и доступный пакет документов;
- **Empty state** с иконкой поиска и кнопкой Clear;
- Счётчик "N / Total shown" в хедере.

### Animal Detail — `app/[locale]/animals/[id]/page.tsx`

Полностью перестроен как **due-diligence cockpit** с 5 табами
(Overview / Documents / Updates / Risks / Farmer):

**Header** — asset ID, status badge (с dot), risk badge (positive/warning/
destructive), verified-farmer badge, H1 с названием, подзаголовок breed +
farm + region.

**Media** — 16:9 aspect, с overlay-карточками:
- верх-лево: вет ID с иконкой Stamp (`VET-2026-XXXX`);
- верх-право: дата листинга с CalendarClock;
- schematic SVG fallback если нет image_url.

**Tab navigation** — underline-стиль, иконки, `role="tablist"`, mobile
overflow-scroll.

**Overview panel:**
- Описание (если есть);
- **Key metrics dashboard** (4-cell grid): expected return, duration,
  price per slot, total raise;
- **Investment lifecycle timeline** — 5 этапов с состояниями
  done / active / pending, marker-circles, connector-line, ISO-даты
  справа;
- **Payout scenarios** — три карточки Bear / Base / Bull, каждая
  показывает projected investor share (70%), sale price, gross profit.
  Base использует реальный `expected_return_pct`; Bear = +6%, Bull = +10%
  относительно base.

**Documents panel** — 5 документов (vet passport, farm registration,
breed certificate, insurance policy, contract template) со структурой:
icon, title, mono-строка `ID · issuer · date · size`, кнопка скачать.
IPFS-notice снизу.

**Updates panel** — 4 timeline-записи с датой, автором (фермер или вет.
служба или Tabyn), title + body. Activity-иконка слева, все записи с
ISO-датой в mono.

**Risks panel** — summary-блок (risk level + explanation), затем список
из 6 индивидуальных рисков: marketPrice, health, weather, fx, liquidity,
farmerPerformance. У каждого dot-цвет, badge с уровнем, body. Disclaimer
внизу.

**Farmer panel** — карточка фермера с иконкой и verified-badge,
description; 4-cell stats grid (experience, cycles, on-time payout,
update cadence); секция credentials с 4-мя checklist-строками.

**Invest card (right rail, sticky)** — цена, risk badge, return+duration
2-cell grid, funding progress bar, primary CTA с disabled-логикой для
`status !== 'available'` или full, legal note внизу.

**Trust summary card** — под invest-картой: 5 proof-строк
(verified farmer, vet passport, animal ID, legal agreement, monthly
updates) с state-иконками.

**Invest modal** — bottom-sheet на мобильном, centered-dialog на
десктопе. Input суммы с leading `₸`, summary-блок (balance, gross
projected, your 70% share, total), agreement note, primary+ghost buttons.
Success state с positive icon.

### Locale messages

Добавлено ~130 ключей:
- `catalog.*` — badge, shown, searchPlaceholder, sortLabel, sort.*,
  density*, filters, species/status/risk/region, allRegions, riskLevels,
  clear, showN, emptyHint, trustNote;
- `animals.detail.*` — invest, unavailable, fullyFunded, legalNote,
  investModal.successTitle/Body/grossProjected/yourShare/total/agreementNote;
- `dueDiligence.*` — полный новый namespace: tabs, risk, about, keyMetrics,
  pricePerSlot, totalRaise, vetId, listed, lifecycle.*, scenarios.*,
  trustSummary, proof*, documentsIntro/Note, docs.*, issuer.*,
  updatesIntro, updates.u1..u4, updatedBy, riskSummary, riskExplain,
  risks.*, riskFooter, verifiedFarmer, farmerStats.*, farmerCredentials,
  credentials.*.

## Что пока не тронуто (Sessions 4–5)

- `app/[locale]/dashboard/page.tsx` — investor portfolio cockpit.
- `app/[locale]/farmer/dashboard/page.tsx` — farmer control room.
- `app/[locale]/farmer/animals/new/page.tsx` — add animal form.
- `app/[locale]/login/page.tsx`, `signup/page.tsx` — auth surfaces.
- Image pipeline + replacement of low-res `public/*.jpg`.

## Как запустить

```bash
npm install
npm run dev
```

Open `/ru/animals` for the catalog, `/ru/animals/1` for the detail cockpit.
