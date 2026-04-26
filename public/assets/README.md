# Tabyn image assets

This folder contains every image, icon and illustration the app renders.
All of them are **SVG-first** and brand-compliant. Photographic assets
were deliberately removed because the originals were below the brand
standard (275×183 px cow / camel / goat images — not acceptable for a
premium agri-finance product).

## Current layout

```
public/assets/
├── animals/           Schematic placeholders (SVG, 800×500, 16:10)
│   ├── cow.svg
│   ├── sheep.svg
│   ├── horse.svg
│   ├── goat.svg
│   └── camel.svg
├── brand/             Brand marks (SVG)
│   ├── icon.svg       32×32 app / favicon mark
│   └── wordmark.svg   220×60 horizontal wordmark
└── og/                Social share cards (SVG, 1200×630)
    └── og-default.svg
```

## Usage in the app

- `lib/demo-data.ts` points every demo animal at the matching
  `/assets/animals/<type>.svg`. `<img src>` / `next/image` both render
  them crisp at any size.
- `components/ui/logo.tsx` draws the same abstract mark as
  `brand/icon.svg` using inline SVG, so the navbar / footer do not need
  a network request.
- Root metadata in `app/layout.tsx` references `og/og-default.svg` for
  Open Graph + Twitter previews. (Some social scrapers require PNG —
  rasterise to `og-default.png` on publish day; see below.)

## Art direction (from Forensic Redesign Master Prompt)

Everything must read as **documentary agri-finance**:
- Palette: `bg-950`, `surface-900/800`, `border-700`, `text-primary`,
  brand-primary emerald `#4FA26D`, brand-secondary gold `#C6A45D`.
- Subjects are drawn as abstract silhouettes, **not** mascot
  illustrations and **not** ethnic clip-art.
- Every placeholder includes a horizon line + grid pattern + corner
  registration marks + a mono-font species label. The frame reads as
  "observed / tracked" rather than "cute".

## Upgrade path — replacing placeholders with real photography

When real livestock photography is commissioned, follow the master-prompt
spec exactly:

- **Source master:** ≥ 3840×2160 PNG.
- **Designer master:** ≥ 2560×1440 PNG.
- **Production minimum:** 1920×1080 PNG.
- **Derivative formats:** `next/image` auto-produces WebP/AVIF; ship
  the PNG master only.
- **Composition:** 70–82 % of the frame for card view, 16:9 for detail,
  35–45 % negative space for hero.
- **Light:** natural daylight / controlled golden hour only. No HDR,
  no harsh noon light.
- **Background:** real pasture or stable with depth; no clutter, no
  humans, no fences crossing the head.

### Naming convention

```
animal-{species}-{breed}-{region}-{angle}-{usage}-{version}.png
```

Examples:
```
animal-cow-kazakh-white-almaty-3q-card-v01.png
animal-camel-bactrian-mangystau-side-hero-v02.png
```

### Drop-in replacement

1. Save the 1920×1080+ PNG into `public/assets/animals/photographic/`
   following the naming convention.
2. Update `lib/demo-data.ts` (or, in production, the Supabase record)
   to point at the new URL.
3. The `<AnimalCard>` and `<AnimalDetail>` components already use
   `object-cover` against a 16:10 / 16:9 container, so the new photo
   slots in without layout changes.
4. When a lot is missing photography, the components fall back to the
   schematic SVG automatically — so a half-migrated catalog keeps a
   consistent look.

### QA checklist (short form)

- [ ] Source master ≥ 3840×2160.
- [ ] Breed is identifiable.
- [ ] Eye, muzzle, fur texture readable at 200 % zoom.
- [ ] No JPEG artefacts, no fake HDR, no cartoon filters.
- [ ] Safe area preserved for badges (top-left asset ID, top-right
      status, bottom-left verified chip).
- [ ] Background does not pull the eye away from the subject.
- [ ] Colour grading does not fight the dark UI.
- [ ] Cards from the same session look like one family, not random
      stock.

## Do not

- Do not add emoji-style illustrations. Product surfaces ship without
  emoji per brandbook.
- Do not re-introduce the low-resolution JPEGs from the original repo.
- Do not use third-party stock-photo sites without explicit editorial
  approval — stock imagery is banned for the catalog surface.
- Do not vary the SVG palette per image. All placeholders share the
  same sky / land / horizon gradient so the catalog reads as a coherent
  system.
