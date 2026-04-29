'use client';

import { useMemo, useState, useEffect, use } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import AnimalCard from '@/components/animals/animal-card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Badge from '@/components/ui/badge';
import { createClient } from '@/lib/supabase';
import { AnimalType, AnimalStatus, Animal } from '@/lib/types';
import {
  Search,
  SlidersHorizontal,
  X,
  LayoutGrid,
  Rows3,
  ArrowUpDown,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { clsx } from 'clsx';

type SortKey = 'featured' | 'return_desc' | 'return_asc' | 'price_asc' | 'price_desc' | 'term_asc';
type Density = 'comfortable' | 'compact';
type RiskLevel = 'all' | 'low' | 'medium' | 'high';

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

/**
 * Classify risk from the expected return band.
 * Higher implied yield → higher risk signal on the product surface.
 */
function riskOf(animal: Animal): Exclude<RiskLevel, 'all'> {
  if (animal.expected_return_pct >= 22) return 'high';
  if (animal.expected_return_pct >= 16) return 'medium';
  return 'low';
}

export default function AnimalsCatalogClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('animals');
  const tCat = useTranslations('catalog');

  const [typeFilter, setTypeFilter] = useState<AnimalType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AnimalStatus | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<RiskLevel>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('featured');
  const [density, setDensity] = useState<Density>('comfortable');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setIsLoggedIn(true);
        supabase.from('profiles').select('role').eq('id', user.id).single()
          .then(({ data }) => setUserRole(data?.role ?? null));
      }
    });
  }, []);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  // Unique regions from data — no hardcoding
  const regions = useMemo(() => {
    const set = new Set<string>();
    DEMO_ANIMALS.forEach((a) => a.farmer?.location && set.add(a.farmer.location));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = DEMO_ANIMALS.filter((a) => {
      if (typeFilter !== 'all' && a.type !== typeFilter) return false;
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (riskFilter !== 'all' && riskOf(a) !== riskFilter) return false;
      if (regionFilter !== 'all' && a.farmer?.location !== regionFilter) return false;
      if (q) {
        const hay = [
          a.name,
          a.breed,
          a.type,
          a.farmer?.farm_name,
          a.farmer?.location,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case 'return_desc':
        return [...list].sort((a, b) => b.expected_return_pct - a.expected_return_pct);
      case 'return_asc':
        return [...list].sort((a, b) => a.expected_return_pct - b.expected_return_pct);
      case 'price_asc':
        return [...list].sort((a, b) => a.price - b.price);
      case 'price_desc':
        return [...list].sort((a, b) => b.price - a.price);
      case 'term_asc':
        return [...list].sort((a, b) => a.duration_months - b.duration_months);
      default:
        // featured — verified first, then by funding velocity
        return [...list].sort((a, b) => {
          const av = a.farmer?.verified ? 1 : 0;
          const bv = b.farmer?.verified ? 1 : 0;
          if (av !== bv) return bv - av;
          const af = a.slots_filled / a.slots_total;
          const bf = b.slots_filled / b.slots_total;
          return bf - af;
        });
    }
  }, [typeFilter, statusFilter, riskFilter, regionFilter, search, sort]);

  const activeFilterCount =
    (typeFilter !== 'all' ? 1 : 0) +
    (statusFilter !== 'all' ? 1 : 0) +
    (riskFilter !== 'all' ? 1 : 0) +
    (regionFilter !== 'all' ? 1 : 0);

  const clearAll = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setRiskFilter('all');
    setRegionFilter('all');
    setSearch('');
    setSort('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-2">
              {tCat('badge')}
            </div>
            <h1 className="text-[30px] md:text-[40px] leading-[1.1] font-semibold tracking-[-0.02em] text-text-primary">
              {t('title')}
            </h1>
            <p className="mt-2 text-[15px] text-text-secondary max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          {/* Summary chip — catalog state at a glance */}
          <div className="flex items-center gap-3 text-[12px] text-text-tertiary shrink-0">
            <span className="tabular">
              {filtered.length} / {DEMO_ANIMALS.length} {tCat('shown')}
            </span>
          </div>
        </div>
      </header>

      {/* Sticky filter bar — desktop */}
      <div
        className={clsx(
          'sticky top-16 z-30 -mx-4 md:mx-0 mb-6',
          'backdrop-blur-[12px] bg-bg-950/80 border-y md:border border-border-700 md:rounded-[14px]',
          'px-4 md:px-4 py-3',
        )}
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-0 max-w-md">
            <div className="flex items-center h-10 bg-surface-900 border border-border-700 rounded-[10px] focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
              <span className="pl-3 pr-2 text-text-tertiary">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={tCat('searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent h-full text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none pr-3"
                aria-label={tCat('searchPlaceholder')}
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear"
                  className="pr-3 text-text-tertiary hover:text-text-primary"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sort — desktop select, mobile icon+drawer */}
          <div className="hidden md:flex items-center">
            <label className="sr-only" htmlFor="sort">
              {tCat('sortLabel')}
            </label>
            <div className="inline-flex items-center h-10 bg-surface-900 border border-border-700 rounded-[10px] pr-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-text-tertiary ml-3" />
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-full bg-transparent pl-2 pr-2 text-[13px] text-text-primary focus:outline-none appearance-none"
              >
                <option value="featured">{tCat('sort.featured')}</option>
                <option value="return_desc">{tCat('sort.returnDesc')}</option>
                <option value="return_asc">{tCat('sort.returnAsc')}</option>
                <option value="price_asc">{tCat('sort.priceAsc')}</option>
                <option value="price_desc">{tCat('sort.priceDesc')}</option>
                <option value="term_asc">{tCat('sort.termAsc')}</option>
              </select>
            </div>
          </div>

          {/* Density toggle — desktop only */}
          <div className="hidden lg:flex items-center bg-surface-900 border border-border-700 rounded-[10px] p-0.5">
            <button
              onClick={() => setDensity('comfortable')}
              aria-pressed={density === 'comfortable'}
              aria-label={tCat('densityComfortable')}
              className={clsx(
                'h-9 w-9 flex items-center justify-center rounded-[8px] transition-colors',
                density === 'comfortable'
                  ? 'bg-brand text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDensity('compact')}
              aria-pressed={density === 'compact'}
              aria-label={tCat('densityCompact')}
              className={clsx(
                'h-9 w-9 flex items-center justify-center rounded-[8px] transition-colors',
                density === 'compact'
                  ? 'bg-brand text-text-primary'
                  : 'text-text-tertiary hover:text-text-primary',
              )}
            >
              <Rows3 className="w-4 h-4" />
            </button>
          </div>

          {/* Filters button — opens drawer on mobile, surfaces count on desktop */}
          <Button
            variant="tertiary"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="shrink-0 lg:!hidden"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {tCat('filters')}
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold bg-brand text-text-primary rounded-full tabular">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Desktop filter chips — species + status + risk + region */}
        <div className="hidden lg:flex items-center gap-2 mt-3 flex-wrap">
          <FilterGroup label={tCat('species')}>
            {ANIMAL_TYPES.map(({ value, labelKey }) => (
              <Chip
                key={value}
                active={typeFilter === value}
                onClick={() => setTypeFilter(value)}
              >
                {t(labelKey as Parameters<typeof t>[0])}
              </Chip>
            ))}
          </FilterGroup>
          <Divider />
          <FilterGroup label={tCat('status')}>
            {STATUSES.map(({ value, labelKey }) => (
              <Chip
                key={value}
                active={statusFilter === value}
                onClick={() => setStatusFilter(value)}
              >
                {t(labelKey as Parameters<typeof t>[0])}
              </Chip>
            ))}
          </FilterGroup>
          <Divider />
          <FilterGroup label={tCat('risk')}>
            {(['all', 'low', 'medium', 'high'] as const).map((r) => (
              <Chip
                key={r}
                active={riskFilter === r}
                tone={
                  r === 'low'
                    ? 'positive'
                    : r === 'medium'
                      ? 'warning'
                      : r === 'high'
                        ? 'destructive'
                        : 'default'
                }
                onClick={() => setRiskFilter(r)}
              >
                {tCat(`riskLevels.${r}`)}
              </Chip>
            ))}
          </FilterGroup>
          {regions.length > 1 && (
            <>
              <Divider />
              <FilterGroup label={tCat('region')}>
                <Chip
                  active={regionFilter === 'all'}
                  onClick={() => setRegionFilter('all')}
                >
                  {tCat('allRegions')}
                </Chip>
                {regions.map((r) => (
                  <Chip
                    key={r}
                    active={regionFilter === r}
                    onClick={() => setRegionFilter(r)}
                  >
                    <MapPin className="w-3 h-3" />
                    {r}
                  </Chip>
                ))}
              </FilterGroup>
            </>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="ml-2 text-[12px] text-text-tertiary hover:text-text-primary underline underline-offset-2"
            >
              {tCat('clear')}
            </button>
          )}
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex items-center gap-2 text-[12px] text-text-tertiary mb-6">
        <ShieldCheck className="w-3.5 h-3.5 text-brand shrink-0" />
        <span className="leading-relaxed">{tCat('trustNote')}</span>
      </div>

      {/* Grid / List */}
      {filtered.length === 0 ? (
        <EmptyState onReset={clearAll} />
      ) : density === 'comfortable' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filtered.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} locale={locale} />
          ))}
        </div>
      )}

      {/* Farmer CTA — hidden for logged-in investors */}
      {userRole !== 'investor' && <div className="mt-16 rounded-[18px] bg-surface-1 border border-border-subtle p-8 text-center">
        <h3 className="text-[18px] font-semibold mb-2">{t('farmerCta.title')}</h3>
        <p className="text-text-secondary text-[14px] mb-5">{t('farmerCta.subtitle')}</p>
        <Link
          href={isLoggedIn ? `/${locale}/farmer/animals/new` : `/${locale}/signup`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-text-primary text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          {isLoggedIn ? t('farmerCta.buttonFarmer') : t('farmerCta.button')}
        </Link>
      </div>}

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <FilterDrawer
          onClose={() => setDrawerOpen(false)}
          state={{
            typeFilter,
            setTypeFilter,
            statusFilter,
            setStatusFilter,
            riskFilter,
            setRiskFilter,
            regionFilter,
            setRegionFilter,
            sort,
            setSort,
            regions,
          }}
          clearAll={clearAll}
          filteredCount={filtered.length}
        />
      )}
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary mr-1">
        {label}
      </span>
      <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="h-5 w-px bg-border-700" />;
}

