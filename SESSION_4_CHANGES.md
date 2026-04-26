# Tabyn — Session 4: Dashboards & Auth

Четвёртый слой редизайна. **Билд прошёл** (Next 16.2.3 + Turbopack,
TypeScript чист, 8 роутов, static ✓).

## Что изменилось

### Investor Portfolio Cockpit — `app/[locale]/dashboard/page.tsx`

Из списка инвестиций с 4 KPI-карточками переписан в полноценный
портфельный интрумент:

- **Header** — badge, H1, subtitle, primary CTA «Browse animals».
- **KPI row** — 4 ячейки в едином `border-700` grid (hairline между
  ними): Total invested (с количеством лотов), Projected share
  (brand), Realized profit (positive), Wallet balance (с top-up
  кнопкой).
- **Exposure by species** — SVG-donut с сегментами по `data-01..05`
  палитре, легенда справа (тип + %), центр показывает количество
  species.
- **Upcoming payouts** — список active-лотов по возрастанию months-left,
  с projected amount справа.
- **Positions table** — полноценная таблица на десктопе (Asset / Farm /
  Invested / Projected / Progress / Status) с hover-состоянием, progress
  bar, profit% под суммой. На мобильном — карточки с 2-col dl и
  funding bar. Вся таблица wrapped в Links на detail page.
- **Bottom strip** — три side-cards:
  - **Activity feed** (invested / payout / update) с ArrowDown/Up
    иконками;
  - **Alerts** (warning / info) с цветными dot-маркерами — update
    pending, doc ready, pre-sale window approaching;
  - **Document center** — Q1 report, vet passports, active contracts,
    payout statements, каждый с ArrowRight и датой в mono-font.

### Farmer Control Room — `app/[locale]/farmer/dashboard/page.tsx`

Из «список животных + статус-апдейт» — в operational cabinet:

- **KPI row** (4 ячейки): Total animals, Total investors (brand),
  Active growing, Projected payout (gold, 30% share).
- **Farm profile readiness** — SVG-ring с процентом (brand stroke),
  описание, 6-item checklist (basics, farm docs, vet acc, payout,
  photos, bank) с done/pending states, кнопка «Finish» у незавершённых.
- **Listing health & hints** — 3 AI-style подсказки разных тонов:
  warning (update pending), gold (price optimization), tech (new doc).
  Каждая — icon-box, title, body, inline CTA.
- **Listings list** — каждый лот: avatar + name + asset ID + status badge,
  3-mini-stats (price, investors X/Y, fill%), funding bar + "fully
  funded" или "N slots free", два action-buttons (Post update, →
  Next status), иконка-кнопка открытия лота.
- **Inline update composer** — разворачивается под лотом при клике Post
  update: textarea с hint, Cancel/Publish, success-state "Update
  published to investors".

### Login — `app/[locale]/login/page.tsx`

Из minimal email+password в secure split-scene:

- **Desktop left pane** — gradient-horizon + brand radial overlay,
  wordmark наверху, trust-секция с H2 + body + 4-item list (verified,
  documents, updates, encrypted), partners-note внизу.
- **Right pane** — form:
  - **Method selector** (tablist) — 3 таба: Password / SMS / QR;
  - **Password tab** — email, password с show/hide eye-toggle, remember
    checkbox + forgot link, error в destructive-box, primary submit,
    encrypted-note внизу;
  - **SMS tab** — phone input с 🇰🇿 leading, send-code button (disabled),
    note про "wire for SMS OTP";
  - **QR tab** — surface-card с SVG-faux-QR-кодом (с Tabyn mark в
    центре), title + body;
  - Sign-up link + "need help?" support link.
- Работающая Supabase auth сохранена.

### Signup — `app/[locale]/signup/page.tsx`

Из 1-step form с эмоджи-cards в 2-step serious onboarding:

- **Left pane** (desktop) — trust-section с 3-step prog indicator
  (Choose mode, Confirm identity, Complete verification), done/active
  состояния.
- **Step 1 (Role)** — две **role cards БЕЗ эмоджи**: Investor
  (TrendingUp, brand accent) и Farmer (Sprout, gold accent). Каждая
  карточка: иконка, title, body, 3 bullet points под hairline. Active
  state — подсветка border + CheckCircle индикатор в правом верхнем
  углу.
