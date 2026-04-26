import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@/components/ui/button';
import { ArrowRight, Camera, ShieldCheck, Sprout } from 'lucide-react';

interface FieldGalleryProps {
  locale: string;
}

const GALLERY_ITEMS = [
  {
    image: '/brand/gallery/cows-pasture.jpg',
    icon: Camera,
    titleKey: 'items.landscape.title',
    bodyKey: 'items.landscape.body',
    className: 'lg:col-span-7',
  },
  {
    image: '/brand/gallery/cows-feeding.webp',
    icon: ShieldCheck,
    titleKey: 'items.farm.title',
    bodyKey: 'items.farm.body',
    className: 'lg:col-span-5',
  },
  {
    image: '/brand/gallery/horses-halter.jpg',
    icon: Sprout,
    titleKey: 'items.pasture.title',
    bodyKey: 'items.pasture.body',
    className: 'lg:col-span-4',
  },
  {
    image: '/brand/gallery/farmer-working.webp',
    icon: Camera,
    titleKey: 'items.herd.title',
    bodyKey: 'items.herd.body',
    className: 'lg:col-span-4',
  },
  {
    image: '/brand/gallery/lamb-portrait.avif',
    icon: ShieldCheck,
    titleKey: 'items.trust.title',
    bodyKey: 'items.trust.body',
    className: 'lg:col-span-4',
  },
] as const;

export default function FieldGallery({ locale }: FieldGalleryProps) {
  const t = useTranslations('gallery');

  return (
    <section className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1000px 600px at 50% 0%, rgba(255,255,255,0.02), transparent 65%), linear-gradient(180deg, var(--bg-950) 0%, #09110E 50%, var(--bg-950) 100%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-10 lg:mb-12">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {GALLERY_ITEMS.map(({ image, icon: Icon, titleKey, bodyKey, className }, index) => (
            <article
              key={titleKey}
              className={`group relative overflow-hidden rounded-[22px] border border-border-700 bg-surface-900 min-h-[260px] ${className}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={t(titleKey)}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ filter: 'brightness(0.90) saturate(0.92) contrast(1.04)' }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    index === 0
                      ? 'linear-gradient(180deg, rgba(7,10,10,0.08) 0%, rgba(7,10,10,0.18) 40%, rgba(7,10,10,0.72) 100%)'
                      : 'linear-gradient(180deg, rgba(7,10,10,0.06) 0%, rgba(7,10,10,0.16) 42%, rgba(7,10,10,0.78) 100%)',
                }}
              />
              <div className="relative h-full flex flex-col justify-end p-5 md:p-6">
                <div className="w-10 h-10 rounded-[10px] bg-black/35 border border-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                  <Icon className="w-[18px] h-[18px] text-white" strokeWidth={1.75} />
                </div>
                <h3 className="text-[18px] md:text-[20px] font-semibold text-white leading-snug">
                  {t(titleKey)}
                </h3>
                <p className="mt-2 text-[13px] md:text-[14px] text-white/78 leading-[1.6] max-w-[48ch]">
                  {t(bodyKey)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Link href={`/${locale}/animals`}>
            <Button variant="secondary" size="md" className="group">
              {t('cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
