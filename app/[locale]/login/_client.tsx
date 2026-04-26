'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { TabynWordmark, TabynMark } from '@/components/ui/logo';
import { createClient } from '@/lib/supabase';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Smartphone,
  QrCode,
  LifeBuoy,
  ArrowRight,
  FileText,
  Activity,
  Lock,
} from 'lucide-react';
import { clsx } from 'clsx';

type Method = 'password' | 'sms' | 'qr';

export default function LoginClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('auth.login');
  const tAuth = useTranslations('auth');
  const router = useRouter();

  const [method, setMethod] = useState<Method>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'farmer') {
      router.push(`/${locale}/farmer/dashboard`);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden">
      {/* Left — hero / trust pane (desktop only) */}
      <aside className="hidden lg:flex lg:col-span-5 xl:col-span-6 relative border-r border-border-700 p-10 xl:p-14 flex-col justify-between">
        {/* Farm photo background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/horses.webp"
            alt=""
            aria-hidden
            className="w-full h-full object-cover object-center"
            style={{ filter: 'brightness(0.34) saturate(0.95) contrast(1.03)' }}
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.18) 100%)',
          }}
        />


        <div className="relative space-y-6 max-w-md">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-3">
              {tAuth('trustBadge')}
            </div>
            <h2 className="text-[30px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.15]">
              {tAuth('trustTitle')}
            </h2>
            <p className="mt-3 text-[14px] text-text-secondary leading-[1.6]">
              {tAuth('trustBody')}
            </p>
          </div>

          <ul className="space-y-3">
            <TrustItem icon={ShieldCheck} label={tAuth('trust.verified')} />
            <TrustItem icon={FileText} label={tAuth('trust.documents')} />
            <TrustItem icon={Activity} label={tAuth('trust.updates')} />
            <TrustItem icon={Lock} label={tAuth('trust.encrypted')} />
          </ul>
        </div>

        <div className="relative text-[12px] text-text-tertiary">
          {tAuth('partnersNote')}
        </div>
      </aside>

      {/* Right — form pane */}
      <main className="col-span-1 lg:col-span-7 xl:col-span-6 flex items-start lg:items-center justify-center px-4 md:px-10 py-10 md:py-14">
        <div className="w-full max-w-[440px]">
          {/* Compact brand on mobile */}

          <div className="mb-7">
            <h1 className="text-[26px] md:text-[28px] font-semibold tracking-[-0.02em] text-text-primary">
              {t('title')}
            </h1>
            <p className="mt-1.5 text-[14px] text-text-secondary">{t('subtitle')}</p>
          </div>

          {/* Method selector */}
          <div
            role="tablist"
            aria-label={t('methodLabel')}
            className="grid grid-cols-3 gap-px bg-border-700 rounded-[12px] overflow-hidden border border-border-700 mb-6"
          >
            <MethodTab
              active={method === 'password'}
              onClick={() => setMethod('password')}
              icon={Lock}
              label={t('methodPassword')}
            />
            <MethodTab
              active={method === 'sms'}
              onClick={() => setMethod('sms')}
              icon={Smartphone}
              label={t('methodSms')}
            />
            <MethodTab
              active={method === 'qr'}
              onClick={() => setMethod('qr')}
              icon={QrCode}
              label={t('methodQr')}
            />
          </div>

          {method === 'password' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <Input
                id="email"
                label={t('email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                autoFocus
              />
              <Input
                id="password"
                label={t('password')}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                    className="w-9 h-9 inline-flex items-center justify-center rounded-[8px] text-text-tertiary hover:text-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <div className="flex items-center justify-between text-[12.5px]">
                <label className="inline-flex items-center gap-2 cursor-pointer text-text-secondary">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-border-700 bg-surface-800 accent-brand"
                  />
                  {t('rememberDevice')}
                </label>
                <Link
                  href={`/${locale}/login?forgot=1`}
                  className="text-brand hover:text-brand-hover font-medium"
                >
                  {t('forgot')}
                </Link>
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-[12.5px] text-destructive bg-destructive/10 border border-destructive/25 rounded-[10px] px-3 py-2.5 leading-[1.5]"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                fullWidth
              >
                {loading ? t('loading') : t('submit')}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-[11px] text-text-tertiary leading-[1.5] text-center mt-2">
                <Lock className="w-3 h-3 inline mr-1 -mt-0.5" />
                {t('encryptedNote')}
              </p>
            </form>
          )}

          {method === 'sms' && (
            <div className="space-y-4">
              <Input
                id="phone"
                label={t('phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                leading={<span className="text-text-secondary text-[13px]">🇰🇿</span>}
                hint={t('phoneHint')}
              />
              <Button variant="primary" size="lg" fullWidth disabled>
                <Smartphone className="w-4 h-4" />
                {t('sendCode')}
              </Button>
              <p className="text-[11px] text-text-tertiary leading-[1.5]">
                {t('smsNote')}
              </p>
            </div>
          )}

          {method === 'qr' && (
            <div className="space-y-5">
              <div className="surface-card rounded-[14px] p-6 flex flex-col items-center text-center">
                <QrPlaceholder />
                <p className="mt-5 text-[13px] text-text-primary font-medium">
                  {t('qrTitle')}
                </p>
                <p className="mt-1 text-[12px] text-text-secondary leading-[1.5]">
                  {t('qrBody')}
                </p>
              </div>
              <p className="text-[11px] text-text-tertiary leading-[1.5] text-center">
                {t('qrNote')}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 space-y-4">
            <p className="text-[13px] text-text-secondary text-center">
              {t('noAccount')}{' '}
              <Link
                href={`/${locale}/signup`}
                className="text-brand hover:text-brand-hover font-medium"
              >
                {t('signup')}
              </Link>
            </p>

            <a
              href="mailto:support@tabyn.kz"
              className="flex items-center justify-center gap-2 text-[12px] text-text-tertiary hover:text-text-primary transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              {t('needHelp')}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

function MethodTab({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      type="button"
      onClick={onClick}
      className={clsx(
        'flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 h-12 text-[12.5px] font-medium transition-colors',
        active
          ? 'bg-brand text-text-primary'
          : 'bg-surface-900 text-text-secondary hover:text-text-primary',
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function TrustItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3 text-[13px] text-text-secondary">
      <span className="w-8 h-8 rounded-[9px] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-brand" />
      </span>
      {label}
    </li>
  );
}

function QrPlaceholder() {
  // Simple deterministic faux-QR made of SVG cells. Not scannable — just a visual.
  return (
    <div className="relative w-44 h-44 rounded-[12px] bg-text-primary p-3 mx-auto">
      <svg viewBox="0 0 21 21" className="w-full h-full" aria-hidden>
        {Array.from({ length: 21 }).map((_, y) =>
          Array.from({ length: 21 }).map((__, x) => {
            const on = (x * 7 + y * 11 + x * y) % 5 < 2 || (x < 3 && y < 3) || (x > 17 && y < 3) || (x < 3 && y > 17);
            if (!on) return null;
            return <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#07130F" />;
          }),
        )}
        {/* Finder patterns */}
        {[[0, 0], [14, 0], [0, 14]].map(([fx, fy], i) => (
          <g key={i}>
            <rect x={fx} y={fy} width="7" height="7" fill="#07130F" />
            <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="#F4F1E8" />
            <rect x={fx + 2} y={fy + 2} width="3" height="3" fill="#07130F" />
          </g>
        ))}
      </svg>
      <div
        aria-hidden
        className="absolute inset-[45%] w-auto h-auto rounded-[6px] bg-bg-950 flex items-center justify-center"
        style={{ minWidth: 28, minHeight: 28 }}
      >
        <TabynMark size={20} className="text-brand" />
      </div>
    </div>
  );
}
