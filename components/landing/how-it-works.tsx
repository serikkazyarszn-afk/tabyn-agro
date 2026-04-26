'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  UserCheck,
  Wallet,
  Activity,
  TrendingUp,
  Banknote,
  FileArchive,
  ChevronRight,
} from 'lucide-react';
import { clsx } from 'clsx';

const STAGE_PHOTOS = [
  '/brand/farm-tradition.jpg',
  '/hero/farm-interior.jpg',
  '/brand/pasture.avif',
  '/brand/horses.webp',
  '/cow.jpg',
  '/brand/sheep-flock.jpg',
];

const STAGE_COLORS: Record<string, { icon: string; badge: string; bar: string; text: string; glow: string }> = {
  phase1: {
    icon: 'bg-brand/15 border-brand/40 text-brand',
    badge: 'bg-brand/10 text-brand border-brand/20',
    bar: 'bg-brand',
    text: 'text-brand',
    glow: 'rgba(31,133,102,0.25)',
  },
  phase2: {
    icon: 'bg-tech/15 border-tech/40 text-tech',
    badge: 'bg-tech/10 text-tech border-tech/20',
    bar: 'bg-tech',
    text: 'text-tech',
    glow: 'rgba(79,169,160,0.25)',
  },
  phase3: {
    icon: 'bg-brand-secondary/15 border-brand-secondary/40 text-brand-secondary',
    badge: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20',
    bar: 'bg-brand-secondary',
    text: 'text-brand-secondary',
    glow: 'rgba(224,176,96,0.25)',
  },
};

