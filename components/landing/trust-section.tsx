import { useTranslations } from 'next-intl';
import { ShieldCheck, FileText, Bell, HeadphonesIcon } from 'lucide-react';

export default function TrustSection() {
  const t = useTranslations('trust');

  const items = [
    { icon: ShieldCheck, key: 'verified' },
    { icon: FileText, key: 'legal' },
    { icon: Bell, key: 'updates' },
    { icon: HeadphonesIcon, key: 'support' },
  ] as const;

  return (
    <section className="py-24 bg-surface/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
            {t('badge')}
          </span>
          <h2 className="text-4xl font-bold">{t('title')}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="bg-surface border border-border rounded-2xl p-6 text-center hover:border-accent/30 transition-colors group"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-sm mb-2">{t(`items.${key}.title`)}</h3>
              <p className="text-xs text-muted leading-relaxed">{t(`items.${key}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
