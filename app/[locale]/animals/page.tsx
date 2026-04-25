'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import AnimalCard from '@/components/animals/animal-card';
import { Animal, AnimalType, AnimalStatus } from '@/lib/types';
import { use } from 'react';
import { Filter } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const supabase = createClient();
const PAGE_SIZE = 12;

const ANIMAL_TYPES: Array<{ value: AnimalType | 'all'; labelKey: string }> = [
  { value: 'all', labelKey: 'filter.all' },
  { value: 'cow', labelKey: 'filter.cow' },
  { value: 'sheep', labelKey: 'filter.sheep' },
  { value: 'horse', labelKey: 'filter.horse' },
  { value: 'goat', labelKey: 'filter.goat' },
  { value: 'camel', labelKey: 'filter.camel' },
];

const STATUSES: Array<{ value: AnimalStatus | 'all'; labelKey: string }> = [
  { value: 'all', labelKey: 'filter.status' },
  { value: 'available', labelKey: 'filter.available' },
  { value: 'growing', labelKey: 'filter.growing' },
];

export default function AnimalsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('animals');
  const [typeFilter, setTypeFilter] = useState<AnimalType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => { document.title = 'Browse Animals — Tabyn'; }, []);

  useEffect(() => {
    (async () => {
      setLoadingAnimals(true);
      let query = supabase
        .from('animals')
        .select('*, farmer:farmers(id, farm_name, location, description, verified, user_id)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      if (typeFilter !== 'all') query = query.eq('type', typeFilter);
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);

      const { data, count } = await query;
      setAnimals((data as Animal[]) ?? []);
      setTotalCount(count ?? 0);
      setLoadingAnimals(false);
    })();
  }, [typeFilter, statusFilter, page]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-2 text-muted">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>

        {/* Type filter */}
        <div className="flex flex-wrap items-center gap-2">
          {ANIMAL_TYPES.map(({ value, labelKey }) => (
            <button
              type="button"
              key={value}
              onClick={() => { setTypeFilter(value); setPage(1); }}
              className={`cursor-pointer text-sm px-4 py-2 rounded-full border transition-all ${
                typeFilter === value
                  ? 'bg-accent text-black border-accent font-semibold'
                  : 'border-border text-muted hover:border-muted-2 hover:text-foreground'
              }`}
            >
              {t(labelKey as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-border" />

        {/* Status filter */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map(({ value, labelKey }) => (
            <button
              type="button"
              key={value}
              onClick={() => { setStatusFilter(value); setPage(1); }}
              className={`cursor-pointer text-sm px-4 py-2 rounded-full border transition-all ${
                statusFilter === value
                  ? 'bg-accent text-black border-accent font-semibold'
                  : 'border-border text-muted hover:border-muted-2 hover:text-foreground'
              }`}
            >
              {t(labelKey as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loadingAnimals ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : animals.length === 0 ? (
        <div className="text-center py-20 text-muted">{t('noResults')}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      )}

      {/* Farmer CTA */}
      <div className="mt-16 rounded-2xl bg-surface border border-border p-8 text-center">
        <h3 className="text-xl font-bold mb-2">{t('farmerCta.title')}</h3>
        <p className="text-muted text-sm mb-5">{t('farmerCta.subtitle')}</p>
        <Link
          href={`/${locale}/signup`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black text-sm font-semibold rounded-xl hover:bg-accent-dim transition-colors"
        >
          {t('farmerCta.button')}
        </Link>
      </div>

      {/* Pagination */}
      {totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer text-sm px-4 py-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-muted-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="cursor-pointer text-sm px-4 py-2 rounded-xl border border-border text-muted hover:text-foreground hover:border-muted-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
