# Session 6 — Этап A: Foundation Redesign

**Дата:** 25 апреля 2026
**Цель:** Внедрить новую дизайн-систему и базовые UI-примитивы из 10-фазного плана редизайна.

## Что сделано

### 1. Дизайн-система (`app/globals.css`)

Полностью переписан, но с **обратной совместимостью**.

**Новое:**
- Слоистая система фонов: `--bg-absolute / --bg-primary / --bg-elevated / --bg-overlay`
- Поверхности: `--surface-1 / --surface-2 / --surface-3`
- Бордеры через альфа-канал: `--border-subtle / --border-soft / --border-hard`
- Сигнальные цвета для финтеха: `--signal-up / --signal-down / --signal-warn / --signal-info`
- Парные брендовые токены для градиентов: `--brand-primary-2`, `--brand-secondary-2`
- Полная лестница радиусов: `--r-xs / --r-sm / --r-md / --r-lg / --r-xl / --r-2xl / --r-pill`
- Стек теней со свечениями: `--sh-1 / --sh-2 / --sh-lifted / --sh-glow-brand / --sh-glow-gold`
- Easing-функции: `--ease-standard / --ease-emphasized / --ease-out-expo`
- 10 keyframe-анимаций с utility-классами `.anim-*`:
  `pulse-dot`, `fade-in`, `slide-in-up`, `toast-in`, `ticker`, `float-subtle`,
  `mesh-1/2/3`, `shimmer`, `bar-grow`
- Реусабельные градиент-классы: `.gradient-brand`, `.gradient-gold`, `.gradient-hero-dual`

**Сохранено (legacy aliases):**
Все существующие токены (`--bg-950`, `--surface-900/800/700`, `--border-700/600`,
`--background`, `--surface`, `--accent` и др.) продолжают работать как алиасы
на новые токены. Существующие 17+ компонентов не сломаются.

### 2. UI-примитивы (`components/ui/`)

**Button** (`button.tsx`)
- Все 5 существующих вариантов сохранены с тем же API.
- `primary` теперь использует градиент `brand → brand-2` + glow shadow.
- **Новый вариант `gold`** для премиум-моментов.
- Добавлен `active:scale-[0.97]` для физичного press feedback.

**Badge** (`badge.tsx`)
- Все существующие варианты + legacy aliases (`accent / success / muted`) сохранены.
- **Новый проп `live`** — пульсирующая точка для real-time индикаторов.
- **Новые варианты `up` / `down`** — для финансовых сигналов.
- **Алиас `aqua`** для существующего `tech`.

**Card** (`card.tsx`)
- Все существующие elevations сохранены: `flat / raised / elevated / proof`.
- **Новый elevation `glow`** — анимированный градиентный border на hover (premium feel).
- **Новый проп `radius`** (`md / lg / xl`) для гибкости.
- Hover-lift улучшен (smoother translate + shadow).

### 3. Новые UI-компоненты

**Toast-система** (`components/ui/toast.tsx`) — НОВЫЙ
- `ToastProvider` оборачивает дерево, `useToast()` — хук.
- 5 типов: `success / error / info / warning / transaction`.
- Auto-dismiss 4.2с (настраивается).
- Позиция bottom-right, slide-in анимация.
- `aria-live` для скринридеров. `Esc` закрывает последний.

**Command Palette** (`components/ui/command-palette.tsx`) — НОВЫЙ
- Открытие на `⌘K` / `Ctrl+K` (глобальный хоткей).
- 12 команд в 3 группах: Navigate / Action / Help.
- Полная клавиатурная навигация (↑↓, Enter, Esc).
- Интеграция с `next/navigation` — реальный routing.
- I18n-ready через `useTranslations('ui.commandPalette')`.
- Дополнительный компонент `CommandPaletteTrigger` для встраивания
  в Navbar.

### 4. Layout-обновления

**`app/[locale]/layout.tsx`**
- Дерево обёрнуто в `<ToastProvider>` и `<CommandPaletteProvider>`.
- Всё остальное (metadata, structured data, Supabase auth-flow) сохранено.

**`components/layout/navbar.tsx`**
- Добавлен `<CommandPaletteTrigger />` в правый кластер (виден на ≥md).
- Scrolled-state: `bg-bg-primary/85` + `backdrop-blur-[14px]`.
- Высоты слегка уменьшены (96 → 84, scrolled 84 → 72) для современного product feel.
- Auth-flow, локали, мобильное меню — без изменений.

### 5. I18n

Добавлена секция `ui` во все три файла переводов:
- `messages/en.json` — 24 записи в `ui.commandPalette.cmd`
- `messages/ru.json` — 24 записи
- `messages/kk.json` — 24 записи

## Как проверить

```bash
npm install
npm run dev
```

Открыть `http://localhost:3000/ru` и убедиться:

- [x] Лендинг выглядит как раньше — ничего не сломалось
- [x] Кнопки `Войти` / `Регистрация` стали ярче (градиент)
- [x] В правом верхнем углу появилась кнопка **Поиск** с плашкой `⌘K`
- [x] `⌘K` (Mac) / `Ctrl+K` (Win/Linux) открывает Command Palette
- [x] ↑↓ / Enter / Esc работают в палитре
- [x] Переключение локалей корректно меняет язык в палитре
- [x] В консоли браузера — нет ошибок

## Использование новых API

### Toast

```tsx
'use client';
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const toast = useToast();
  return (
    <button onClick={() => toast.push({
      type: 'success',
      title: 'Инвестиция подтверждена',
      message: 'Вложено ₸500 000 в Akbozat',
    })}>
      Invest
    </button>
  );
}
```

### Command Palette

Открывается автоматически по `⌘K`. Программно:

```tsx
'use client';
import { useCommandPalette } from '@/components/ui/command-palette';

function MyComponent() {
  const { toggle } = useCommandPalette();
  return <button onClick={toggle}>Open palette</button>;
}
```

Чтобы добавить новую команду — отредактировать массив `commands`
в `components/ui/command-palette.tsx` и добавить ключ в
`ui.commandPalette.cmd` во всех трёх JSON.

### Новые Tailwind-классы

Цвета: `bg-bg-primary/elevated/overlay`, `bg-surface-1/2/3`,
`border-border-subtle/soft/hard`, `text-signal-up/down/warn/info`,
`bg-brand-2`, `text-aqua`.

Тени: `shadow-1/2/lifted`, `shadow-glow-brand`, `shadow-glow-gold`.

Градиенты: `gradient-brand`, `gradient-gold`, `gradient-horizon`,
`gradient-yield`, `gradient-proof`, `gradient-hero-dual`.

Анимации: `anim-pulse-dot`, `anim-fade-in`, `anim-slide-in-up`,
`anim-toast-in`, `anim-float`, `anim-ticker`.

## Что дальше — Этап B (Лендинг)

После проверки этого этапа можно начинать Этап B — портирование 10 секций
лендинга из прототипа Claude Design в Next.js:

1. Hero (mesh-gradient + dashboard mockup)
2. LiveTicker
3. HowItWorks (sticky-scroll storytelling)
4. BentoShowcase
5. ProfitCalculator
6. Editorial Philosophy
7. TrustWall
8. Testimonials
9. FAQ
10. Новый Footer

Все компоненты Этапа A (`Button`, `Badge`, `Card`, `Toast`, `CommandPalette`)
будут использоваться как фундамент.
