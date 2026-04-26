import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AnimalsCatalogClient from './_client';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tabyn-agro.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.catalog' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${SITE_URL}/${locale}/animals`,
      languages: {
        en: `${SITE_URL}/en/animals`,
        ru: `${SITE_URL}/ru/animals`,
        kk: `${SITE_URL}/kk/animals`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${SITE_URL}/${locale}/animals`,
    },
  };
}

export default function AnimalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <AnimalsCatalogClient params={params} />;
}
