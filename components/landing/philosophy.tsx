'use client';

import { useTranslations } from 'next-intl';
import { Leaf, Compass, HandHeart, ShieldCheck, Feather } from 'lucide-react';
import { clsx } from 'clsx';

/**
 * Philosophy — Tabyn brandbook on the landing page.
 *
 * This is the human layer of the product. It uses real photography
 * of working farms, livestock and pasture, and lays out the brand
 * principles that sit beneath every feature.
 *
 * Structure:
 *   1. Manifesto block — two-column with a single cinematic image.
 *   2. Four principles — icon + title + body, each paired with a
 *      small documentary photo.
 *   3. Origin / region strip — who we are, where we work.
 */
export default function Philosophy() {
  const t = useTranslations('philosophy');

  return (
    <section className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden" style={{ background: 'linear-gradient(180deg, var(--bg-950) 0%, #0B1210 38%, #0A100F 62%, var(--bg-950) 100%)' }}>
      {/* Ambient glow — gold top-right so the secondary brand colour reads */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(900px 500px at 85% -5%, rgba(224, 176, 96, 0.14), transparent 60%), radial-gradient(1100px 600px at 5% 20%, rgba(255,255,255,0.035), transparent 60%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20 lg:mb-28 items-center">
          {/* Image */}
          <div className="lg:col-span-6 lg:order-2">
            <figure className="relative rounded-[22px] overflow-hidden aspect-[4/3] surface-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/farm-tradition.jpg"
                alt={t('manifesto.imageAlt')}
                className="w-full h-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(8,10,11,0.00) 56%, rgba(8,10,11,0.58) 100%)',
                }}
              />
              <figcaption className="absolute bottom-4 left-5 right-5 text-[11px] font-mono tracking-[0.08em] text-text-secondary">
                {t('manifesto.imageCaption')}
              </figcaption>
            </figure>
          </div>

          {/* Copy */}
          <div className="lg:col-span-6 lg:order-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary mb-3">
              {t('manifesto.badge')}
            </div>
            <h2 className="text-[32px] md:text-[44px] leading-[1.08] font-semibold tracking-[-0.02em] text-text-primary">
              {t('manifesto.titleLead')}{' '}
              <span className="text-brand-secondary">
                {t('manifesto.titleAccent')}
              </span>
            </h2>
            <div className="mt-5 space-y-4 text-[15px] md:text-[16px] leading-[1.7] text-text-secondary max-w-[560px]">
              <p>{t('manifesto.p1')}</p>
              <p>{t('manifesto.p2')}</p>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <span className="w-12 h-px bg-brand-secondary" />
              <p className="text-[13px] text-text-tertiary italic">
                {t('manifesto.signature')}
              </p>
            </div>
          </div>
        </div>

        {/* Principles header */}
        <div className="max-w-2xl mb-10 lg:mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-secondary mb-3">
            {t('principles.badge')}
          </div>
          <h3 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.15]">
            {t('principles.title')}
          </h3>
          <p className="mt-3 text-[15px] text-text-secondary leading-relaxed">
            {t('principles.subtitle')}
          </p>
        </div>

        {/* Principles grid — each paired with a photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Principle
            icon={HandHeart}
            tone="gold"
            image="/brand/principle-stewardship.jpg"
            imageAlt={t('principles.items.stewardship.imageAlt')}
            titleKey="principles.items.stewardship.title"
            bodyKey="principles.items.stewardship.body"
          />
          <Principle
            icon={ShieldCheck}
            tone="brand"
            image="/brand/principle-proof.jpg"
            imageAlt={t('principles.items.proof.imageAlt')}
            titleKey="principles.items.proof.title"
            bodyKey="principles.items.proof.body"
          />
          <Principle
            icon={Compass}
            tone="brand"
            image="/brand/principle-local.jpg"
            imageAlt={t('principles.items.local.imageAlt')}
            titleKey="principles.items.local.title"
            bodyKey="principles.items.local.body"
          />
          <Principle
            icon={Leaf}
            tone="gold"
            image="/brand/principle-longterm.avif"
            imageAlt={t('principles.items.longTerm.imageAlt')}
            titleKey="principles.items.longTerm.title"
            bodyKey="principles.items.longTerm.body"
          />
        </div>

        {/* Origin strip */}
        <div className="mt-14 lg:mt-16 surface-elevated rounded-[18px] p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5 md:gap-8">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-[12px] bg-brand-secondary/15 border border-brand-secondary/30 flex items-center justify-center">
              <Feather className="w-5 h-5 text-brand-secondary" />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {t('origin.label')}
              </div>
              <div className="text-[14px] font-semibold text-text-primary mt-0.5">
                {t('origin.name')}
              </div>
            </div>
          </div>
          <p className="text-[13.5px] text-text-secondary leading-[1.65] flex-1">
            {t('origin.body')}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */

function Principle({
  icon: Icon,
  tone,
  image,
  imageAlt,
  titleKey,
  bodyKey,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'brand' | 'gold';
  image: string;
  imageAlt: string;
  titleKey: string;
  bodyKey: string;
}) {
  const t = useTranslations('philosophy');
  const iconWrap =
    tone === 'brand'
      ? 'bg-brand/15 border-brand/30 text-brand-leaf'
      : 'bg-brand-secondary/15 border-brand-secondary/30 text-brand-secondary';

  return (
    <article className="surface-card rounded-[20px] overflow-hidden flex flex-col md:flex-row transition-colors hover:border-border-600">
      {/* Photo */}
      <div className="relative md:w-[42%] md:shrink-0 aspect-[4/3] md:aspect-auto md:min-h-[230px] overflow-hidden bg-surface-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={imageAlt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, rgba(8,10,11,0) 68%, rgba(8,10,11,0.36) 100%)',
          }}
        />
      </div>

      {/* Copy */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div
          className={clsx(
            'w-10 h-10 rounded-[10px] border flex items-center justify-center mb-4',
            iconWrap,
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </div>
        <h4 className="text-[16px] md:text-[17px] font-semibold text-text-primary leading-snug">
          {t(titleKey)}
        </h4>
        <p className="mt-2 text-[13.5px] md:text-[14px] leading-[1.6] text-text-secondary">
          {t(bodyKey)}
        </p>
      </div>
    </article>
  );
}
