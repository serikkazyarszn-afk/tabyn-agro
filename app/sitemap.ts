import type { MetadataRoute } from 'next';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tabyn-agro.vercel.app';

const LOCALES = ['en', 'ru', 'kk'] as const;

// Stable, indexable routes. Private surfaces (dashboard, farmer/*, login,
// signup) are excluded from sitemap because they require auth and carry
// no public SEO value.
const ROUTES = ['', '/animals', '/#how-it-works', '/#trust'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return LOCALES.flatMap((locale) =>
    ROUTES.map((route) => {
      const url = `${SITE_URL}/${locale}${route}`;
      const alternates = Object.fromEntries(
        LOCALES.map((l) => [l, `${SITE_URL}/${l}${route}`]),
      );
      return {
        url,
        lastModified: now,
        changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
        priority: route === '' ? 1 : 0.7,
        alternates: {
          languages: alternates,
        },
      };
    }),
  );
}
