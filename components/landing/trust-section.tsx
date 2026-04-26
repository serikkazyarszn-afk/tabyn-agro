import { useTranslations } from 'next-intl';
import {
  ShieldCheck,
  Stamp,
  Hash,
  FileText,
  Banknote,
  LifeBuoy,
  Activity,
  BookOpen,
} from 'lucide-react';

/**
 * Trust — evidence-grid, not marketing slogans.
 *
 * Per master prompt: each item must read as a proof container, not a promise.
 * Item = icon | title | evidence line (what is produced, when, by whom).
 */
export default function TrustSection() {
  const t = useTranslations('trust');

  const items = [
    { icon: ShieldCheck, key: 'verified' },
    { icon: Stamp, key: 'vetPassport' },
    { icon: Hash, key: 'animalId' },
    { icon: FileText, key: 'legal' },
    { icon: Banknote, key: 'payoutHistory' },
    { icon: Activity, key: 'updates' },
    { icon: BookOpen, key: 'docViewer' },
    { icon: LifeBuoy, key: 'support' },
  ] as const;

  return (
    <section
      id="trust"
      className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden"
    >
      {/* Sheep flock photo as very dark background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/sheep-flock.jpg"
          alt=""
          aria-hidden
          className="w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.18) saturate(0.82) contrast(1.02)' }}
        />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, var(--bg-950) 0%, transparent 15%, transparent 85%, var(--bg-950) 100%)',
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{ background: 'radial-gradient(1000px 620px at 85% 10%, rgba(255,255,255,0.03), transparent 62%)' }} />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12 lg:mb-14">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary mb-3">
            {t('badge')}
          </div>
          <h2 className="text-[32px] md:text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-text-primary">
            {t('title')}
          </h2>
          <p className="mt-3 text-[15px] md:text-[16px] text-text-secondary leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(({ icon: Icon, key }) => (
            <li
              key={key}
              className="surface-card rounded-[16px] p-5 flex flex-col h-full transition-colors hover:border-border-600"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-[9px] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-brand" strokeWidth={1.75} />
                </div>
                <h3 className="text-[14px] font-semibold text-text-primary leading-snug pt-1">
                  {t(`items.${key}.title`)}
                </h3>
              </div>
              <p className="text-[12.5px] text-text-secondary leading-[1.55] mb-3">
                {t(`items.${key}.description`)}
              </p>
              <div className="mt-auto pt-3 border-t border-border-700">
                <div className="flex items-start gap-2 text-[11px] text-text-tertiary leading-[1.5] font-mono tabular">
                  <span className="w-1 h-1 rounded-full bg-brand mt-1.5 shrink-0" />
                  <span>{t(`items.${key}.evidence`)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Closure strip */}
        <div className="mt-10 surface-elevated rounded-[14px] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand mt-0.5 shrink-0" />
            <p className="text-[13px] text-text-secondary leading-relaxed max-w-3xl">
              {t('closureNote')}
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 text-[13px] font-medium text-brand hover:text-brand-hover transition-colors whitespace-nowrap"
          >
            {t('closureLink')} →
          </a>
        </div>
      </div>
    </section>
  );
}
