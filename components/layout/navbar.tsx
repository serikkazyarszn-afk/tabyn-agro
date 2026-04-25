'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase';

interface NavbarProps {
  locale: string;
  user?: { role: string; name: string } | null;
}

const supabase = createClient();

export default function Navbar({ locale, user: initialUser }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(initialUser ?? null);

  // Subscribe to auth state changes on the client so the navbar
  // always reflects the real session without needing a full page reload.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, full_name')
            .eq('id', session.user.id)
            .single();
          setUser(profile ? { role: profile.role, name: profile.full_name } : null);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const navLink = (href: string) => `/${locale}${href}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={navLink('/')} className="flex items-center group">
          <img
            src="/logo.png"
            alt="Tabyn"
            className="h-63 w-auto object-contain"
          />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href={navLink('/animals')}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t('animals')}
          </Link>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = navLink('/#how-it-works');
              }
            }}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t('howItWorks')}
          </button>

          {/* Language toggle */}
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            <button
              onClick={() => switchLocale('en')}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                locale === 'en'
                  ? 'bg-accent text-black font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLocale('ru')}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                locale === 'ru'
                  ? 'bg-accent text-black font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              РУС
            </button>
            <button
              onClick={() => switchLocale('kk')}
              className={`text-xs px-2.5 py-1 rounded-md transition-all ${
                locale === 'kk'
                  ? 'bg-accent text-black font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              ҚАЗ
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={navLink(
                  user.role === 'admin'
                    ? '/admin/dashboard'
                    : user.role === 'farmer'
                    ? '/farmer/dashboard'
                    : '/dashboard'
                )}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {user.role === 'admin'
                  ? t('adminDashboard')
                  : user.role === 'farmer'
                  ? t('farmerDashboard')
                  : t('dashboard')}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await fetch('/api/auth/signout', { method: 'POST' });
                  window.location.href = navLink('/');
                }}
              >
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={navLink('/login')}>
                <Button variant="ghost" size="sm">{t('login')}</Button>
              </Link>
              <Link href={navLink('/signup')}>
                <Button variant="primary" size="sm">{t('signup')}</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
