'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { ArrowRight, TrendingUp, Users, Beef, CheckCircle } from 'lucide-react';

interface HeroProps {
  locale: string;
}

export default function Hero({ locale }: HeroProps) {
  const t = useTranslations('hero');
  const navLink = (href: string) => `/${locale}${href}`;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/dashboard.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span className="text-accent text-sm font-medium">{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl font-bold leading-tight tracking-tight mb-6">
            {t('title')}
            <br />
            <span className="text-accent">{t('titleAccent')}</span>
          </h1>

          <p className="text-muted text-lg leading-relaxed mb-10 max-w-xl">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 mb-16">
            <Link href={navLink('/signup')}>
              <Button size="lg" variant="primary" className="group">
                {t('cta')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
            <Link href={navLink('/#how-it-works')}>
              <Button size="lg" variant="secondary">
                {t('ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6">
            {[
              { icon: Users, value: '1,200+', label: t('stats.investors') },
              { icon: Beef, value: '430+', label: t('stats.animals') },
              { icon: TrendingUp, value: '18%', label: t('stats.return') },
              { icon: CheckCircle, value: '85+', label: t('stats.farmers') },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="text-2xl font-bold text-foreground">{value}</span>
                </div>
                <span className="text-xs text-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
