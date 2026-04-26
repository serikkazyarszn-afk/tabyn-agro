'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Scenario = 'bear' | 'base' | 'bull';

/**
 * ProfitSharing — payout waterfall.
 *
 * Per master prompt: 70/30 split is not enough. Show the full mechanic:
 *   principal → sale value → gross profit → platform fee (0) → investor share → farmer share.
 * Offer three scenarios so the risk is legible.
 */
export default function ProfitSharing() {
  const t = useTranslations('profitSharing');

  const principal = 250000;
  const [scenario, setScenario] = useState<Scenario>('base');

  const multipliers: Record<Scenario, number> = {
    bear: 1.06,
    base: 1.28,
    bull: 1.45,
  };
  const salePrice = Math.round(principal * multipliers[scenario]);
  const grossProfit = salePrice - principal;
  const platformFee = 0; // disclosed explicitly
  const distributable = grossProfit - platformFee;
  const investorShare = Math.round(distributable * 0.7);
  const farmerShare = distributable - investorShare;
  const investorROI = useMemo(
    () => ((investorShare / principal) * 100).toFixed(1),
    [investorShare, principal],
  );

  return (
    <section className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(900px 500px at 15% 20%, rgba(13,90,72,0.18), transparent 60%), radial-gradient(900px 500px at 85% 80%, rgba(224,176,96,0.10), transparent 60%)',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: narrative + split */}
        <div className="lg:col-span-5">
          <h2 className="text-[32px] md:text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-text-primary">
            {t('title')}
          </h2>
          <p className="mt-3 text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Split bars */}
          <div className="mt-8 space-y-3">
            <SplitBar
              label={t('investor')}
              pct={70}
              description={t('investorDesc')}
              tone="brand"
            />
            <SplitBar
              label={t('farmer')}
              pct={30}
              description={t('farmerDesc')}
              tone="gold"
            />
          </div>

          {/* Disclosure note */}
          <p className="mt-6 text-[12px] text-text-tertiary leading-relaxed">
            {t('disclosure')}
          </p>
        </div>

        {/* Right: waterfall + scenarios */}
        <div className="lg:col-span-7">
          <div className="surface-card rounded-[18px] p-5 md:p-7">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                  {t('waterfall.title')}
                </div>
                <div className="mt-1 text-[15px] font-semibold text-text-primary">
                  {t('waterfall.subtitle')}
                </div>
              </div>

              {/* Scenario toggle */}
              <div
                role="tablist"
                aria-label={t('waterfall.scenarioLabel')}
                className="inline-flex items-center bg-surface-800 border border-border-700 rounded-[10px] p-0.5 self-start sm:self-auto"
              >
                {(['bear', 'base', 'bull'] as const).map((s) => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={scenario === s}
                    onClick={() => setScenario(s)}
                    className={clsx(
                      'h-9 px-3 text-[12px] font-medium rounded-[8px] inline-flex items-center gap-1.5 transition-colors tabular',
                      scenario === s
                        ? s === 'bull'
                          ? 'bg-positive text-bg-950'
                          : s === 'bear'
                            ? 'bg-destructive/90 text-bg-950'
                            : 'bg-brand text-text-primary'
                        : 'text-text-secondary hover:text-text-primary',
                    )}
                  >
                    {s === 'bull' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : s === 'bear' ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : (
                      <Minus className="w-3 h-3" />
                    )}
                    {t(`waterfall.${s}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Waterfall rows */}
            <ul className="divide-y divide-border-700">
              <WaterfallRow
                label={t('waterfall.principal')}
                value={principal}
                muted
              />
              <WaterfallRow
                label={t('waterfall.salePrice')}
                value={salePrice}
              />
              <WaterfallRow
                label={t('waterfall.grossProfit')}
                value={grossProfit}
                accent="brand"
              />
              <WaterfallRow
                label={t('waterfall.platformFee')}
                value={-platformFee}
                muted
                note={t('waterfall.platformFeeNote')}
              />
              <WaterfallRow
                label={t('waterfall.investorShare')}
                value={investorShare}
                accent="brand"
                emphasis
              />
              <WaterfallRow
                label={t('waterfall.farmerShare')}
                value={farmerShare}
                accent="gold"
              />
            </ul>

            {/* Summary strip */}
            <div className="mt-5 grid grid-cols-3 gap-px rounded-[12px] overflow-hidden border border-border-700 bg-border-700">
              <SummaryTile
                label={t('waterfall.roi')}
                value={`+${investorROI}%`}
                tone="brand"
              />
              <SummaryTile
                label={t('waterfall.term')}
                value={t('waterfall.months8')}
              />
              <SummaryTile
                label={t('waterfall.scenarioActive')}
                value={t(`waterfall.${scenario}`)}
                tone={
                  scenario === 'bull'
                    ? 'positive'
                    : scenario === 'bear'
                      ? 'warning'
                      : 'neutral'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SplitBar({
  label,
  pct,
  description,
  tone,
}: {
  label: string;
  pct: number;
  description: string;
  tone: 'brand' | 'gold';
}) {
  const color = tone === 'brand' ? 'bg-brand' : 'bg-brand-secondary';
  const border = tone === 'brand' ? 'border-brand/30' : 'border-brand-secondary/30';
  const text = tone === 'brand' ? 'text-brand' : 'text-brand-secondary';
  return (
    <div className={`surface-card rounded-[14px] p-4 md:p-5 border ${border}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px] font-semibold text-text-primary">
          {label}
        </span>
        <span className={`text-[24px] font-semibold tabular ${text}`}>{pct}%</span>
      </div>
      <p className="text-[13px] text-text-secondary leading-relaxed">{description}</p>
      <div className="mt-3 h-1.5 rounded-full bg-surface-800 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function WaterfallRow({
  label,
  value,
  note,
  muted,
  accent,
  emphasis,
}: {
  label: string;
  value: number;
  note?: string;
  muted?: boolean;
  accent?: 'brand' | 'gold';
  emphasis?: boolean;
}) {
  const sign = value < 0 ? '−' : value > 0 ? '+' : '';
  const formatted = `${sign}₸${Math.abs(value).toLocaleString('ru-RU')}`;
  const valueColor = accent === 'brand'
    ? 'text-brand'
    : accent === 'gold'
      ? 'text-brand-secondary'
      : muted
        ? 'text-text-tertiary'
        : 'text-text-primary';

  return (
    <li className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col">
        <span
          className={clsx(
            'text-[13px] md:text-[14px]',
            emphasis ? 'font-semibold text-text-primary' : 'text-text-secondary',
          )}
        >
          {label}
        </span>
        {note && (
          <span className="mt-0.5 text-[11px] text-text-tertiary">{note}</span>
        )}
      </div>
      <span
        className={clsx(
          'tabular shrink-0',
          emphasis ? 'text-[18px] md:text-[20px] font-semibold' : 'text-[14px] md:text-[15px] font-medium',
          valueColor,
        )}
      >
        {formatted}
      </span>
    </li>
  );
}

function SummaryTile({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'brand' | 'positive' | 'warning' | 'neutral';
}) {
  const color =
    tone === 'brand'
      ? 'text-brand'
      : tone === 'positive'
        ? 'text-positive'
        : tone === 'warning'
          ? 'text-warning'
          : 'text-text-primary';
  return (
    <div className="bg-surface-900 p-4">
      <div className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </div>
      <div className={clsx('mt-1 text-[16px] font-semibold tabular', color)}>
        {value}
      </div>
    </div>
  );
}
