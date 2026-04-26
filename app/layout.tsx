import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const plexSans = IBM_Plex_Sans({
  variable: '--font-plex-sans',
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  variable: '--font-plex-mono',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://tabyn-agro.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Tabyn — Traceable capital in living assets',
    template: '%s — Tabyn',
  },
  description:
    'Цифровая инвестиционная платформа, которая превращает животноводческий актив в проверяемый, отслеживаемый и понятный финансовый объект. Казахстан.',
  keywords: [
    'agri-investment',
    'livestock investing',
    'Kazakhstan',
    'Tabyn',
    'инвестиции в скот',
    'мал инвестициясы',
  ],
  authors: [{ name: 'Tabyn' }],
  creator: 'Tabyn',
  applicationName: 'Tabyn',
  alternates: {
    canonical: '/',
    languages: {
      'en': '/en',
      'ru': '/ru',
      'kk': '/kk',
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Tabyn',
    title: 'Tabyn — Traceable capital in living assets',
    description:
      'Agri-investment platform for Kazakhstan. Fund livestock, verify every asset, share profit transparently.',
    locale: 'ru_KZ',
    alternateLocale: ['en_US', 'kk_KZ'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tabyn — Traceable capital in living assets',
    description:
      'Agri-investment platform for Kazakhstan. Fund livestock, verify every asset, share profit transparently.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      className={`${plexSans.variable} ${plexMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
