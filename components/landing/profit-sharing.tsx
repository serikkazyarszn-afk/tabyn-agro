import { useTranslations } from 'next-intl';

export default function ProfitSharing() {
  const t = useTranslations('profitSharing');

  const invested = 250000;
  const salePrice = 320000;
  const profit = salePrice - invested;
  const yourEarnings = Math.round(profit * 0.7);
  const farmerEarnings = Math.round(profit * 0.3);

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left: explanation */}
          <div>
            <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              {t('badge')}
            </span>
            <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
            <p className="text-muted mb-10">{t('subtitle')}</p>

            <div className="space-y-4">
              {/* Investor share */}
              <div className="bg-surface border border-accent/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{t('investor')}</span>
                  <span className="text-3xl font-bold text-accent">70%</span>
                </div>
                <p className="text-sm text-muted">{t('investorDesc')}</p>
                <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: '70%' }} />
                </div>
              </div>

              {/* Farmer share */}
              <div className="bg-surface border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{t('farmer')}</span>
                  <span className="text-3xl font-bold text-muted">30%</span>
                </div>
                <p className="text-sm text-muted">{t('farmerDesc')}</p>
                <div className="mt-3 h-2 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-muted-2 rounded-full" style={{ width: '30%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: example calculation */}
          <div className="bg-surface border border-border rounded-2xl p-8">
            <h3 className="font-bold text-lg mb-6 text-muted">{t('example.title')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted text-sm">{t('example.invested')}</span>
                <span className="font-semibold">₸{invested.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted text-sm">{t('example.salePrice')}</span>
                <span className="font-semibold">₸{salePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted text-sm">{t('example.profit')}</span>
                <span className="font-semibold text-success">+₸{profit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm">{t('example.yourEarnings')}</span>
                <span className="font-bold text-xl text-accent">+₸{yourEarnings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted text-sm">{t('example.farmerEarnings')}</span>
                <span className="font-semibold text-muted">+₸{farmerEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
