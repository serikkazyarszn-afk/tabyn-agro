'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Animal, AnimalStatus } from '@/lib/types';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { use } from 'react';
import { Plus, TrendingUp, Users, CheckCircle, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';

const supabase = createClient();

const ANIMAL_EMOJIS: Record<string, string> = {
  cow: '🐄', sheep: '🐑', horse: '🐴', goat: '🐐', camel: '🐪',
};

const STATUS_VARIANTS = {
  available: 'accent',
  growing: 'warning',
  ready: 'success',
  sold: 'muted',
} as const;

const STATUS_ORDER: AnimalStatus[] = ['available', 'growing', 'ready', 'sold'];

export default function FarmerDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('farmer.dashboard');
  const tFeat = useTranslations('featuredAnimals');
  const router = useRouter();

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [farmerId, setFarmerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => { document.title = 'My Farm — Tabyn'; }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push(`/${locale}/login`); return; }

        const { data: farmer } = await supabase
          .from('farmers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!farmer) { router.push(`/${locale}/login`); return; }
        setFarmerId(farmer.id);

        const { data } = await supabase
          .from('animals')
          .select('*')
          .eq('farmer_id', farmer.id)
          .order('created_at', { ascending: false });

        setAnimals((data as Animal[]) ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, [locale, router]);

  const updateStatus = async (id: string, newStatus: AnimalStatus) => {
    if (!farmerId) return;
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('animals')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('farmer_id', farmerId);

      if (error) throw error;

      if (newStatus === 'sold') {
        const animal = animals.find(a => a.id === id);
        if (animal) {
          const { data: activeInvestments } = await supabase
            .from('investments')
            .select('id, amount')
            .eq('animal_id', id)
            .eq('status', 'active');

          if (activeInvestments?.length) {
            await Promise.all(
              activeInvestments.map(inv =>
                supabase.from('investments').update({
                  status: 'completed',
                  actual_return: Math.round(inv.amount * (1 + animal.expected_return_pct / 100)),
                  completed_at: new Date().toISOString(),
                }).eq('id', inv.id)
              )
            );
          }
        }
      }

      setAnimals(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast({ message: `Status updated to "${newStatus}".`, variant: 'success' });
    } catch {
      toast({ message: 'Failed to update status. Try again.', variant: 'error' });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-10 w-40 bg-surface rounded-lg mb-10 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalAnimals = animals.length;
  const fullyFunded = animals.filter((a) => a.slots_filled >= a.slots_total).length;
  const growing = animals.filter((a) => a.status === 'growing').length;
  const sold = animals.filter((a) => a.status === 'sold').length;

  const statusLabels: Record<AnimalStatus, string> = {
    available: tFeat('available'),
    growing: tFeat('growing'),
    ready: tFeat('ready'),
    sold: tFeat('sold'),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
          <p className="text-muted text-sm">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/farmer/animals/new`}>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            {t('addAnimal')}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <Package className="w-4 h-4" />
            {t('totalAnimals')}
          </div>
          <div className="text-2xl font-bold">{totalAnimals}</div>
        </div>
        <div className="bg-surface border border-accent/20 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <Users className="w-4 h-4 text-accent" />
            {t('funded')}
          </div>
          <div className="text-2xl font-bold text-accent">{fullyFunded}</div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <TrendingUp className="w-4 h-4" />
            {t('active')}
          </div>
          <div className="text-2xl font-bold">{growing}</div>
        </div>
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 text-muted text-sm mb-3">
            <CheckCircle className="w-4 h-4" />
            {t('sold')}
          </div>
          <div className="text-2xl font-bold">{sold}</div>
        </div>
      </div>

      {/* Animal list */}
      <div>
        <h2 className="text-xl font-bold mb-5">{t('myAnimals')}</h2>

        {animals.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="mb-4">{t('noAnimals')}</p>
            <Link href={`/${locale}/farmer/animals/new`}>
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                {t('addAnimal')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {animals.map((animal) => {
              const fillPct = Math.round((animal.slots_filled / animal.slots_total) * 100);
              const currentStatusIdx = STATUS_ORDER.indexOf(animal.status);
              const nextStatus = STATUS_ORDER[currentStatusIdx + 1] as AnimalStatus | undefined;

              return (
                <div key={animal.id} className="bg-surface border border-border rounded-2xl p-5 hover:border-muted-2 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    {/* Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      {animal.image_url ? (
                        <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-background flex items-center justify-center text-2xl">
                          {ANIMAL_EMOJIS[animal.type]}
                        </div>
                      )}
                    </div>

                    {/* Name & type */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{animal.name}</span>
                        <Badge variant={STATUS_VARIANTS[animal.status]}>
                          {statusLabels[animal.status]}
                        </Badge>
                        {animal.slots_filled >= animal.slots_total && (
                          <Badge variant="success">{t('fullyFunded')}</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted capitalize">{animal.type}</div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold">₸{animal.price.toLocaleString()}</div>
                      <div className="text-xs text-muted">{tFeat('perSlot')}</div>
                    </div>

                    {/* Investors */}
                    <div className="text-right w-28">
                      <div className="text-sm font-medium mb-1">
                        {animal.slots_filled} {t('investors')}
                      </div>
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div className="h-full bg-accent rounded-full" style={{ width: `${fillPct}%` }} />
                      </div>
                      <div className="text-xs text-muted mt-0.5">{fillPct}% filled</div>
                    </div>

                    {/* Status update */}
                    {nextStatus && (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={updatingId === animal.id}
                        onClick={() => updateStatus(animal.id, nextStatus)}
                      >
                        → {statusLabels[nextStatus]}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
