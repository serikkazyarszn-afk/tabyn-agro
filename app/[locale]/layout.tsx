import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { ToastProvider } from '@/components/ui/toast';
import { CommandPaletteProvider } from '@/components/ui/command-palette';
import { createClient } from '@/lib/supabase-server';

type Locale = 'en' | 'ru' | 'kk';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tabyn-agro.vercel.app';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_KZ',
  kk: 'kk_KZ',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) return {};

  const t = await getTranslations({ locale, namespace: 'meta' });
  const title = t('defaultTitle');
  const description = t('defaultDescription');
  const canonical = `${SITE_URL}/${locale}`;
  const alternates = Object.fromEntries(
    (['en', 'ru', 'kk'] as const).map((l) => [l, `${SITE_URL}/${l}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ...alternates, 'x-default': `${SITE_URL}/en` },
    },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: 'Tabyn',
      title,
      description,
      locale: OG_LOCALE[locale as Locale],
      alternateLocale: Object.values(OG_LOCALE).filter(
        (v) => v !== OG_LOCALE[locale as Locale],
      ),
      images: [
        {
          url: `${SITE_URL}/assets/og/og-default.svg`,
          width: 1200,
          height: 630,
          alt: 'Tabyn — traceable capital in living assets',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/assets/og/og-default.svg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: 'meta' });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let navUser: { role: string; name: string } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();
    if (profile) {
      navUser = { role: profile.role, name: profile.full_name };
    }
  }

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Tabyn',
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/assets/brand/icon.svg`,
    description: tMeta('defaultDescription'),
    email: 'hello@tabyn.kz',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KZ',
      addressRegion: 'Almaty',
    },
    areaServed: { '@type': 'Country', name: 'Kazakhstan' },
  };
  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Tabyn',
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
  };

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/*
        Etap A: wrap the tree with global UX providers.
        - ToastProvider renders a bottom-right stack available via useToast()
        - CommandPaletteProvider binds ⌘K globally and exposes useCommandPalette()
      */}
      <ToastProvider>
        <CommandPaletteProvider locale={locale} user={navUser}>
          <Navbar locale={locale} user={navUser} />
          <main className="flex-1 pt-24" lang={locale}>
            {children}
          </main>
          <Footer locale={locale} />
        </CommandPaletteProvider>
      </ToastProvider>

      {/* Structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
    </NextIntlClientProvider>
  );
}
