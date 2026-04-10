import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Animal } from '@/lib/types';
import Badge from '@/components/ui/badge';
import { MapPin, Clock, TrendingUp, Users } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
  locale: string;
}

const STATUS_VARIANTS = {
  available: 'accent',
  growing: 'warning',
  ready: 'success',
  sold: 'muted',
} as const;

const ANIMAL_EMOJIS: Record<string, string> = {
  cow: '🐄',
  sheep: '🐑',
  horse: '🐴',
  goat: '🐐',
  camel: '🐪',
};

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

  return (
    <Link href={`/${locale}/animals/${animal.id}`}>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {animal.image_url ? (
            <img
              src={animal.image_url}
              alt={animal.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-surface-hover flex items-center justify-center text-5xl">
              {ANIMAL_EMOJIS[animal.type] || '🐾'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge variant={STATUS_VARIANTS[animal.status]}>
              {statusLabels[animal.status]}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className="text-2xl">{ANIMAL_EMOJIS[animal.type]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-base mb-0.5">{animal.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted">
                <MapPin className="w-3 h-3" />
                <span>{animal.farmer?.location || '—'}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accent">
                ₸{animal.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted">{t('perSlot')}</div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-xs text-muted">{t('expectedReturn')}</span>
              </div>
              <span className="font-bold text-sm text-accent">+{animal.expected_return_pct}%</span>
            </div>
            <div className="bg-background rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Clock className="w-3 h-3 text-muted" />
                <span className="text-xs text-muted">{t('duration')}</span>
              </div>
              <span className="font-bold text-sm">{animal.duration_months} {t('months')}</span>
            </div>
          </div>

          {/* Slots progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Users className="w-3 h-3" />
                <span>{animal.slots_filled}/{animal.slots_total} {t('slotsFilled')}</span>
              </div>
              <span className="text-xs text-muted">{fillPct}%</span>
            </div>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
