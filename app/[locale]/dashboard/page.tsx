'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_INVESTMENTS } from '@/lib/demo-data';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { use } from 'react';
import { TrendingUp, Wallet, BarChart3, CheckCircle, Clock, ArrowRight, MapPin } from 'lucide-react';

const ANIMAL_EMOJIS: Record<string, string> = {
  cow: '🐄', sheep: '🐑', horse: '🐴', goat: '🐐', camel: '🐪',
};

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('dashboard');

  const DEMO_BALANCE = 305000;
  const totalInvested = DEMO_INVESTMENTS.reduce((s, i) => s + i.amount, 0);
  const expectedReturn = DEMO_INVESTMENTS.filter(i => i.status === 'active').reduce((s, i) => s + i.expected_return, 0);
  const activeCount = DEMO_INVESTMENTS.filter(i => i.status === 'active').length;
  const completedCount = DEMO_INVESTMENTS.filter(i => i.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
          <p className="text-muted text-sm">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/animals`}>
          <Button variant="primary" size="md" className="group">
            {t('browseAnimals')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <BarChart3 className="w-4 h-4" />
            {t('totalInvested')}
          </div>
          <div className="text-2xl font-bold">₸{totalInvested.toLocaleString()}</div>
        </div>
        <div className="bg-surface border border-accent/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <TrendingUp className="w-4 h-4 text-accent" />
            {t('expectedReturn')}
          </div>
          <div className="text-2xl font-bold text-accent">₸{expectedReturn.toLocaleString()}</div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <Clock className="w-4 h-4" />
            {t('activeInvestments')}
          </div>
          <div className="text-2xl font-bold">{activeCount}</div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <Wallet className="w-4 h-4" />
            {t('walletBalance')}
          </div>
          <div className="text-2xl font-bold">₸{DEMO_BALANCE.toLocaleString()}</div>
          <button className="text-xs text-accent hover:underline mt-1">{t('topUp')}</button>
        </div>
      </div>

      {/* Investments list */}
      <div>
        <h2 className="text-xl font-bold mb-5">{t('myInvestments')}</h2>

        {DEMO_INVESTMENTS.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="mb-4">{t('noInvestments')}</p>
            <Link href={`/${locale}/animals`}>
              <Button variant="primary">{t('browseAnimals')}</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {DEMO_INVESTMENTS.map((inv) => {
              const animal = inv.animal;
              if (!animal) return null;
              const profit = inv.status === 'completed'
                ? (inv.actual_return ?? 0) - inv.amount
                : inv.expected_return - inv.amount;
              const profitPct = ((profit / inv.amount) * 100).toFixed(1);
              const monthsLeft = animal.duration_months - 2;

              return (
                <div key={inv.id} className="bg-surface border border-border rounded-2xl p-5 flex items-center gap-6 hover:border-muted-2 transition-colors">
                  {/* Animal image/emoji */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    {animal.image_url ? (
                      <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-background flex items-center justify-center text-2xl">
                        {ANIMAL_EMOJIS[animal.type]}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{animal.name}</span>
                      <Badge variant={inv.status === 'active' ? 'accent' : 'success'}>
                        {t(`status.${inv.status}`)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="w-3 h-3" />
                      <span>{animal.farmer?.location}</span>
                      <span className="text-muted-2">·</span>
                      <span>{animal.farmer?.farm_name}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <div className="text-sm text-muted mb-0.5">{t('totalInvested')}</div>
                    <div className="font-bold">₸{inv.amount.toLocaleString()}</div>
                  </div>

                  {/* Expected / actual return */}
                  <div className="text-right">
                    <div className="text-sm text-muted mb-0.5">
                      {inv.status === 'completed' ? t('profit') : t('expectedReturn')}
                    </div>
                    <div className={`font-bold ${inv.status === 'completed' ? 'text-success' : 'text-accent'}`}>
                      +₸{profit.toLocaleString()}
                      <span className="text-xs ml-1">({profitPct}%)</span>
                    </div>
                  </div>

                  {/* Progress */}
                  {inv.status === 'active' && (
                    <div className="w-24 text-right">
                      <div className="text-xs text-muted mb-1">{monthsLeft} mo. left</div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${Math.round(((animal.duration_months - monthsLeft) / animal.duration_months) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {inv.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-success text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Completed</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
