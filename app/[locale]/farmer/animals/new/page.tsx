'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { use } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';

const ANIMAL_TYPES = ['cow', 'sheep', 'horse', 'goat', 'camel'] as const;
const supabase = createClient();

export default function NewAnimalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations('farmer.addAnimal');
  const tAnimals = useTranslations('animals.filter');
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push(`/${locale}/login`); return; }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'farmer') { router.push(`/${locale}/`); return; }
      setAuthChecked(true);
    })();
  }, [locale, router]);

  const [form, setForm] = useState({
    name: '',
    type: 'cow',
    breed: '',
    price: '',
    expected_return_pct: '',
    duration_months: '',
    slots_total: '',
    description: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push(`/${locale}/farmer/dashboard`), 2000);
  };

  if (!authChecked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/10 border border-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('success')}</h2>
          <p className="text-muted text-sm">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href={`/${locale}/farmer/dashboard`} className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-8 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
        <p className="text-muted text-sm">{t('subtitle')}</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <Input id="name" label={t('name')} value={form.name} onChange={set('name')} placeholder="e.g. Akboz" required />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="type" className="text-sm font-medium text-muted">{t('type')}</label>
              <select
                id="type"
                value={form.type}
                onChange={set('type')}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors"
              >
                {ANIMAL_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {tAnimals(type)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input id="breed" label="Порода" value={form.breed} onChange={set('breed')} placeholder="e.g. Меринос (тонкорунная)" />

          <div className="grid grid-cols-2 gap-5">
            <Input id="price" label={t('price')} type="number" value={form.price} onChange={set('price')} placeholder="250000" required min={0} />
            <Input id="expected_return_pct" label={t('expectedReturn')} type="number" value={form.expected_return_pct} onChange={set('expected_return_pct')} placeholder="18" required min={1} max={100} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <Input id="duration_months" label={t('duration')} type="number" value={form.duration_months} onChange={set('duration_months')} placeholder="8" required min={1} />
            <Input id="slots_total" label={t('slots')} type="number" value={form.slots_total} onChange={set('slots_total')} placeholder="5" required min={1} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-muted">{t('description')}</label>
            <textarea
              id="description"
              value={form.description}
              onChange={set('description')}
              rows={3}
              placeholder="Describe the animal, breed, health status..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          <Input id="image_url" label={t('image')} type="url" value={form.image_url} onChange={set('image_url')} placeholder="https://..." />

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
            {loading ? t('loading') : t('submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
