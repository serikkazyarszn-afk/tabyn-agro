'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import {
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  MapPin,
  Hash,
} from 'lucide-react';

interface HeroProps {
  locale: string;
  user?: { id: string } | null;
}

/**
 * Hero — documentary agri-finance.
 *
 * Three stacked layers per brandbook:
 *   1. Value stack (headline + subtitle + CTAs + real metric chips)
 *   2. Proof strip on the right (asset passport card)
 *   3. Ambient horizon gradient — not a background photo
 */
export default function Hero({ locale, user }: HeroProps) {
  const t = useTranslations('hero');
  const navLink = (href: string) => `/${locale}${href}`;

  const metrics = [
    { value: '1 240+', label: t('stats.investors') },
    { value: '430+', label: t('stats.animals') },
    { value: '18%', label: t('stats.return') },
    { value: '85+', label: t('stats.farmers') },
  ];

  return (
    <section
      className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24"
      aria-labelledby="hero-title"
    >
      {/* Full-bleed background farm photo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/farm-tradition.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.46) saturate(0.92) contrast(1.02)' }}
        />
      </div>
      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(8,10,11,0.82) 0%, rgba(8,10,11,0.48) 52%, rgba(8,10,11,0.28) 100%)' }} />
      <div className="absolute inset-0 gradient-radial-gold pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(1100px 620px at 12% 8%, rgba(255,255,255,0.06), transparent 60%)' }} />
      <div
        className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, var(--bg-950) 100%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left: value stack */}
        <div className="lg:col-span-7">
          <Badge variant="brand" size="md" dot>
            {t('badge')}
          </Badge>

          <h1
            id="hero-title"
            className="mt-5 text-[40px] leading-[1.08] md:text-[56px] md:leading-[1.05] lg:text-[64px] font-semibold tracking-[-0.02em] text-text-primary"
          >
            {t('title')}{' '}
            <span className="text-brand-secondary">{t('titleAccent')}</span>
          </h1>

          <p className="mt-5 text-[16px] md:text-[18px] leading-[1.6] text-text-secondary max-w-[620px]">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={user ? navLink('/animals') : navLink('/signup')}>
              <Button size="lg" variant="primary" fullWidth className="sm:w-auto group">
                {t('cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href={navLink('/#how-it-works')}>
              <Button size="lg" variant="secondary" fullWidth className="sm:w-auto">
                {t('ctaSecondary')}
              </Button>
            </Link>
          </div>

          {/* Real-metric chips (proof strip) */}
          <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-700 rounded-[14px] overflow-hidden border border-border-700">
            {metrics.map(({ value, label }) => (
              <div key={label} className="bg-bg-950 px-4 py-4 sm:px-5 sm:py-5">
                <dt className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
                  {label}
                </dt>
                <dd className="mt-1 text-[22px] md:text-[26px] font-semibold text-text-primary tabular leading-none">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Right: Asset passport proof card */}
        <div className="lg:col-span-5 lg:pl-4">
          <AssetPassport t={t} />
        </div>
      </div>
    </section>
  );
}

/**
 * AssetPassport — mini due-diligence preview.
 * Uses NO photograph; uses schematic mark and data per brandbook.
 */
function AssetPassport({ t }: { t: (k: string) => string }) {
  return (
    <div className="relative">
      {/* Card stack effect — subtle, not decorative */}
      <div
        aria-hidden
        className="absolute -inset-2 rounded-[22px] bg-gradient-to-br from-brand/8 via-transparent to-brand-secondary/8 blur-2xl"
      />

      <div className="relative surface-card rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        {/* Header: real livestock photo */}
        <div className="relative h-56 md:h-60 bg-surface-800 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/akboz-new.webp"
            alt="Казахская белая — Акбоз, голштинская корова"
            className="w-full h-full object-cover"
          />
          {/* Readability gradient for badges */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,10,11,0.26) 0%, rgba(8,10,11,0.04) 32%, rgba(8,10,11,0.08) 62%, rgba(8,10,11,0.72) 100%)',
            }}
          />

          {/* Overlay chips */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant="positive" size="sm" dot>
              {t('passport.verified')}
            </Badge>
            <Badge variant="neutral" size="sm">
              <Hash className="w-3 h-3" />
              AK-2026-0471
            </Badge>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
              <MapPin className="w-3.5 h-3.5" />
              {t('passport.region')}
            </div>
            <div className="inline-flex items-center gap-1.5 text-[12px] text-text-secondary">
              <Activity className="w-3.5 h-3.5 text-positive" />
              {t('passport.statusLive')}
            </div>
          </div>
        </div>

        {/* Body: asset metrics */}
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[15px] font-semibold text-text-primary leading-snug">
                {t('passport.assetName')}
              </div>
              <div className="text-[12px] text-text-tertiary mt-0.5">
                {t('passport.breed')}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[20px] font-semibold text-text-primary tabular leading-none">
                ₸320 000
              </div>
              <div className="text-[11px] text-text-tertiary mt-1">
                {t('passport.perSlot')}
              </div>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            <MetricTile label={t('passport.return')} value="+22%" accent />
            <MetricTile label={t('passport.term')} value={t('passport.months12')} />
            <MetricTile label={t('passport.risk')} value={t('passport.riskLow')} />
          </div>

          {/* Funding */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[12px] text-text-secondary mb-1.5">
              <span>{t('passport.funded')}</span>
              <span className="tabular">1 / 4</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-700 overflow-hidden">
              <div className="h-full bg-brand-secondary rounded-full" style={{ width: '25%' }} />
            </div>
          </div>

          {/* Proof rail */}
          <ul className="grid grid-cols-2 gap-y-2 gap-x-3 text-[12px]">
            <ProofItem icon={ShieldCheck} label={t('passport.proofFarmer')} />
            <ProofItem icon={FileText} label={t('passport.proofVet')} />
            <ProofItem icon={Hash} label={t('passport.proofId')} />
            <ProofItem icon={Activity} label={t('passport.proofUpdates')} />
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[10px] bg-surface-800 border border-border-700 px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
        {label}
      </div>
      <div
        className={`mt-0.5 text-[14px] font-semibold tabular ${
          accent ? 'text-brand-secondary' : 'text-text-primary'
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function ProofItem({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 text-text-secondary">
      <Icon className="w-3.5 h-3.5 text-brand shrink-0" />
      <span className="truncate">{label}</span>
    </li>
  );
}

