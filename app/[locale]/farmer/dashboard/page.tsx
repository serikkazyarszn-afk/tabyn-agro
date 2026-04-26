import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import FarmerDashboardClient from './_client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.farmer.dashboard' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default function FarmerDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <FarmerDashboardClient params={params} />;
}
