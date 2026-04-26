'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Search,
  Cog,
  LayoutDashboard,
  Tractor,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  LogIn,
  UserPlus,
  Home,
  Calculator,
  Leaf,
  BookOpen,
} from 'lucide-react';
import { clsx } from 'clsx';

/* ──────────────────────────────────────────────────────────────
 * Context — lets anything in the tree toggle the palette
 * ────────────────────────────────────────────────────────────── */

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
}
const Ctx = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette() {
  const v = useContext(Ctx);
  if (!v) return { open: false, setOpen: () => {}, toggle: () => {} };
  return v;
}

/* ──────────────────────────────────────────────────────────────
 * Command definitions
 * ────────────────────────────────────────────────────────────── */

type Command = {
  id: string;
  label: string;
  hint?: string;
  icon: ReactNode;
  keywords?: string;
  action: () => void;
  shortcut?: string;
  group: 'navigate' | 'action' | 'help';
};

/* ──────────────────────────────────────────────────────────────
 * Provider + modal
 * ────────────────────────────────────────────────────────────── */

export function CommandPaletteProvider({
  locale,
  user,
  children,
}: {
  locale: string;
  user?: { role: string; name: string } | null;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  // Global keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  return (
    <Ctx.Provider value={{ open, setOpen, toggle }}>
      {children}
      {open && (
        <CommandPaletteModal locale={locale} user={user} onClose={() => setOpen(false)} />
      )}
    </Ctx.Provider>
  );
}

