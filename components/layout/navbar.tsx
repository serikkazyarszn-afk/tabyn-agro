'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/button';
import { TabynWordmark } from '@/components/ui/logo';
import { CommandPaletteTrigger } from '@/components/ui/command-palette';
import { createClient } from '@/lib/supabase';
import { Menu, X, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { clsx } from 'clsx';

interface NavbarProps {
  locale: string;
  user?: { role: string; name: string } | null;
}

// Module-level client so the auth listener & the logout handler share state
const supabase = createClient();

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'РУС' },
  { code: 'kk', label: 'ҚАЗ' },
] as const;

/**
 * Navbar — v2 (Etap A)
 *
 * Changes from v1:
 *   - Added Command Palette trigger (⌘K) on desktop next to locale picker
 *   - Scrolled state uses the new bg-primary/85 + blur
 *   - Slightly tighter heights (96→84 / 84→72) for a cleaner product feel
 *   - Primary CTA now uses the gradient via updated Button component
 *
 * Everything else is unchanged — same auth flow, same locales, same mobile sheet.
 */
export default function Navbar({ locale, user: initialUser }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(initialUser ?? null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  const navLink = (href: string) => `/${locale}${href}`;

  const NavItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={navLink(href)}
      className="text-[14px] text-text-secondary hover:text-text-primary transition-colors px-1 py-2"
    >
      {children}
    </Link>
  );

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-[background,border,backdrop-filter,height] duration-300',
          scrolled
            ? 'bg-bg-primary/85 backdrop-blur-[14px] border-b border-border-subtle'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div
          className={clsx(
            'max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between transition-[height] duration-300',
            scrolled ? 'h-[72px]' : 'h-[84px]',
          )}
        >
          {/* Logo */}
          <Link
            href={navLink('/')}
            className="flex items-center shrink-0 -ml-2 px-2 py-3"
            aria-label="Tabyn home"
          >
            <TabynWordmark
              className={clsx(scrolled ? 'h-[40px] w-auto' : 'h-[48px] w-auto')}
              markSize={scrolled ? 22 : 24}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            <NavItem href="/animals">{t('animals')}</NavItem>
            <NavItem href="/#how-it-works">{t('howItWorks')}</NavItem>
            <Link
              href={navLink('/#trust')}
              className="inline-flex items-center gap-1.5 text-[14px] text-text-secondary hover:text-text-primary transition-colors px-1 py-2"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
              {t('verify')}
            </Link>
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Command palette — desktop only */}
            <div className="hidden md:block">
              <CommandPaletteTrigger />
            </div>

            {/* Locale segmented control */}
            <div
              role="tablist"
              aria-label="Language"
              className="hidden sm:flex items-center gap-0.5 bg-surface-1 border border-border-subtle rounded-[10px] p-0.5"
            >
              {LOCALES.map(({ code, label }) => (
                <button
                  key={code}
                  role="tab"
                  aria-selected={locale === code}
                  onClick={() => switchLocale(code)}
                  className={clsx(
                    'text-[11px] font-medium px-2.5 py-1.5 rounded-[8px] min-h-[28px] transition-colors tracking-[0.02em]',
                    locale === code
                      ? 'bg-brand text-text-primary'
                      : 'text-text-tertiary hover:text-text-primary',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Auth cluster — desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href={navLink(
                    user.role === 'farmer' ? '/farmer/dashboard' : '/dashboard',
                  )}
                >
                  <Button variant="tertiary" size="sm">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {user.role === 'farmer' ? t('farmerDashboard') : t('dashboard')}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push(navLink('/'));
                    router.refresh();
                  }}
                  aria-label={t('logout')}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href={navLink('/login')}>
                  <Button variant="ghost" size="sm">
                    {t('login')}
                  </Button>
                </Link>
                <Link href={navLink('/signup')}>
                  <Button variant="primary" size="sm">
                    {t('signup')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Menu"
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-[10px] text-text-primary hover:bg-surface-2 transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        className={clsx(
          'fixed inset-x-0 top-20 z-40 lg:hidden transition-[transform,opacity] duration-300 origin-top',
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        role="dialog"
        aria-hidden={!open}
      >
        <div className="mx-3 mt-2 rounded-[18px] bg-surface-1/95 backdrop-blur-[14px] border border-border-soft shadow-[0_12px_32px_rgba(0,0,0,0.5)] p-4">
          <div className="flex flex-col gap-1 mb-3">
            <Link
              href={navLink('/animals')}
              className="px-3 py-3 rounded-[10px] text-text-primary hover:bg-surface-2 text-[15px]"
            >
              {t('animals')}
            </Link>
            <Link
              href={navLink('/#how-it-works')}
              className="px-3 py-3 rounded-[10px] text-text-primary hover:bg-surface-2 text-[15px]"
            >
              {t('howItWorks')}
            </Link>
            <Link
              href={navLink('/#trust')}
              className="px-3 py-3 rounded-[10px] text-text-primary hover:bg-surface-2 text-[15px] inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-brand" />
              {t('verify')}
            </Link>
          </div>

          {/* Locale row on mobile */}
          <div className="flex items-center gap-0.5 bg-bg-primary border border-border-subtle rounded-[10px] p-0.5 mb-3 sm:hidden">
            {LOCALES.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                className={clsx(
                  'flex-1 text-[12px] font-medium px-2 py-2 rounded-[8px] transition-colors',
                  locale === code
                    ? 'bg-brand text-text-primary'
                    : 'text-text-secondary',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                href={navLink(
                  user.role === 'farmer' ? '/farmer/dashboard' : '/dashboard',
                )}
              >
                <Button variant="secondary" size="md" fullWidth>
                  <LayoutDashboard className="w-4 h-4" />
                  {user.role === 'farmer' ? t('farmerDashboard') : t('dashboard')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push(navLink('/'));
                  router.refresh();
                }}
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Link href={navLink('/login')}>
                <Button variant="secondary" size="md" fullWidth>
                  {t('login')}
                </Button>
              </Link>
              <Link href={navLink('/signup')}>
                <Button variant="primary" size="md" fullWidth>
                  {t('signup')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
