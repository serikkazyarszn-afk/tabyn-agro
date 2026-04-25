'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { use } from 'react';
import { MapPin, Clock, TrendingUp, Users, CheckCircle, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Animal } from '@/lib/types';

const supabase = createClient();

const STATUS_VARIANTS = {
  available: 'accent',
  growing: 'warning',
  ready: 'success',
  sold: 'muted',
} as const;

const ANIMAL_EMOJIS: Record<string, string> = {
  cow: '🐄', sheep: '🐑', horse: '🐴', goat: '🐐', camel: '🐪',
};

export default function AnimalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const t = useTranslations('animals.detail');
  const tFeat = useTranslations('featuredAnimals');
  const tCommon = useTranslations('common');
  const router = useRouter();

  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [investError, setInvestError] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    if (animal) document.title = `${animal.name} — Tabyn`;
  }, [animal]);

  useEffect(() => {
    (async () => {
      const [{ data: animalData }, { data: { user } }] = await Promise.all([
        supabase
          .from('animals')
          .select('*, farmer:farmers(id, farm_name, location, description, verified, user_id)')
          .eq('id', id)
          .single(),
        supabase.auth.getUser(),
      ]);

      if (animalData) {
        setAnimal(animalData as Animal);
        setAmount(animalData.price.toString());
      }

      if (user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', user.id)
          .single();
        if (profile) setBalance(profile.balance ?? 0);
      }

      setLoading(false);
    })();
  }, [id]);

  const parsedAmount = Number(amount);
  const expectedProfit = useMemo(
    () => animal ? Math.round(parsedAmount * (animal.expected_return_pct / 100)) : 0,
    [parsedAmount, animal]
  );

  const handleInvest = async () => {
    if (!animal) return;
    setInvestError('');
    if (isNaN(parsedAmount) || parsedAmount < animal.price) {
      setInvestError(t('investModal.errorMinimum', { amount: animal.price.toLocaleString() }));
      return;
    }
    if (parsedAmount > balance) {
      setInvestError(t('investModal.errorBalance'));
      return;
    }
    setInvesting(true);
    const { data, error } = await supabase.rpc('create_investment', {
      p_animal_id: animal.id,
      p_amount: parsedAmount,
    });
    setInvesting(false);

    if (error || data?.error) {
      setInvestError(data?.error ?? error?.message ?? t('investModal.errorFailed'));
      return;
    }

    setBalance((b) => b - parsedAmount);
    setAnimal((a) => a ? { ...a, slots_filled: a.slots_filled + 1 } : a);
    setSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setSuccess(false);
    }, 2000);
  };

  const statusLabels = {
    available: tFeat('available'),
    growing: tFeat('growing'),
    ready: tFeat('ready'),
    sold: tFeat('sold'),
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="h-8 w-24 bg-surface rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="col-span-3 space-y-6">
            <div className="h-[420px] bg-surface rounded-2xl animate-pulse" />
            <div className="h-32 bg-surface rounded-2xl animate-pulse" />
          </div>
          <div className="col-span-2">
            <div className="h-80 bg-surface rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-muted text-lg mb-4">Animal not found.</p>
        <Link href={`/${locale}/animals`}>
          <Button variant="secondary" size="md">{tCommon('back')}</Button>
        </Link>
      </div>
    );
  }

  const slotsRemaining = animal.slots_total - animal.slots_filled;
  const fillPct = Math.round((animal.slots_filled / animal.slots_total) * 100);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Back */}
      <Link href={`/${locale}/animals`} className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" />
        {tCommon('back')}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
        {/* Left: image + details */}
        <div className="col-span-3 space-y-6">
          {/* Hero image */}
          <div className="relative h-[420px] rounded-2xl overflow-hidden">
            {animal.image_url ? (
              <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-8xl">
                {ANIMAL_EMOJIS[animal.type]}
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant={STATUS_VARIANTS[animal.status]}>{statusLabels[animal.status]}</Badge>
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-1">{animal.name}</h2>
            <div className="flex items-center gap-2 text-muted text-sm mb-4">
              <span className="text-lg">{ANIMAL_EMOJIS[animal.type]}</span>
              <span className="capitalize">{animal.type}{animal.breed && ` — ${animal.breed}`}</span>
            </div>
            {animal.description && (
              <p className="text-muted text-sm leading-relaxed">{animal.description}</p>
            )}
          </div>

          {/* Farmer info */}
          {animal.farmer && (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <h3 className="font-bold mb-4">{t('aboutFarmer')}</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  🧑‍🌾
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{animal.farmer.farm_name}</span>
                    {animal.farmer.verified && (
                      <div className="flex items-center gap-1 text-accent text-xs">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{t('verified')}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{animal.farmer.location}</span>
                  </div>
                  {animal.farmer.description && (
                    <p className="text-muted text-sm mt-2">{animal.farmer.description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: investment card */}
        <div className="col-span-2 space-y-4">
          <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-accent">₸{animal.price.toLocaleString()}</div>
                <div className="text-muted text-sm">{tFeat('perSlot')}</div>
              </div>
              <Badge variant={STATUS_VARIANTS[animal.status]}>{statusLabels[animal.status]}</Badge>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs text-muted">{tFeat('expectedReturn')}</span>
                </div>
                <span className="text-xl font-bold text-accent">+{animal.expected_return_pct}%</span>
              </div>
              <div className="bg-background rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  <span className="text-xs text-muted">{tFeat('duration')}</span>
                </div>
                <span className="text-xl font-bold">{animal.duration_months}</span>
                <span className="text-xs text-muted ml-1">{tFeat('months')}</span>
              </div>
            </div>

            {/* Slots */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <Users className="w-3.5 h-3.5 text-muted" />
                  <span className="text-muted">{t('slots')}</span>
                </div>
                <span className="text-sm font-medium">
                  {slotsRemaining} {t('slotsRemaining')}
                </span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${fillPct}%` }} />
              </div>
              <div className="text-xs text-muted mt-1">{animal.slots_filled}/{animal.slots_total} {tFeat('slotsFilled')}</div>
            </div>

            {isLoggedIn ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={animal.status !== 'available' || slotsRemaining === 0}
                onClick={() => setShowModal(true)}
              >
                {t('invest')}
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/${locale}/login`)}
              >
                {t('loginToInvest')}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg">{t('investModal.title')} {animal.name}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <p className="font-semibold text-accent text-lg">Investment successful!</p>
                <p className="text-muted text-sm mt-1">Your investment has been recorded.</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <Input
                    id="amount"
                    label={t('investModal.amount')}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min={animal.price}
                    step={10000}
                  />
                  <div className="flex justify-between text-sm text-muted">
                    <span>{t('investModal.balance')}</span>
                    <span className="text-foreground font-medium">₸{balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">{t('investModal.expectedReturn')}</span>
                    <span className="text-accent font-semibold">+₸{expectedProfit.toLocaleString()}</span>
                  </div>
                </div>
                {investError && (
                  <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5 mb-2">
                    {investError}
                  </p>
                )}
                <div className="flex gap-3">
                  <Button variant="secondary" size="md" className="flex-1" onClick={() => setShowModal(false)}>
                    {t('investModal.cancel')}
                  </Button>
                  <Button variant="primary" size="md" className="flex-1" loading={investing} onClick={handleInvest}>
                    {investing ? t('investModal.loading') : t('investModal.confirm')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