function Chip({
  active,
  onClick,
  children,
  tone = 'default',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tone?: 'default' | 'positive' | 'warning' | 'destructive';
}) {
  const palette = {
    default: active
      ? 'bg-brand text-text-primary border-brand'
      : 'bg-surface-900 text-text-secondary border-border-700 hover:border-border-600',
    positive: active
      ? 'bg-positive text-bg-950 border-positive'
      : 'bg-surface-900 text-text-secondary border-border-700 hover:border-positive/50',
    warning: active
      ? 'bg-warning text-bg-950 border-warning'
      : 'bg-surface-900 text-text-secondary border-border-700 hover:border-warning/50',
    destructive: active
      ? 'bg-destructive text-bg-950 border-destructive'
      : 'bg-surface-900 text-text-secondary border-border-700 hover:border-destructive/50',
  }[tone];

  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium rounded-full border transition-colors',
        palette,
      )}
    >
      {children}
    </button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const t = useTranslations('animals');
  const tCat = useTranslations('catalog');
  return (
    <div className="surface-card rounded-[18px] py-16 px-6 text-center">
      <div className="w-12 h-12 mx-auto rounded-full bg-surface-800 border border-border-700 flex items-center justify-center mb-4">
        <Search className="w-5 h-5 text-text-tertiary" />
      </div>
      <h3 className="text-[16px] font-semibold text-text-primary mb-1">
        {t('noResults')}
      </h3>
      <p className="text-[13px] text-text-secondary mb-5 max-w-sm mx-auto">
        {tCat('emptyHint')}
      </p>
      <Button variant="secondary" size="md" onClick={onReset}>
        {tCat('clear')}
      </Button>
    </div>
  );
}

