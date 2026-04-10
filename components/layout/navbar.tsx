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
        <Link href={navLink('/')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 relative">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M16 2L16 8M16 8L12 12M16 8L20 12M12 12L12 20M20 12L20 20M12 20L16 24M20 20L16 24M16 24L16 30" stroke="#a8e63d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 14L4 18M24 14L28 18" stroke="#a8e63d" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight group-hover:text-accent transition-colors">
            Tabyn<span className="text-accent">Argo</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href={navLink('/animals')}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t('animals')}
          </Link>
          <Link
            href={navLink('/#how-it-works')}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            {t('howItWorks')}
          </Link>

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
              RU
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href={navLink(user.role === 'farmer' ? '/farmer/dashboard' : '/dashboard')}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {user.role === 'farmer' ? t('farmerDashboard') : t('dashboard')}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push(navLink('/'));
                  router.refresh();
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
