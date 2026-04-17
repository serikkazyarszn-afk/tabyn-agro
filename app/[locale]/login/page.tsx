'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { use } from 'react';

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('auth.login');
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Get role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile?.role === 'admin') {
      router.push(`/${locale}/admin/dashboard`);
    } else if (profile?.role === 'farmer') {
      router.push(`/${locale}/farmer/dashboard`);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Tabyn" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
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
              autoComplete="current-password"
            />

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
          {t('noAccount')}{' '}
          <Link href={`/${locale}/signup`} className="text-accent hover:underline font-medium">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  );
}
