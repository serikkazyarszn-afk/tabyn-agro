'use client';

import { useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  TrendingUp,
  Sprout,
  FileCheck,
  CheckCircle,
  Lock,
  LifeBuoy,
} from 'lucide-react';
import { clsx } from 'clsx';

type Role = 'investor' | 'farmer';
type Step = 'role' | 'identity';

export default function SignupClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('auth.signup');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialRole = (searchParams.get('role') === 'farmer' ? 'farmer' : 'investor') as Role;

  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentComms, setConsentComms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If the query told us a role, jump to step 2 automatically
  useEffect(() => {
    if (searchParams.get('role')) setStep('identity');
  }, [searchParams]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentTerms) {
      setError(t('errors.consent'));
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(
      role === 'farmer' ? `/${locale}/farmer/dashboard` : `/${locale}/dashboard`,
    );
  };

  const passwordStrength = strengthOf(password);

  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden bg-bg-950">
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/farm-tradition.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.42) saturate(0.96) contrast(1.02)' }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.28) 100%)',
        }}
      />

      <main className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 md:px-6 py-10 md:py-14">
        <div className="w-full max-w-6xl rounded-[28px] border border-white/10 bg-black/58 backdrop-blur-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <section className="lg:col-span-5 p-6 md:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-center">
              <div className="max-w-md">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary mb-3">
                  {tAuth('onboardingBadge')}
                </div>
                <h2 className="text-[30px] md:text-[34px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.12]">
                  {tAuth('onboardingTitle')}
                </h2>
                <p className="mt-3 text-[14px] text-text-secondary leading-[1.6] max-w-sm">
                  {tAuth('onboardingBody')}
                </p>

                <ol className="mt-7 space-y-3">
                  <TrustStep n={1} label={tAuth('steps.choose')} done={step !== 'role'} />
                  <TrustStep n={2} label={tAuth('steps.identity')} done={false} active={step === 'identity'} />
                  <TrustStep n={3} label={tAuth('steps.verify')} done={false} />
                </ol>
              </div>
            </section>

            <section className="lg:col-span-7 p-6 md:p-8 lg:p-10 flex items-center justify-center">
              <div className="w-full max-w-[520px]">
                <div className="mb-7">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="neutral" size="sm">
                      <span className="tabular">{step === 'role' ? '1' : '2'} / 2</span>
                    </Badge>
                    <span className="text-[12px] text-text-tertiary">
                      {step === 'role' ? t('stepRoleLabel') : t('stepIdentityLabel')}
                    </span>
                  </div>
                  <h1 className="text-[26px] md:text-[28px] font-semibold tracking-[-0.02em] text-text-primary">
                    {step === 'role' ? t('title') : t('identityTitle')}
                  </h1>
                  <p className="mt-1.5 text-[14px] text-text-secondary">
                    {step === 'role' ? t('subtitle') : t('identitySubtitle')}
                  </p>
                </div>

                {step === 'role' ? (
                  <div className="space-y-5">
                    <div className="surface-card rounded-[20px] border border-white/10 p-4 md:p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <RoleCard
                          icon={TrendingUp}
                          active={role === 'investor'}
                          onClick={() => setRole('investor')}
                          title={t('investor')}
                          body={t('investorBody')}
                          bullets={[t('benefits.lowEntry'), t('benefits.diversified'), t('benefits.passive')]}
                          accent="brand"
                        />
                        <RoleCard
                          icon={Sprout}
                          active={role === 'farmer'}
                          onClick={() => setRole('farmer')}
                          title={t('farmer')}
                          body={t('farmerBody')}
                          bullets={[t('benefits.funding'), t('benefits.noCollateral'), t('benefits.scale')]}
                          accent="gold"
                        />
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      onClick={() => setStep('identity')}
                    >
                      {t('continue')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <p className="text-[13px] text-text-secondary text-center">
                      {t('hasAccount')}{' '}
                      <Link
                        href={`/${locale}/login`}
                        className="text-brand hover:text-brand-hover font-medium"
                      >
                        {t('login')}
                      </Link>
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSignup} className="space-y-4" noValidate>
                    <button
                      type="button"
                      onClick={() => setStep('role')}
                      className="inline-flex items-center gap-1.5 text-[12.5px] text-text-tertiary hover:text-text-primary transition-colors mb-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {t('backToRole')}: {role === 'investor' ? t('investor') : t('farmer')}
                    </button>

                    <Input
                      id="name"
                      label={t('name')}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('namePlaceholder')}
                      required
                      autoComplete="name"
                      autoFocus
                    />
                    <Input
                      id="email"
                      label={t('email')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                    />
                    <div>
                      <Input
                        id="password"
                        label={t('password')}
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        hint={passwordStrength.hint || t('passwordHint')}
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
                      {password && (
                        <div className="mt-1 flex items-center gap-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={clsx(
                                'h-1 flex-1 rounded-full transition-colors',
                                i <= passwordStrength.level
                                  ? passwordStrength.level <= 1
                                    ? 'bg-destructive'
                                    : passwordStrength.level === 2
                                      ? 'bg-warning'
                                      : passwordStrength.level === 3
                                        ? 'bg-tech'
                                        : 'bg-positive'
                                  : 'bg-surface-800',
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-1">
                      <label className="flex items-start gap-3 cursor-pointer text-[12.5px] leading-[1.5]">
                        <input
                          type="checkbox"
                          checked={consentTerms}
                          onChange={(e) => setConsentTerms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-border-700 bg-surface-800 accent-brand shrink-0"
                        />
                        <span className="text-text-secondary">
                          {t('consent.terms')}{' '}
                          <Link href={`/${locale}/`} className="text-brand hover:text-brand-hover">
                            {t('consent.termsLink')}
                          </Link>{' '}
                          {t('consent.and')}{' '}
                          <Link href={`/${locale}/`} className="text-brand hover:text-brand-hover">
                            {t('consent.privacyLink')}
                          </Link>
                        </span>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer text-[12.5px] leading-[1.5]">
                        <input
                          type="checkbox"
                          checked={consentComms}
                          onChange={(e) => setConsentComms(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-border-700 bg-surface-800 accent-brand shrink-0"
                        />
                        <span className="text-text-secondary">{t('consent.comms')}</span>
                      </label>
                    </div>

                    {error && (
                      <p
                        role="alert"
                        className="text-[12.5px] text-destructive bg-destructive/10 border border-destructive/25 rounded-[10px] px-3 py-2.5"
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
                      disabled={!consentTerms}
                    >
                      {loading ? t('loading') : t('submit')}
                      <ArrowRight className="w-4 h-4" />
                    </Button>

                    <p className="text-[11px] text-text-tertiary leading-[1.5] text-center">
                      <Lock className="w-3 h-3 inline mr-1 -mt-0.5" />
                      {t('encryptedNote')}
                    </p>

                    <p className="text-[13px] text-text-secondary text-center pt-1">
                      {t('hasAccount')}{' '}
                      <Link
                        href={`/${locale}/login`}
                        className="text-brand hover:text-brand-hover font-medium"
                      >
                        {t('login')}
                      </Link>
                    </p>
                  </form>
                )}

                <div className="mt-8">
                  <a
                    href="mailto:support@tabyn.kz"
                    className="flex items-center justify-center gap-2 text-[12px] text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <LifeBuoy className="w-3.5 h-3.5" />
                    {tAuth('needHelpGeneral')}
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  active,
  onClick,
  title,
  body,
  bullets,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
  bullets: string[];
  accent: 'brand' | 'gold';
}) {
  const t = useTranslations('auth.signup');
  const iconBg =
    accent === 'brand'
      ? 'bg-brand/10 border-brand/25 text-brand'
      : 'bg-brand-secondary/10 border-brand-secondary/25 text-brand-secondary';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'text-left rounded-[14px] border p-4 md:p-5 transition-all',
        active
          ? accent === 'brand'
            ? 'bg-brand/8 border-brand'
            : 'bg-brand-secondary/8 border-brand-secondary'
          : 'bg-surface-900 border-border-700 hover:border-border-600',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className={clsx(
            'w-10 h-10 rounded-[10px] border flex items-center justify-center',
            iconBg,
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </span>
        {active && (
          <span className="w-5 h-5 rounded-full bg-brand text-text-primary flex items-center justify-center">
            <CheckCircle className="w-3 h-3" />
          </span>
        )}
      </div>
      <div className="text-[15px] font-semibold text-text-primary leading-snug">
        {title}
      </div>
      <p className="mt-1 text-[12.5px] text-text-secondary leading-[1.55]">
        {body}
      </p>
      <ul className="mt-3 pt-3 border-t border-border-700 space-y-1.5">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="text-[11.5px] text-text-tertiary flex items-start gap-1.5"
          >
            <span className="mt-[5px] w-1 h-1 rounded-full bg-brand shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

function TrustStep({
  n,
  label,
  done,
  active,
}: {
  n: number;
  label: string;
  done: boolean;
  active?: boolean;
}) {
  return (
    <li className="flex items-center gap-3 text-[13.5px]">
      <span
        className={clsx(
          'w-8 h-8 rounded-[9px] border flex items-center justify-center shrink-0 font-medium tabular',
          done
            ? 'bg-brand/15 border-brand text-brand'
            : active
              ? 'bg-brand/10 border-brand/40 text-text-primary'
              : 'bg-surface-800 border-border-700 text-text-tertiary',
        )}
      >
        {done ? <CheckCircle className="w-3.5 h-3.5" /> : n}
      </span>
      <span
        className={clsx(
          done ? 'text-text-tertiary' : active ? 'text-text-primary font-medium' : 'text-text-secondary',
        )}
      >
        {label}
      </span>
    </li>
  );
}

function strengthOf(pw: string): { level: 0 | 1 | 2 | 3 | 4; hint: string | null } {
  if (!pw) return { level: 0, hint: null };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return { level: score as 0 | 1 | 2 | 3 | 4, hint: null };
}
