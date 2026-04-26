import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import AnimalCard from '@/components/animals/animal-card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedAnimalsProps {
  locale: string;
}

/**
 * Featured Animals — curated entry point into the catalog.
 *
 * Per master prompt: this section should lead users INTO the catalog,
 * not merely demonstrate cards. It shows:
 *   1. A rationale strip ("why these are recommended"),
 *   2. A compact filter/segment rail,
 *   3. Three cards as a teaser, with a strong "View all" CTA.
 */
export default function FeaturedAnimals({ locale }: FeaturedAnimalsProps) {
  const t = useTranslations('featuredAnimals');
  // Select the most-fundable available animals
  const featured = DEMO_ANIMALS.filter((a) => a.status === 'available').slice(0, 3);

  return (
    <section
      id="catalog-teaser"
      className="relative py-20 lg:py-28 border-t border-border-700 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(1000px 500px at 50% 0%, rgba(13,90,72,0.14), transparent 60%)',
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6">
          <div className="max-w-2xl">
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

          <Link href={`/${locale}/animals`} className="shrink-0">
            <Button variant="tertiary" size="md" className="group">
              {t('viewAll')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Rationale strip — why these */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <Badge variant="gold" size="md">
            <Sparkles className="w-3 h-3" />
            {t('rationale')}
          </Badge>
          <span className="text-[12px] text-text-tertiary">
            {t('rationaleDetail')}
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