export default function HowItWorks() {
  const t = useTranslations('howItWorks');
  const [activeStep, setActiveStep] = useState(0);

  const stages = [
    { icon: UserCheck,   key: 'verify',  phase: 'phase1' },
    { icon: Wallet,      key: 'fund',    phase: 'phase1' },
    { icon: Activity,    key: 'track',   phase: 'phase2' },
    { icon: TrendingUp,  key: 'sale',    phase: 'phase2' },
    { icon: Banknote,    key: 'payout',  phase: 'phase3' },
    { icon: FileArchive, key: 'archive', phase: 'phase3' },
  ];

  const active = stages[activeStep];
  const colors = STAGE_COLORS[active.phase];
  const phaseLabels = [t('phase1Label'), t('phase1Label'), t('phase2Label'), t('phase2Label'), t('phase3Label'), t('phase3Label')];

  return (
    <section id="how-it-works" className="relative py-20 lg:py-32 border-t border-border-700 overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(950px 720px at 82% 48%, rgba(255,255,255,0.035), transparent 64%), ' +
            'radial-gradient(700px 500px at 10% 82%, rgba(224,176,96,0.06), transparent 60%)',
        }}
      />
      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--border-700) 1px, transparent 1px), linear-gradient(90deg, var(--border-700) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-14 lg:mb-18">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary">
              {t('badge')}
            </span>
            <span className="text-border-600 select-none">·</span>
            <span className="text-[11px] text-text-tertiary">6 этапов</span>
          </div>
          <h2 className="text-[32px] md:text-[44px] leading-[1.08] font-semibold tracking-[-0.02em] text-text-primary">
            {t('title')}
          </h2>
          <p className="mt-4 text-[15px] md:text-[17px] leading-[1.65] text-text-secondary max-w-[600px]">
            {t('subtitle')}
          </p>
        </div>

        {/* Interactive area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* Left: step list */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ol className="flex flex-col gap-2">
              {stages.map(({ icon: Icon, key, phase }, i) => {
                const c = STAGE_COLORS[phase];
                const isActive = i === activeStep;
                return (
                  <li key={key}>
                    <button
                      onClick={() => setActiveStep(i)}
                      className={clsx(
                        'w-full text-left rounded-[16px] p-4 md:p-5 border transition-all duration-200',
                        isActive
                          ? 'bg-surface-800 border-border-600 shadow-[0_4px_24px_rgba(0,0,0,0.3)]'
                          : 'bg-surface-900/60 border-border-700 hover:bg-surface-800/60 hover:border-border-600',
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative shrink-0">
                          <div
                            className={clsx(
                              'w-11 h-11 rounded-[12px] flex items-center justify-center border transition-all',
                              isActive ? c.icon : 'bg-surface-700 border-border-700 text-text-tertiary',
                            )}
                          >
                            <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-bg-950 border border-border-700 flex items-center justify-center text-[9px] font-semibold text-text-tertiary">
                            {i + 1}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={clsx('text-[14px] font-semibold leading-snug transition-colors', isActive ? 'text-text-primary' : 'text-text-secondary')}>
                              {t(`stages.${key}.title`)}
                            </h3>
                          </div>
                          {isActive && (
                            <p className="mt-1.5 text-[13px] text-text-secondary leading-[1.55]">
                              {t(`stages.${key}.description`)}
                            </p>
                          )}
                        </div>

                        <ChevronRight
                          className={clsx(
                            'w-4 h-4 shrink-0 mt-0.5 transition-transform duration-200',
                            isActive ? 'text-brand-secondary rotate-90 lg:rotate-0' : 'text-text-tertiary',
                          )}
                        />
                      </div>

                      {isActive && (
                        <div className="mt-4 h-0.5 rounded-full bg-surface-700 overflow-hidden">
                          <div className={clsx('h-full rounded-full transition-all duration-500', c.bar)} style={{ width: `${((i + 1) / 6) * 100}%` }} />
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>

            {/* Phase legend */}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-text-secondary px-1">
              {([['phase1','phase1Label'],['phase2','phase2Label'],['phase3','phase3Label']] as const).map(([ph, label]) => (
                <span key={ph} className="inline-flex items-center gap-2">
                  <span className={clsx('w-2 h-2 rounded-full', STAGE_COLORS[ph].bar)} />
                  {t(label)}
                </span>
              ))}
            </div>
          </div>

          {/* Right: photo panel */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="relative">
              {/* Glow */}
              <div
                aria-hidden
                className="absolute -inset-8 rounded-[40px] blur-3xl opacity-35 transition-all duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse, ${colors.glow}, transparent 70%)` }}
              />

              <div className="relative surface-card rounded-[24px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)] border border-border-600">
                {/* Photo */}
                <div className="relative h-64 md:h-[380px] overflow-hidden bg-surface-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    key={activeStep}
                    src={STAGE_PHOTOS[activeStep]}
                    alt={t(`stages.${active.key}.title`)}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(0.96) saturate(0.95) contrast(1.03)' }}
                  />

                  {/* Gradient overlay */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(8,10,11,0.08) 0%, rgba(8,10,11,0.02) 26%, rgba(8,10,11,0.12) 56%, rgba(8,10,11,0.76) 100%)',
                    }}
                  />

                  {/* Top left chip */}
                  <div className="absolute top-4 left-4">
                    <span className={clsx('inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border backdrop-blur-sm', colors.badge)}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full', colors.bar)} />
                      {phaseLabels[activeStep]}
                    </span>
                  </div>

                  {/* Top right: dot navigation */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5">
                    {stages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStep(idx)}
                        className={clsx(
                          'rounded-full transition-all duration-300',
                          idx === activeStep
                            ? clsx('w-5 h-2', colors.bar)
                            : 'w-2 h-2 bg-white/30 hover:bg-white/55',
                        )}
                      />
                    ))}
                  </div>

                  {/* Bottom text */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                    <p className="text-[20px] md:text-[24px] font-semibold text-white leading-snug drop-shadow-lg">
                      {t(`stages.${active.key}.title`)}
                    </p>
                    <p className="mt-2 text-[13px] md:text-[14px] text-white/75 leading-relaxed max-w-[500px]">
                      {t(`stages.${active.key}.description`)}
                    </p>
                  </div>
                </div>

                {/* Bottom stats strip */}
                <div className="grid grid-cols-3 divide-x divide-border-700 bg-surface-900">
                  <div className="px-4 py-4 md:px-6 md:py-5">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-1.5">Этап</div>
                    <div className="text-[18px] font-semibold text-text-primary tabular">
                      {activeStep + 1}<span className="text-text-tertiary text-[14px]"> / 6</span>
                    </div>
                  </div>
                  <div className="px-4 py-4 md:px-6 md:py-5">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-1.5">Фаза</div>
                    <div className={clsx('text-[13px] font-semibold leading-tight', colors.text)}>
                      {phaseLabels[activeStep]}
                    </div>
                  </div>
                  <div className="px-4 py-4 md:px-6 md:py-5">
                    <div className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-1.5">Прогресс</div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full transition-all duration-500', colors.bar)}
                          style={{ width: `${((activeStep + 1) / 6) * 100}%` }}
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-text-primary tabular shrink-0">
                        {Math.round(((activeStep + 1) / 6) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prev / Next nav */}
              <div className="mt-5 flex items-center justify-between px-1">
                <button
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  disabled={activeStep === 0}
                  className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-[10px] hover:bg-surface-800"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Назад
                </button>
                <span className="text-[12px] text-text-tertiary tabular">{activeStep + 1} из 6</span>
                <button
                  onClick={() => setActiveStep((s) => Math.min(5, s + 1))}
                  disabled={activeStep === 5}
                  className="inline-flex items-center gap-2 text-[13px] text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-[10px] hover:bg-surface-800"
                >
                  Далее
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
