import { useTranslations } from 'next-intl';
import { TrendingUp, Eye, DollarSign, BarChart3, Landmark, ShieldCheck, Sprout, ScaleIcon } from 'lucide-react';

export default function Benefits() {
  const t = useTranslations('benefits');

  const investorItems = [
    { icon: DollarSign, key: 'passive' },
    { icon: Eye, key: 'transparent' },
    { icon: BarChart3, key: 'lowEntry' },
    { icon: TrendingUp, key: 'tracked' },
  ] as const;

  const farmerItems = [
    { icon: Landmark, key: 'capital' },
    { icon: ShieldCheck, key: 'noUpfront' },
    { icon: ScaleIcon, key: 'fair' },
    { icon: Sprout, key: 'grow' },
  ] as const;

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Investors */}
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              {t('investors.badge')}
            </span>
            <h2 className="text-4xl font-bold mb-8">{t('investors.title')}</h2>
            <div className="grid grid-cols-2 gap-4">
              {investorItems.map(({ icon: Icon, key }) => (
                <div key={key} className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
                  <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-accent" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{t(`investors.items.${key}.title`)}</h4>
                  <p className="text-xs text-muted leading-relaxed">{t(`investors.items.${key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&q=80"
              alt="Investor"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
        </div>

        {/* Farmers */}
        <div className="grid grid-cols-2 gap-16 items-center">
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80"
              alt="Farmer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>
          <div>
            <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              {t('farmers.badge')}
            </span>
            <h2 className="text-4xl font-bold mb-8">{t('farmers.title')}</h2>
            <div className="grid grid-cols-2 gap-4">
              {farmerItems.map(({ icon: Icon, key }) => (
                <div key={key} className="bg-surface border border-border rounded-xl p-4 hover:border-accent/30 transition-colors">
                  <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-accent" strokeWidth={1.5} />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{t(`farmers.items.${key}.title`)}</h4>
                  <p className="text-xs text-muted leading-relaxed">{t(`farmers.items.${key}.description`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
