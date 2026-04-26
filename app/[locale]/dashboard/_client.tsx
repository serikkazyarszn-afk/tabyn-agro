'use client';

import { useMemo, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_INVESTMENTS } from '@/lib/demo-data';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import {
  TrendingUp,
  Wallet,
  BarChart3,
  CheckCircle,
  Clock,
  ArrowRight,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  BellRing,
  FileText,
  Activity,
  Hash,
  Scale,
  PieChart as PieIcon,
} from 'lucide-react';
import { clsx } from 'clsx';

export default function DashboardClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('dashboard');
  const tFeat = useTranslations('featuredAnimals');
  const tDue = useTranslations('dueDiligence');

  const DEMO_BALANCE = 305000;

  const totalInvested = DEMO_INVESTMENTS.reduce((s, i) => s + i.amount, 0);
  const activeInvested = DEMO_INVESTMENTS.filter((i) => i.status === 'active')
    .reduce((s, i) => s + i.amount, 0);
  const projectedShare = DEMO_INVESTMENTS.filter((i) => i.status === 'active')
    .reduce((s, i) => s + (i.expected_return - i.amount), 0);
  const realizedProfit = DEMO_INVESTMENTS.filter((i) => i.status === 'completed')
    .reduce((s, i) => s + ((i.actual_return ?? 0) - i.amount), 0);
  const activeCount = DEMO_INVESTMENTS.filter((i) => i.status === 'active').length;
  const completedCount = DEMO_INVESTMENTS.filter((i) => i.status === 'completed').length;

  // Exposure by species
  const exposure = useMemo(() => {
    const buckets: Record<string, number> = {};
    DEMO_INVESTMENTS.forEach((inv) => {
      if (!inv.animal) return;
      buckets[inv.animal.type] = (buckets[inv.animal.type] ?? 0) + inv.amount;
    });
    const total = Object.values(buckets).reduce((a, b) => a + b, 0) || 1;
    const palette: Record<string, string> = {
      cow: 'var(--data-01)',
      sheep: 'var(--data-02)',
      horse: 'var(--data-03)',
      goat: 'var(--data-04)',
      camel: 'var(--data-05)',
    };
    return Object.entries(buckets)
      .sort((a, b) => b[1] - a[1])
      .map(([type, amount]) => ({
        type,
        amount,
        pct: amount / total,
        color: palette[type] ?? 'var(--text-tertiary)',
      }));
  }, []);

  // Upcoming payouts (synthetic: active investments sorted by time-left)
  const upcoming = useMemo(() => {
    return DEMO_INVESTMENTS.filter((i) => i.status === 'active')
      .map((inv) => {
        const monthsLeft = Math.max(1, (inv.animal?.duration_months ?? 6) - 2);
        return {
          inv,
          monthsLeft,
          projected: inv.expected_return,
        };
      })
      .sort((a, b) => a.monthsLeft - b.monthsLeft);
  }, []);

  // Activity feed (synthetic)
  const activity = useMemo(
    () => {
      const feed: Array<{
        date: string;
        type: 'invested' | 'update' | 'payout' | 'doc';
        animal: string;
        body: string;
      }> = [];
      DEMO_INVESTMENTS.forEach((inv) => {
        if (!inv.animal) return;
        feed.push({
          date: inv.invested_at,
          type: 'invested',
          animal: inv.animal.name,
          body: `₸${inv.amount.toLocaleString('ru-RU')}`,
        });
        if (inv.status === 'completed' && inv.completed_at) {
          feed.push({
            date: inv.completed_at,
            type: 'payout',
            animal: inv.animal.name,
            body: `₸${(inv.actual_return ?? 0).toLocaleString('ru-RU')}`,
          });
        }
      });
      return feed.sort((a, b) => b.date.localeCompare(a.date));
    },
    [],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-2">
            {t('badge')}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.1]">
            {t('title')}
          </h1>
          <p className="mt-1.5 text-[14px] text-text-secondary">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/animals`}>
            <Button variant="primary" size="md" className="group">
              {t('browseAnimals')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* KPI row */}
      <section aria-label={t('kpiLabel')} className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-700 rounded-[16px] overflow-hidden border border-border-700">
          <KPI
            icon={BarChart3}
            label={t('totalInvested')}
            value={`₸${totalInvested.toLocaleString('ru-RU')}`}
            helper={`${activeCount + completedCount} ${t('lotsTotal')}`}
          />
          <KPI
            icon={TrendingUp}
            label={t('projectedShare')}
            value={`+₸${projectedShare.toLocaleString('ru-RU')}`}
            accent="brand"
            helper={`${activeCount} ${t('active')}`}
          />
          <KPI
            icon={CheckCircle}
            label={t('realizedProfit')}
            value={`+₸${realizedProfit.toLocaleString('ru-RU')}`}
            accent="positive"
            helper={`${completedCount} ${t('completed')}`}
          />
          <KPI
            icon={Wallet}
            label={t('walletBalance')}
            value={`₸${DEMO_BALANCE.toLocaleString('ru-RU')}`}
            helper={<button className="text-[12px] text-brand hover:text-brand-hover">{t('topUp')}</button>}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Exposure — portfolio composition */}
        <section className="surface-card rounded-[16px] p-5 md:p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {t('exposureLabel')}
              </div>
              <h2 className="text-[14px] font-semibold text-text-primary mt-0.5">
                {t('exposureTitle')}
              </h2>
            </div>
            <PieIcon className="w-4 h-4 text-text-tertiary" />
          </div>

          {exposure.length === 0 ? (
            <p className="text-[13px] text-text-tertiary">{t('noExposure')}</p>
          ) : (
            <div className="flex items-center gap-6">
              <ExposureDonut segments={exposure} />
              <ul className="flex-1 space-y-2.5 min-w-0">
                {exposure.map((e) => (
                  <li
                    key={e.type}
                    className="flex items-center gap-2.5 text-[12.5px]"
                  >
                    <span
                      aria-hidden
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: e.color }}
                    />
                    <span className="text-text-secondary capitalize flex-1 truncate">
                      {e.type}
                    </span>
                    <span className="text-text-primary tabular shrink-0">
                      {Math.round(e.pct * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Upcoming payouts */}
        <section className="surface-card rounded-[16px] p-5 md:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {t('upcomingLabel')}
              </div>
              <h2 className="text-[14px] font-semibold text-text-primary mt-0.5">
                {t('upcomingTitle')}
              </h2>
            </div>
            <Clock className="w-4 h-4 text-text-tertiary" />
          </div>

          {upcoming.length === 0 ? (
            <p className="text-[13px] text-text-tertiary">{t('noUpcoming')}</p>
          ) : (
            <ul className="divide-y divide-border-700 -mx-2">
              {upcoming.map(({ inv, monthsLeft, projected }) => (
                <li
                  key={inv.id}
                  className="flex items-center gap-3 md:gap-4 px-2 py-3"
                >
                  <div className="w-9 h-9 rounded-[9px] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-text-primary truncate">
                      {inv.animal?.name}
                    </div>
                    <div className="text-[11.5px] text-text-tertiary tabular font-mono truncate">
                      {monthsLeft} {t('monthsLeft')} · {inv.animal?.duration_months}
                      {t('totalMo')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-semibold text-brand tabular">
                      +₸{projected.toLocaleString('ru-RU')}
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
                      {t('projected')}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Portfolio table */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
              {t('positionsLabel')}
            </div>
            <h2 className="text-[16px] font-semibold text-text-primary mt-0.5">
              {t('myInvestments')}
            </h2>
          </div>
        </div>

        {DEMO_INVESTMENTS.length === 0 ? (
          <div className="surface-card rounded-[16px] py-16 text-center">
            <p className="text-[13px] text-text-secondary mb-4">
              {t('noInvestments')}
            </p>
            <Link href={`/${locale}/animals`}>
              <Button variant="primary" size="md">
                {t('browseAnimals')}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block surface-card rounded-[16px] overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-surface-800 border-b border-border-700">
                  <tr className="text-left">
                    <Th>{t('cols.asset')}</Th>
                    <Th>{t('cols.location')}</Th>
                    <Th align="right">{t('cols.invested')}</Th>
                    <Th align="right">{t('cols.projected')}</Th>
                    <Th align="right">{t('cols.progress')}</Th>
                    <Th align="right">{t('cols.status')}</Th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_INVESTMENTS.map((inv) => {
                    const animal = inv.animal;
                    if (!animal) return null;
                    const monthsLeft = Math.max(0, animal.duration_months - 2);
                    const progressPct = Math.round(
                      ((animal.duration_months - monthsLeft) / animal.duration_months) *
                        100,
                    );
                    const profit =
                      inv.status === 'completed'
                        ? (inv.actual_return ?? 0) - inv.amount
                        : inv.expected_return - inv.amount;
                    const profitPct = ((profit / inv.amount) * 100).toFixed(1);
                    return (
                      <tr
                        key={inv.id}
                        className="border-b border-border-700 last:border-b-0 hover:bg-surface-800/60 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/${locale}/animals/${animal.id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="w-9 h-9 rounded-[9px] bg-surface-800 border border-border-700 overflow-hidden shrink-0 flex items-center justify-center">
                              {animal.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={animal.image_url}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Hash className="w-3.5 h-3.5 text-text-tertiary" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13.5px] font-medium text-text-primary truncate">
                                {animal.name}
                              </div>
                              <div className="text-[11px] text-text-tertiary capitalize truncate">
                                {animal.type} · {animal.breed}
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-text-secondary text-[12.5px]">
                            <MapPin className="w-3 h-3 text-text-tertiary" />
                            <span className="truncate">
                              {animal.farmer?.location}
                            </span>
                          </div>
                          <div className="text-[11px] text-text-tertiary truncate mt-0.5">
                            {animal.farmer?.farm_name}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right tabular">
                          ₸{inv.amount.toLocaleString('ru-RU')}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div
                            className={clsx(
                              'text-[13px] font-semibold tabular',
                              inv.status === 'completed'
                                ? 'text-positive'
                                : 'text-brand',
                            )}
                          >
                            +₸{profit.toLocaleString('ru-RU')}
                          </div>
                          <div className="text-[11px] text-text-tertiary tabular">
                            {profitPct}%
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-24 h-1.5 rounded-full bg-surface-800 overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-text-tertiary tabular shrink-0">
                              {inv.status === 'completed'
                                ? '100%'
                                : `${progressPct}%`}
                            </span>
                          </div>
                          {inv.status === 'active' && (
                            <div className="text-[10.5px] text-text-tertiary text-right tabular mt-1">
                              {monthsLeft} {t('monthsLeft')}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Badge
                            variant={
                              inv.status === 'completed' ? 'positive' : 'brand'
                            }
                            size="sm"
                            dot
                          >
                            {t(`status.${inv.status}`)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="md:hidden space-y-3">
              {DEMO_INVESTMENTS.map((inv) => {
                const animal = inv.animal;
                if (!animal) return null;
                const monthsLeft = Math.max(0, animal.duration_months - 2);
                const progressPct = Math.round(
                  ((animal.duration_months - monthsLeft) / animal.duration_months) * 100,
                );
                const profit =
                  inv.status === 'completed'
                    ? (inv.actual_return ?? 0) - inv.amount
                    : inv.expected_return - inv.amount;
                return (
                  <li key={inv.id}>
                    <Link
                      href={`/${locale}/animals/${animal.id}`}
                      className="block surface-card rounded-[14px] p-4"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-[10px] bg-surface-800 border border-border-700 overflow-hidden shrink-0">
                          {animal.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={animal.image_url} alt="" className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-text-primary truncate">
                            {animal.name}
                          </div>
                          <div className="text-[11.5px] text-text-tertiary truncate">
                            {animal.farmer?.location}
                          </div>
                        </div>
                        <Badge variant={inv.status === 'completed' ? 'positive' : 'brand'} size="sm" dot>
                          {t(`status.${inv.status}`)}
                        </Badge>
                      </div>
                      <dl className="grid grid-cols-2 gap-3 text-[12px] mb-3">
                        <div>
                          <dt className="text-text-tertiary">{t('cols.invested')}</dt>
                          <dd className="text-text-primary tabular font-medium">₸{inv.amount.toLocaleString('ru-RU')}</dd>
                        </div>
                        <div>
                          <dt className="text-text-tertiary">{t('cols.projected')}</dt>
                          <dd className={clsx('tabular font-medium', inv.status === 'completed' ? 'text-positive' : 'text-brand')}>
                            +₸{profit.toLocaleString('ru-RU')}
                          </dd>
                        </div>
                      </dl>
                      <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* Bottom strip: Activity + Alerts + Docs */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SideCard
          icon={Activity}
          title={t('activityTitle')}
          accent="brand"
        >
          <ul className="space-y-3">
            {activity.slice(0, 5).map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <div
                  className={clsx(
                    'mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0',
                    a.type === 'invested'
                      ? 'bg-brand/10 border-brand/30 text-brand'
                      : a.type === 'payout'
                        ? 'bg-positive/10 border-positive/30 text-positive'
                        : 'bg-surface-800 border-border-700 text-text-tertiary',
                  )}
                >
                  {a.type === 'invested' ? (
                    <ArrowDownRight className="w-3 h-3" />
                  ) : a.type === 'payout' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <Activity className="w-3 h-3" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-text-primary truncate">
                    {t(`activity.${a.type}`, { animal: a.animal } as never) || `${a.animal}`}
                  </div>
                  <div className="text-[11px] text-text-tertiary tabular font-mono mt-0.5">
                    {a.date} · {a.body}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SideCard>

        <SideCard icon={BellRing} title={t('alertsTitle')} accent="warning">
          <ul className="space-y-3">
            <AlertRow
              level="warning"
              title={t('alerts.updatePending.title')}
              body={t('alerts.updatePending.body')}
            />
            <AlertRow
              level="info"
              title={t('alerts.docReady.title')}
              body={t('alerts.docReady.body')}
            />
            <AlertRow
              level="info"
              title={t('alerts.preSale.title')}
              body={t('alerts.preSale.body')}
            />
          </ul>
        </SideCard>

        <SideCard icon={FileText} title={t('documentsTitle')} accent="gold">
          <ul className="space-y-2.5">
            {[
              { key: 'q1Report', date: '2026-04-01' },
              { key: 'vetPassports', date: '2026-03-18' },
              { key: 'contracts', date: '2026-02-10' },
              { key: 'payoutStatements', date: '2026-01-22' },
            ].map((d) => (
              <li
                key={d.key}
                className="flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-[8px] bg-surface-800 border border-border-700 flex items-center justify-center shrink-0 group-hover:border-border-600">
                  <FileText className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] text-text-primary truncate group-hover:text-brand transition-colors">
                    {tDue(`docs.${d.key}` as never) || t(`docs.${d.key}`)}
                  </div>
                  <div className="text-[10.5px] text-text-tertiary tabular font-mono">
                    {d.date}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-text-primary transition-colors shrink-0" />
              </li>
            ))}
          </ul>
        </SideCard>
      </section>
    </div>
  );
}

/* ============================================================
   Bits
   ============================================================ */

function KPI({
  icon: Icon,
  label,
  value,
  helper,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  helper?: React.ReactNode;
  accent?: 'brand' | 'positive' | 'gold';
}) {
  const color =
    accent === 'brand'
      ? 'text-brand'
      : accent === 'positive'
        ? 'text-positive'
        : accent === 'gold'
          ? 'text-brand-secondary'
          : 'text-text-primary';
  return (
    <div className="bg-surface-900 p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className={clsx('text-[24px] md:text-[26px] font-semibold tabular leading-none', color)}>
        {value}
      </div>
      {helper && (
        <div className="mt-2 text-[11.5px] text-text-tertiary">{helper}</div>
      )}
    </div>
  );
}

function Th({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={clsx(
        'px-5 py-3 text-[11px] uppercase tracking-[0.08em] text-text-tertiary font-medium',
        align === 'right' && 'text-right',
      )}
    >
      {children}
    </th>
  );
}

function ExposureDonut({
  segments,
}: {
  segments: { type: string; pct: number; color: string }[];
}) {
  const size = 104;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-800)"
          strokeWidth={stroke}
        />
        {segments.map((s) => {
          const dash = circumference * s.pct;
          const dashOffset = -offset;
          offset += dash;
          return (
            <circle
              key={s.type}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[18px] font-semibold text-text-primary tabular leading-none">
          {segments.length}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
          species
        </span>
      </div>
    </div>
  );
}

function SideCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent: 'brand' | 'warning' | 'gold';
  children: React.ReactNode;
}) {
  const color = {
    brand: 'text-brand bg-brand/10 border-brand/20',
    warning: 'text-warning bg-warning/10 border-warning/25',
    gold: 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/25',
  }[accent];
  return (
    <div className="surface-card rounded-[16px] p-5 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={clsx(
            'w-8 h-8 rounded-[9px] border flex items-center justify-center',
            color,
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-[14px] font-semibold text-text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function AlertRow({
  level,
  title,
  body,
}: {
  level: 'warning' | 'info' | 'positive';
  title: string;
  body: string;
}) {
  const dot = {
    warning: 'bg-warning',
    info: 'bg-tech',
    positive: 'bg-positive',
  }[level];
  return (
    <li className="flex items-start gap-2.5">
      <span
        aria-hidden
        className={clsx('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', dot)}
      />
      <div className="min-w-0">
        <div className="text-[13px] font-medium text-text-primary leading-snug">
          {title}
        </div>
        <div className="text-[12px] text-text-secondary leading-[1.5] mt-0.5">
          {body}
        </div>
      </div>
    </li>
  );
}
