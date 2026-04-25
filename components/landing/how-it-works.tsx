import { useTranslations } from 'next-intl';
import { Search, PiggyBank, TrendingUp } from 'lucide-react';

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      icon: Search,
      number: '01',
      title: t('step1.title'),
      description: t('step1.description'),
    },
    {
      icon: PiggyBank,
      number: '02',
      title: t('step2.title'),
      description: t('step2.description'),
    },
    {
      icon: TrendingUp,
      number: '03',
      title: t('step3.title'),
      description: t('step3.description'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-surface/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            {t('badge')}
          </span>
          <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
          <p className="text-muted text-lg max-w-xl mx-auto">{t('subtitle')}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="absolute top-14 left-1/3 right-1/3 h-px bg-gradient-to-r from-border via-accent/40 to-border hidden lg:block" />

          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <div key={i} className="relative text-center group">
              <div className="flex flex-col items-center">
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-surface border-2 border-border group-hover:border-accent/50 transition-colors flex items-center justify-center">
                    <Icon className="w-9 h-9 text-accent" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-accent text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
