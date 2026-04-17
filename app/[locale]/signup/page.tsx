'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { use } from 'react';

export default function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('auth.signup');
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'investor' | 'farmer'>('investor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim(), role },
      },
    });

    if (authError) {
      setError('Sign up failed. Please check your details and try again.');
      setLoading(false);
      return;
    }

    if (role === 'farmer') {
      router.push(`/${locale}/farmer/dashboard`);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <Input
              id="name"
              label={t('name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Arsen Serikkaziy"
              required
              autoComplete="name"
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
            <Input
              id="password"
              label={t('password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />

            {/* Role selection */}
            <div>
              <p className="text-sm font-medium text-muted mb-2">{t('role')}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('investor')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    role === 'investor'
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border bg-surface text-muted hover:border-muted-2'
                  }`}
                >
                  <div className="text-xl mb-1">📈</div>
                  <div className="text-sm font-medium">{t('investor')}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    role === 'farmer'
                      ? 'border-accent bg-accent/10 text-foreground'
                      : 'border-border bg-surface text-muted hover:border-muted-2'
                  }`}
                >
                  <div className="text-xl mb-1">🌾</div>
                  <div className="text-sm font-medium">{t('farmer')}</div>
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              {loading ? t('loading') : t('submit')}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          {t('hasAccount')}{' '}
          <Link href={`/${locale}/login`} className="text-accent hover:underline font-medium">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
