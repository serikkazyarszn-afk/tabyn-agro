import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { createClient } from '@/lib/supabase-server';
import Providers from '@/components/providers';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let navUser: { role: string; name: string } | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle();
    if (profileError) console.error('Layout profile fetch failed:', profileError.message);
    if (profile) {
      navUser = { role: profile.role, name: profile.full_name };
    }
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Navbar locale={locale} user={navUser} />
        <main className="flex-1 pt-16">{children}</main>
        <Footer locale={locale} userRole={navUser?.role ?? null} />
      </Providers>
    </NextIntlClientProvider>
  );
}
