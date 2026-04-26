import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import DashboardClient from './_client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.dashboard' });
  return {
    title: t('title'),
    description: t('description'),
    robots: { index: false, follow: false },
  };
}

export default function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <DashboardClient params={params} />;
}
