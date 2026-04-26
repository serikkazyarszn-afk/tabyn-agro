'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  TrendingUp,
  Eye,
  Layers,
  BellRing,
  Landmark,
  ShieldCheck,
  Scale,
  Sprout,
} from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Benefits — two-mode story arc.
 *
 * Per master prompt: replace the stock-image benefit grid with a
 * toggleable investor/farmer view. Each item reads as:
 *   ICON | TITLE | DESCRIPTION | PROOF POINT
 *
 * No photography is required or used.
 */
export default function Benefits() {
  const t = useTranslations('benefits');
  const [mode, setMode] = useState<'investor' | 'farmer'>('investor');

  const investorItems = [
    { icon: Eye, key: 'transparent', proofKey: 'transparent' },
    { icon: TrendingUp, key: 'tracked', proofKey: 'tracked' },
    { icon: Layers, key: 'lowEntry', proofKey: 'lowEntry' },
    { icon: BellRing, key: 'passive', proofKey: 'passive' },
  ] as const;

  const farmerItems = [
    { icon: Landmark, key: 'capital', proofKey: 'capital' },
    { icon: ShieldCheck, key: 'noUpfront', proofKey: 'noUpfront' },
    { icon: Scale, key: 'fair', proofKey: 'fair' },
    { icon: Sprout, key: 'grow', proofKey: 'grow' },
  ] as const;

  const items = mode === 'investor' ? investorItems : farmerItems;
  const group = mode === 'investor' ? 'investors' : 'farmers';

  return (
    <section className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden">
      {/* Pasture photo as subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/pasture.avif"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.20) saturate(0.82) contrast(1.02)' }}
        />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(8,10,11,0.86) 0%, rgba(8,10,11,0.28) 22%, rgba(8,10,11,0.28) 78%, rgba(8,10,11,0.88) 100%)' }} />
      <div className="absolute inset-0 gradient-radial-gold pointer-events-none opacity-60" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 lg:mb-14">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary mb-3">
              {t(`${group}.badge`)}
            </div>
            <h2 className="text-[32px] md:text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-text-primary">
              {t(`${group}.title`)}
            </h2>
          </div>

          {/* Mode toggle */}
          <div
            role="tablist"
            aria-label={t('modeLabel')}
            className="inline-flex items-center bg-surface-900 border border-border-700 rounded-[12px] p-1 self-start md:self-end"
          >
            <button
              role="tab"
              aria-selected={mode === 'investor'}
              onClick={() => setMode('investor')}
              className={clsx(
                'px-4 h-10 text-[13px] font-medium rounded-[9px] transition-colors',
                mode === 'investor'
                  ? 'bg-brand text-text-primary'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {t('modeInvestor')}
            </button>
            <button
              role="tab"
              aria-selected={mode === 'farmer'}
              onClick={() => setMode('farmer')}
              className={clsx(
                'px-4 h-10 text-[13px] font-medium rounded-[9px] transition-colors',
                mode === 'farmer'
                  ? 'bg-brand text-text-primary'
                  : 'text-text-secondary hover:text-text-primary',
              )}
            >
              {t('modeFarmer')}
            </button>
          </div>
        </div>

        {/* Benefit matrix — 4 items, no images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, key, proofKey }) => (
            <article
              key={key}
              className="surface-card rounded-[18px] p-5 lg:p-6 h-full flex flex-col transition-colors hover:border-border-600"
            >
              <div className="w-10 h-10 rounded-[10px] bg-brand/10 border border-brand/20 flex items-center justify-center mb-4">
                <Icon className="w-[18px] h-[18px] text-brand" strokeWidth={1.75} />
              </div>
              <h4 className="text-[15px] font-semibold text-text-primary leading-snug">
                {t(`${group}.items.${key}.title`)}
              </h4>
              <p className="mt-2 text-[13px] leading-[1.55] text-text-secondary">
                {t(`${group}.items.${key}.description`)}
              </p>
              <div className="mt-4 pt-4 border-t border-border-700">
                <div className="flex items-start gap-2 text-[12px] text-text-tertiary">
                  <span className="mt-[3px] w-1 h-1 rounded-full bg-brand shrink-0" />
                  <span className="leading-[1.5]">
                    {t(`${group}.proofs.${proofKey}`)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
