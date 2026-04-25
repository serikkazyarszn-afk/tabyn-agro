import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import AnimalCard from '@/components/animals/animal-card';
import Button from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import { Animal } from '@/lib/types';

interface FeaturedAnimalsProps {
  locale: string;
}

export default async function FeaturedAnimals({ locale }: FeaturedAnimalsProps) {
  const [t, supabase] = await Promise.all([
    getTranslations('featuredAnimals'),
    createClient(),
  ]);
  const { data } = await supabase
    .from('animals')
    .select('*, farmer:farmers(id, farm_name, location, description, verified, user_id)')
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(3);
  const featured = (data as Animal[]) ?? [];

  if (featured.length === 0) return null;

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