- **KYC expectation box** — info-card с FileCheck иконкой,
  объясняющая что потребуется национальный ID и видеопроверка.
- **Step 2 (Identity)** — back-to-role link с выбранной ролью в
  breadcrumb, name/email/password inputs, **password strength meter**
  (4-segment bar: destructive→warning→tech→positive), show/hide eye,
  2 consent checkboxes (terms + comms, с required/optional), error в
  destructive-box, primary submit disabled до consent.
- **Query param `?role=farmer`** подхватывается — автоматически
  переключает на Step 2 с выбранным farmer-режимом (из landing CTA
  «For farmers»).
- Encrypted note внизу, support link.

### Add Animal — `app/[locale]/farmer/animals/new/page.tsx`

Из single-form в 2-column structure:

- **Left (form)** — 3 `surface-card` секции:
  - **Identity** — name + type select + breed с контекстными hints;
  - **Investment terms** — price с leading `₸`, return% с trailing %
    (и hint про pre-tax), duration с trailing "mo.", slots с hint;
  - **Description & media** — textarea с hint "be specific, not
    marketing-y", image URL с hint;
- **Verification notice** — surface-card с FileText иконкой:
  "Before publishing Tabyn will request vet passport (forms №1-2),
  farm registration extract, breed certificate".
- Cancel + Submit buttons.
- **Right (sticky preview)** — live asset-card preview: aspect-16:10
  (с fallback на type-тег если нет image), draft asset ID chip,
  name/breed, 2-cell metric tiles (return/term), 3-row price/raise/
  investor-share в mono-tabular, slots count внизу. Пересчитывается
  при каждом вводе. Note «Investors see exactly this.»
- Success state с positive icon + redirect.

### Locale messages

Добавлено ~180 ключей:
- `dashboard.*` — badge, kpiLabel, projectedShare, realizedProfit,
  exposure*, upcoming*, monthsLeft, cols.*, activity.*, alerts.*,
  documentsTitle, docs.*;
- `farmer.dashboard.*` — badge, totalInvestors, activeListings,
  projectedPayout, readiness*, profileTasks.*, finish, health*,
  hints.* (3 hints с title/body/cta), listings*, composer*,
  updateSent;
- `farmer.addAnimal.*` — badge, backToDashboard, sections.* (3
  секции с title/subtitle), nameHint, breed*, returnHint, slotsHint,
  mo, description*, imageHint, verificationNotice*, preview*,
  successBody;
- `auth.*` — trustBadge/Title/Body, trust.* (4), partnersNote,
  onboardingBadge/Title/Body, steps.* (3), needHelpGeneral;
- `auth.login.*` — methodLabel/Password/Sms/Qr, phone, phoneHint,
  sendCode, smsNote, qrTitle/Body/Note, rememberDevice, forgot,
  hide/showPassword, encryptedNote, needHelp;
- `auth.signup.*` — stepRoleLabel, stepIdentityLabel, identityTitle,
  identitySubtitle, investor/farmerBody, benefits.* (6),
  kycExpectation, continue, backToRole, namePlaceholder,
  passwordHint, consent.* (5), errors.consent.

## Что осталось для Session 5

- **Image pipeline** — replace `public/*.jpg` с schematic
  placeholders по брендбуку (SVG assets набор) + `next/image`
  optimisation конфигурация + naming convention docs.
- **Metadata polish** — per-route metadata, structured data (JSON-LD
  для product/organization), sitemap.xml, robots.
- **Illustrations / icons polish** — если нужно, кастомные SVG
  illustrations для empty states, 404, etc.

## Как запустить

```bash
npm install
npm run dev
```

Key routes:
- `/ru/dashboard` — investor cockpit
- `/ru/farmer/dashboard` — farmer control room
- `/ru/farmer/animals/new` — add animal with live preview
- `/ru/login` — secure login с SMS/QR табами
- `/ru/signup` — 2-step onboarding
- `/ru/signup?role=farmer` — signup с farmer-preset (из landing)
