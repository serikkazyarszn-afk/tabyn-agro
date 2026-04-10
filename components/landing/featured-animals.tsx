import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import AnimalCard from '@/components/animals/animal-card';
import Button from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface FeaturedAnimalsProps {
  locale: string;
}

export default function FeaturedAnimals({ locale }: FeaturedAnimalsProps) {
  const t = useTranslations('featuredAnimals');
  const featured = DEMO_ANIMALS.filter((a) => a.status === 'available').slice(0, 3);

  return (
    <section className="py-24 bg-surface/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-3">
              {t('badge')}
            </span>
            <h2 className="text-4xl font-bold">{t('title')}</h2>
            <p className="text-muted mt-2">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/animals`}>
            <Button variant="secondary" size="md" className="group">
              {t('viewAll')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {featured.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
