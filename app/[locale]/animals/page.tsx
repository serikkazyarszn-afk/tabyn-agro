'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import AnimalCard from '@/components/animals/animal-card';
import { AnimalType, AnimalStatus } from '@/lib/types';
import { use } from 'react';
import { Filter } from 'lucide-react';

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

  const filtered = DEMO_ANIMALS.filter((a) => {
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-2 text-muted">
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filter:</span>
        </div>

        {/* Type filter */}
        <div className="flex items-center gap-2">
          {ANIMAL_TYPES.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => setTypeFilter(value)}
              className={`text-sm px-4 py-2 rounded-full border transition-all ${
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
        <div className="flex items-center gap-2">
          {STATUSES.map(({ value, labelKey }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`text-sm px-4 py-2 rounded-full border transition-all ${
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
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">{t('noResults')}</div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
