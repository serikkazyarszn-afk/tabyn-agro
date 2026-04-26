import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import AnimalDetailClient from './_client';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tabyn-agro.vercel.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const animal = DEMO_ANIMALS.find((a) => a.id === id);
  const t = await getTranslations({ locale, namespace: 'meta.animal' });

  if (!animal) {
    return {
      title: t('notFoundTitle'),
      description: t('notFoundDescription'),
    };
  }

  const title = t('title', { name: animal.name, breed: animal.breed || '' });
  const description = animal.description?.slice(0, 155) || t('fallbackDescription');

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/animals/${id}`,
      languages: {
        en: `${SITE_URL}/en/animals/${id}`,
        ru: `${SITE_URL}/ru/animals/${id}`,
        kk: `${SITE_URL}/kk/animals/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/animals/${id}`,
      type: 'article',
    },
  };
}

export default function AnimalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return <AnimalDetailClient params={params} />;
}