function CommandPaletteModal({
  locale,
  user,
  onClose,
}: {
  locale: string;
  user?: { role: string; name: string } | null;
  onClose: () => void;
}) {
  const t = useTranslations('ui.commandPalette');
  const router = useRouter();
  const [q, setQ] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (href: string) => {
      router.push(`/${locale}${href}`);
      onClose();
    },
    [router, locale, onClose],
  );

  const isLoggedIn = !!user;
  const isFarmer = user?.role === 'farmer';

  const commands: Command[] = useMemo(
    () => [
      // Navigation
      {
        id: 'home',
        label: t('cmd.home'),
        hint: t('cmd.homeHint'),
        icon: <Home className="w-4 h-4" />,
        group: 'navigate',
        action: () => go('/'),
        shortcut: 'G H',
      },
      {
        id: 'animals',
        label: t('cmd.browse'),
        hint: t('cmd.browseHint'),
        icon: <Leaf className="w-4 h-4" />,
        group: 'navigate',
        action: () => go('/animals'),
        shortcut: 'G A',
      },
      // Only show dashboards when logged in
      ...(isLoggedIn && !isFarmer ? [{
        id: 'dashboard',
        label: t('cmd.dashboard'),
        hint: t('cmd.dashboardHint'),
        icon: <LayoutDashboard className="w-4 h-4" />,
        group: 'navigate' as const,
        action: () => go('/dashboard'),
        shortcut: 'G D',
      }] : []),
      ...(isLoggedIn && isFarmer ? [{
        id: 'farmer',
        label: t('cmd.farmerDashboard'),
        hint: t('cmd.farmerDashboardHint'),
        icon: <Tractor className="w-4 h-4" />,
        group: 'navigate' as const,
        action: () => go('/farmer/dashboard'),
        shortcut: 'G F',
      }] : []),
      // Actions
      {
        id: 'calculator',
        label: t('cmd.calculator'),
        hint: t('cmd.calculatorHint'),
        icon: <Calculator className="w-4 h-4" />,
        group: 'action',
        action: () => go('/#calculator'),
      },
      {
        id: 'howItWorks',
        label: t('cmd.howItWorks'),
        hint: t('cmd.howItWorksHint'),
        icon: <TrendingUp className="w-4 h-4" />,
        group: 'action',
        action: () => go('/#how-it-works'),
      },
      {
        id: 'verify',
        label: t('cmd.verify'),
        hint: t('cmd.verifyHint'),
        icon: <ShieldCheck className="w-4 h-4" />,
        group: 'action',
        action: () => go('/#trust'),
      },
      // Only show login/signup when not logged in
      ...(!isLoggedIn ? [
        {
          id: 'signup',
          label: t('cmd.signup'),
          hint: t('cmd.signupHint'),
          icon: <UserPlus className="w-4 h-4" />,
          group: 'action' as const,
          action: () => go('/signup'),
        },
        {
          id: 'login',
          label: t('cmd.login'),
          hint: t('cmd.loginHint'),
          icon: <LogIn className="w-4 h-4" />,
          group: 'action' as const,
          action: () => go('/login'),
        },
      ] : []),
      // Help
      {
        id: 'docs',
        label: t('cmd.docs'),
        hint: t('cmd.docsHint'),
        icon: <BookOpen className="w-4 h-4" />,
        group: 'help',
        action: () => go('/'),
      },
      {
        id: 'support',
        label: t('cmd.support'),
        hint: t('cmd.supportHint'),
        icon: <HelpCircle className="w-4 h-4" />,
        group: 'help',
        action: () => {
          window.location.href = 'mailto:support@tabyn.kz';
          onClose();
        },
      },
      {
        id: 'settings',
        label: t('cmd.settings'),
        hint: t('cmd.settingsHint'),
        icon: <Cog className="w-4 h-4" />,
        group: 'help',
        action: () => go('/'),
      },
    ],
    [t, go, onClose, isLoggedIn, isFarmer],
  );

  // Filter
  const filtered = useMemo(() => {
    if (!q.trim()) return commands;
    const ql = q.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(ql) ||
        c.hint?.toLowerCase().includes(ql) ||
        c.keywords?.toLowerCase().includes(ql),
    );
  }, [q, commands]);

  // Reset highlight when filtering
  useEffect(() => setHighlight(0), [q]);

  // Focus input on open
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 40);
    return () => clearTimeout(id);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(filtered.length - 1, h + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[highlight]?.action();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, highlight]);

  // Group for display
  const groupLabel: Record<Command['group'], string> = {
    navigate: t('group.navigate'),
    action: t('group.action'),
    help: t('group.help'),
  };
  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });
    return groups;
  }, [filtered]);

  // Flat index for highlight ↔ item mapping
  const flatIndex = useMemo(() => {
    let i = 0;
    const map = new Map<string, number>();
    Object.values(grouped).forEach((items) =>
      items.forEach((it) => map.set(it.id, i++)),
    );
    return map;
  }, [grouped]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('title')}
      className="fixed inset-0 z-[900] flex items-start justify-center pt-[14vh] px-4 bg-bg-absolute/75 backdrop-blur-[10px] anim-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] bg-surface-2 border border-border-soft rounded-[24px] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden anim-slide-in-up"
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
          <Search className="w-4 h-4 text-text-tertiary shrink-0" strokeWidth={2.5} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('placeholder')}
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-text-primary placeholder:text-text-tertiary"
          />
          <kbd className="mono text-[10px] text-text-tertiary bg-surface-3 border border-border-subtle px-1.5 py-0.5 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-[13px] text-text-tertiary">
              {t('empty', { q })}
            </div>
          )}

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="mb-1 last:mb-0">
              <div className="px-5 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-text-tertiary">
                {groupLabel[group as Command['group']]}
              </div>
              {items.map((c) => {
                const idx = flatIndex.get(c.id) ?? -1;
                const isActive = idx === highlight;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={c.action}
                    onMouseEnter={() => setHighlight(idx)}
                    className={clsx(
                      'w-full text-left px-5 py-2.5 flex items-center gap-3 transition-colors',
                      isActive ? 'bg-surface-3' : 'bg-transparent',
                    )}
                  >
                    <span
                      className={clsx(
                        'w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border',
                        isActive
                          ? 'bg-brand/15 text-brand border-brand/30'
                          : 'bg-surface-3 text-text-secondary border-border-subtle',
                      )}
                    >
                      {c.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-text-primary font-medium leading-tight">
                        {c.label}
                      </div>
                      {c.hint && (
                        <div className="text-[11.5px] text-text-tertiary mt-0.5 truncate">
                          {c.hint}
                        </div>
                      )}
                    </div>
                    {c.shortcut && (
                      <kbd className="mono text-[10px] text-text-tertiary bg-surface-3 border border-border-subtle px-1.5 py-0.5 rounded-md shrink-0">
                        {c.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="px-5 py-2.5 border-t border-border-subtle flex items-center gap-4 text-[10.5px] text-text-tertiary">
          <span className="flex items-center gap-1">
            <kbd className="mono bg-surface-3 border border-border-subtle px-1 rounded">↑↓</kbd>
            {t('hint.navigate')}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="mono bg-surface-3 border border-border-subtle px-1 rounded">↵</kbd>
            {t('hint.select')}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <kbd className="mono bg-surface-3 border border-border-subtle px-1 rounded">ESC</kbd>
            {t('hint.close')}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * CommandPaletteTrigger — reusable button to open the palette.
 * Used in the Navbar. Shows a search-style affordance with ⌘K hint.
 */
export function CommandPaletteTrigger({ className }: { className?: string }) {
  const { toggle } = useCommandPalette();
  const t = useTranslations('ui.commandPalette');
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('title')}
      className={clsx(
        'inline-flex items-center gap-2 h-9 px-3 rounded-[10px]',
        'bg-surface-1 border border-border-subtle text-text-tertiary',
        'hover:border-border-soft hover:text-text-primary',
        'transition-colors',
        className,
      )}
    >
      <Search className="w-3.5 h-3.5" strokeWidth={2.5} />
      <span className="text-[12.5px] font-medium">{t('trigger')}</span>
      <kbd className="mono text-[10px] bg-surface-3 border border-border-subtle px-1 rounded-md">
        ⌘K
      </kbd>
    </button>
  );
}
