import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Animal } from '@/lib/types';
import Badge from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, ShieldCheck, Hash } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  locale: string;
}

const STATUS_VARIANTS = {
  available: 'brand',
  growing: 'warning',
  ready: 'positive',
  sold: 'neutral',
} as const;

const TYPE_LABELS: Record<string, { ru: string; kk: string; en: string }> = {
  cow: { ru: 'Корова', kk: 'Сиыр', en: 'Cow' },
  sheep: { ru: 'Овца', kk: 'Қой', en: 'Sheep' },
  horse: { ru: 'Лошадь', kk: 'Жылқы', en: 'Horse' },
  goat: { ru: 'Коза', kk: 'Ешкі', en: 'Goat' },
  camel: { ru: 'Верблюд', kk: 'Түйе', en: 'Camel' },
};

/**
 * Asset card — acts as a compact passport for a livestock investment lot.
 *
 * Per master prompt: no emoji in product layer. Photo occupies 16:10.
 * Visible proof: verified farmer dot, asset ID, region, funding progress,
 * return band, duration, doc count.
 */
export default function AnimalCard({ animal, locale }: AnimalCardProps) {
  const t = useTranslations('featuredAnimals');
  const slotsRemaining = animal.slots_total - animal.slots_filled;
  const fillPct = Math.round((animal.slots_filled / animal.slots_total) * 100);

  const statusLabels = {
    available: t('available'),
    growing: t('growing'),
    ready: t('ready'),
    sold: t('sold'),
  };

  const lang = (locale as 'ru' | 'kk' | 'en') in TYPE_LABELS.cow
    ? (locale as 'ru' | 'kk' | 'en')
    : 'en';
  const typeLabel = TYPE_LABELS[animal.type]?.[lang] ?? animal.type;
  const assetId = `${animal.type.toUpperCase().slice(0, 2)}-2026-${String(animal.id).padStart(4, '0')}`;

  return (
    <Link
      href={`/${locale}/animals/${animal.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-950 rounded-[18px]"
    >
      <article className="surface-card rounded-[18px] overflow-hidden transition-[border-color,transform,box-shadow] duration-200 group-hover:border-border-600 group-hover:-translate-y-[2px] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)] h-full flex flex-col">
        {/* Media area — 16:10 aspect */}
        <div className="relative aspect-[16/10] bg-surface-800 overflow-hidden">
          {animal.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={animal.image_url}
              alt={`${typeLabel} — ${animal.name}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <SchematicFallback type={animal.type} />
          )}

          {/* Top-left: asset ID */}
          <div className="absolute top-3 left-3">
            <Badge variant="neutral" size="sm">
              <Hash className="w-3 h-3" />
              {assetId}
            </Badge>
          </div>

          {/* Top-right: status */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={STATUS_VARIANTS[animal.status]}
              size="sm"
              dot
            >
              {statusLabels[animal.status]}
            </Badge>
          </div>

          {/* Bottom-left: verified farm */}
          {animal.farmer?.verified && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="brand" size="sm">
                <ShieldCheck className="w-3 h-3" />
                {t('verifiedShort')}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 md:p-5 flex flex-col gap-4 flex-1">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-text-primary leading-snug truncate">
                {animal.name}
              </h3>
              <p className="mt-0.5 text-[12px] text-text-tertiary truncate">
                <span className="text-text-secondary">{typeLabel}</span>
                {animal.breed ? ` · ${animal.breed}` : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[16px] font-semibold text-text-primary tabular leading-none">
                ₸{animal.price.toLocaleString('ru-RU')}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                {t('perSlot')}
              </div>
            </div>
          </div>

          {/* Proof row: region */}
          {animal.farmer?.location && (
            <div className="flex items-center gap-1.5 text-[12px] text-text-secondary">
              <MapPin className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
              <span className="truncate">{animal.farmer.location}</span>
              <span className="text-text-tertiary">·</span>
              <span className="truncate text-text-tertiary">
                {animal.farmer.farm_name}
              </span>
            </div>
          )}

          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-px bg-border-700 rounded-[10px] overflow-hidden border border-border-700 mt-auto">
            <div className="bg-surface-900 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
                <TrendingUp className="w-3 h-3 text-brand-secondary" />
                {t('expectedReturn')}
              </div>
              <div className="mt-0.5 text-[14px] font-semibold text-brand-secondary tabular">
                +{animal.expected_return_pct}%
              </div>
            </div>
            <div className="bg-surface-900 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
                <Clock className="w-3 h-3" />
                {t('duration')}
              </div>
              <div className="mt-0.5 text-[14px] font-semibold text-text-primary tabular">
                {animal.duration_months} {t('months')}
              </div>
            </div>
          </div>

          {/* Funding */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary mb-1.5">
              <span>
                <span className="tabular text-text-secondary">
                  {animal.slots_filled}/{animal.slots_total}
                </span>{' '}
                {t('slotsFilled')}
              </span>
              <span className="tabular">{fillPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden">
              <div
                className="h-full bg-brand-secondary rounded-full transition-[width] duration-500"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

/**
 * SchematicFallback — a brandbook-compliant placeholder shown when
 * animal.image_url is missing. Does NOT try to impersonate real
 * photography; reads as "data card" not "missing asset".
 */
function SchematicFallback({ type }: { type: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 250"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`fb-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#152521" />
          <stop offset="100%" stopColor="#0E1D19" />
        </linearGradient>
        <pattern
          id={`grid-${type}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#294139"
            strokeWidth="0.5"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="400" height="250" fill={`url(#fb-${type})`} />
      <rect width="400" height="250" fill={`url(#grid-${type})`} />
      <line
        x1="0"
        y1="170"
        x2="400"
        y2="170"
        stroke="#4FA26D"
        strokeWidth="1"
        opacity="0.5"
      />
      <text
        x="200"
        y="130"
        textAnchor="middle"
        fontSize="11"
        fill="#8A938D"
        letterSpacing="3"
        style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}
      >
        {type.toUpperCase()}
      </text>
      <g fill="none" stroke="#8A938D" strokeWidth="0.8" opacity="0.6">
        <path d="M12,12 L12,26 M12,12 L26,12" />
        <path d="M388,12 L388,26 M388,12 L374,12" />
        <path d="M12,238 L12,224 M12,238 L26,238" />
        <path d="M388,238 L388,224 M388,238 L374,238" />
      </g>
    </svg>
  );
}