interface FilterDrawerState {
  typeFilter: AnimalType | 'all';
  setTypeFilter: (v: AnimalType | 'all') => void;
  statusFilter: AnimalStatus | 'all';
  setStatusFilter: (v: AnimalStatus | 'all') => void;
  riskFilter: RiskLevel;
  setRiskFilter: (v: RiskLevel) => void;
  regionFilter: string;
  setRegionFilter: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
  regions: string[];
}

function FilterDrawer({
  onClose,
  state,
  clearAll,
  filteredCount,
}: {
  onClose: () => void;
  state: FilterDrawerState;
  clearAll: () => void;
  filteredCount: number;
}) {
  const t = useTranslations('animals');
  const tCat = useTranslations('catalog');

  return (
    <>
      <button
        aria-label="Close filters"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-bg-950/70 backdrop-blur-[3px] lg:hidden"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-surface-900 border-t border-border-700 rounded-t-[20px] max-h-[92vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-700">
          <h2 className="text-[15px] font-semibold text-text-primary">
            {tCat('filters')}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 inline-flex items-center justify-center rounded-[8px] text-text-secondary hover:bg-surface-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          <DrawerSection title={tCat('sortLabel')}>
            <select
              value={state.sort}
              onChange={(e) => state.setSort(e.target.value as SortKey)}
              className="w-full h-12 bg-surface-800 border border-border-700 rounded-[10px] px-3 text-[14px] text-text-primary"
            >
              <option value="featured">{tCat('sort.featured')}</option>
              <option value="return_desc">{tCat('sort.returnDesc')}</option>
              <option value="return_asc">{tCat('sort.returnAsc')}</option>
              <option value="price_asc">{tCat('sort.priceAsc')}</option>
              <option value="price_desc">{tCat('sort.priceDesc')}</option>
              <option value="term_asc">{tCat('sort.termAsc')}</option>
            </select>
          </DrawerSection>

          <DrawerSection title={tCat('species')}>
            <div className="flex flex-wrap gap-2">
              {ANIMAL_TYPES.map(({ value, labelKey }) => (
                <Chip
                  key={value}
                  active={state.typeFilter === value}
                  onClick={() => state.setTypeFilter(value)}
                >
                  {t(labelKey as Parameters<typeof t>[0])}
                </Chip>
              ))}
            </div>
          </DrawerSection>

          <DrawerSection title={tCat('status')}>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map(({ value, labelKey }) => (
                <Chip
                  key={value}
                  active={state.statusFilter === value}
                  onClick={() => state.setStatusFilter(value)}
                >
                  {t(labelKey as Parameters<typeof t>[0])}
                </Chip>
              ))}
            </div>
          </DrawerSection>

          <DrawerSection title={tCat('risk')}>
            <div className="flex flex-wrap gap-2">
              {(['all', 'low', 'medium', 'high'] as const).map((r) => (
                <Chip
                  key={r}
                  active={state.riskFilter === r}
                  tone={
                    r === 'low'
                      ? 'positive'
                      : r === 'medium'
                        ? 'warning'
                        : r === 'high'
                          ? 'destructive'
                          : 'default'
                  }
                  onClick={() => state.setRiskFilter(r)}
                >
                  {tCat(`riskLevels.${r}`)}
                </Chip>
              ))}
            </div>
          </DrawerSection>

          {state.regions.length > 1 && (
            <DrawerSection title={tCat('region')}>
              <div className="flex flex-wrap gap-2">
                <Chip
                  active={state.regionFilter === 'all'}
                  onClick={() => state.setRegionFilter('all')}
                >
                  {tCat('allRegions')}
                </Chip>
                {state.regions.map((r) => (
                  <Chip
                    key={r}
                    active={state.regionFilter === r}
                    onClick={() => state.setRegionFilter(r)}
                  >
                    <MapPin className="w-3 h-3" />
                    {r}
                  </Chip>
                ))}
              </div>
            </DrawerSection>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border-700 flex items-center gap-3">
          <Button variant="ghost" size="md" onClick={clearAll} className="shrink-0">
            {tCat('clear')}
          </Button>
          <Button variant="primary" size="md" onClick={onClose} fullWidth>
            {tCat('showN', {} as never) /* fallback below */}
            <Badge variant="outline" size="sm">
              <span className="tabular">{filteredCount}</span>
            </Badge>
          </Button>
        </div>
      </div>
    </>
  );
}

function DrawerSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}
