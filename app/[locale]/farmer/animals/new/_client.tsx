'use client';

import { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  Hash,
  TrendingUp,
  Clock,
  Users,
  FileText,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';

const ANIMAL_TYPES = ['cow', 'sheep', 'horse', 'goat', 'camel'] as const;

export default function NewAnimalClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('farmer.addAnimal');
  const tCat = useTranslations('animals.filter');
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    type: 'cow' as (typeof ANIMAL_TYPES)[number],
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

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => router.push(`/${locale}/farmer/dashboard`), 1800);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-positive/15 border border-positive/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-positive" />
          </div>
          <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-text-primary">
            {t('success')}
          </h2>
          <p className="mt-2 text-[13px] text-text-secondary leading-relaxed">
            {t('successBody')}
          </p>
        </div>
      </div>
    );
  }

  const previewPrice = Number(form.price) || 0;
  const previewReturn = Number(form.expected_return_pct) || 0;
  const previewSlots = Number(form.slots_total) || 0;
  const previewRaise = previewPrice * previewSlots;
  const previewInvestorShare = Math.round(previewPrice * (previewReturn / 100) * 0.7);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <Link
        href={`/${locale}/farmer/dashboard`}
        className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors mb-6 text-[13px]"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('backToDashboard')}
      </Link>

      <header className="mb-8">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-2">
          {t('badge')}
        </div>
        <h1 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.1]">
          {t('title')}
        </h1>
        <p className="mt-1.5 text-[14px] text-text-secondary max-w-2xl">
          {t('subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6" noValidate>
          {/* Identity section */}
          <FormSection
            title={t('sections.identity.title')}
            subtitle={t('sections.identity.subtitle')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="name"
                label={t('name')}
                value={form.name}
                onChange={set('name')}
                placeholder="Ақбоз"
                required
                hint={t('nameHint')}
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label
                  htmlFor="type"
                  className="text-[13px] font-medium text-text-secondary tracking-[0.01em]"
                >
                  {t('type')}
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={set('type')}
                  className="h-12 bg-surface-900 border border-border-700 rounded-[12px] px-4 text-[14px] text-text-primary focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                >
                  {ANIMAL_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {tCat(type)}
                    </option>
                  ))}
                </select>
                <div className="min-h-[16px]" />
              </div>
            </div>
            <Input
              id="breed"
              label={t('breed')}
              value={form.breed}
              onChange={set('breed')}
              placeholder={t('breedPlaceholder')}
              hint={t('breedHint')}
            />
          </FormSection>

          {/* Investment section */}
          <FormSection
            title={t('sections.investment.title')}
            subtitle={t('sections.investment.subtitle')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="price"
                label={t('price')}
                type="number"
                value={form.price}
                onChange={set('price')}
                placeholder="250000"
                required
                min={0}
                leading={<span className="text-text-secondary text-[13px]">₸</span>}
              />
              <Input
                id="expected_return_pct"
                label={t('expectedReturn')}
                type="number"
                value={form.expected_return_pct}
                onChange={set('expected_return_pct')}
                placeholder="18"
                required
                min={1}
                max={100}
                trailing={<span className="text-text-tertiary text-[13px] pr-3">%</span>}
                hint={t('returnHint')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="duration_months"
                label={t('duration')}
                type="number"
                value={form.duration_months}
                onChange={set('duration_months')}
                placeholder="8"
                required
                min={1}
                trailing={<span className="text-text-tertiary text-[13px] pr-3">{t('mo')}</span>}
              />
              <Input
                id="slots_total"
                label={t('slots')}
                type="number"
                value={form.slots_total}
                onChange={set('slots_total')}
                placeholder="5"
                required
                min={1}
                hint={t('slotsHint')}
              />
            </div>
          </FormSection>

          {/* Description & media */}
          <FormSection
            title={t('sections.description.title')}
            subtitle={t('sections.description.subtitle')}
          >
            <div className="flex flex-col gap-1.5 w-full">
              <label
                htmlFor="description"
                className="text-[13px] font-medium text-text-secondary tracking-[0.01em]"
              >
                {t('description')}
              </label>
              <textarea
                id="description"
                value={form.description}
                onChange={set('description')}
                rows={4}
                placeholder={t('descriptionPlaceholder')}
                className="bg-surface-900 border border-border-700 rounded-[12px] px-4 py-3 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 resize-none leading-[1.55]"
              />
              <div className="min-h-[16px]">
                <p className="text-[12px] text-text-tertiary leading-4">
                  {t('descriptionHint')}
                </p>
              </div>
            </div>
            <Input
              id="image_url"
              label={t('image')}
              type="url"
              value={form.image_url}
              onChange={set('image_url')}
              placeholder="https://…"
              hint={t('imageHint')}
            />
          </FormSection>

          {/* Verification notice */}
          <div className="surface-card rounded-[14px] p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-brand" />
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-text-primary">
                {t('verificationNoticeTitle')}
              </div>
              <p className="mt-1 text-[12.5px] text-text-secondary leading-[1.55]">
                {t('verificationNoticeBody')}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Link href={`/${locale}/farmer/dashboard`} className="sm:w-auto w-full">
              <Button variant="ghost" size="lg" fullWidth>
                {t('cancel')}
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              className="sm:flex-1"
            >
              {loading ? t('loading') : t('submit')}
            </Button>
          </div>
        </form>

        {/* Preview */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24">
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary mb-3 flex items-center gap-2">
              <Info className="w-3 h-3" />
              {t('previewLabel')}
            </div>
            <div className="surface-card rounded-[16px] overflow-hidden">
              <div className="relative aspect-[16/10] bg-surface-800">
                {form.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary font-mono">
                      {form.type.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <Badge variant="neutral" size="sm">
                    <Hash className="w-3 h-3" />
                    {form.type.toUpperCase().slice(0, 2)}-draft
                  </Badge>
                </div>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <div>
                  <div className="text-[15px] font-semibold text-text-primary truncate">
                    {form.name || t('previewNamePlaceholder')}
                  </div>
                  <div className="text-[12px] text-text-tertiary truncate mt-0.5">
                    {form.breed || t('previewBreedPlaceholder')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-px bg-border-700 rounded-[10px] overflow-hidden border border-border-700">
                  <PreviewTile
                    icon={TrendingUp}
                    label={t('previewReturn')}
                    value={previewReturn ? `+${previewReturn}%` : '—'}
                    accent={previewReturn > 0}
                  />
                  <PreviewTile
                    icon={Clock}
                    label={t('previewTerm')}
                    value={
                      form.duration_months
                        ? `${form.duration_months} ${t('mo')}`
                        : '—'
                    }
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <PreviewRow
                    label={t('previewPrice')}
                    value={previewPrice ? `₸${previewPrice.toLocaleString('ru-RU')}` : '—'}
                  />
                  <PreviewRow
                    label={t('previewRaise')}
                    value={previewRaise ? `₸${previewRaise.toLocaleString('ru-RU')}` : '—'}
                    emphasis
                  />
                  <PreviewRow
                    label={t('previewInvestorShare')}
                    value={
                      previewInvestorShare
                        ? `₸${previewInvestorShare.toLocaleString('ru-RU')}`
                        : '—'
                    }
                    accent
                  />
                </div>

                <div className="text-[11px] text-text-tertiary border-t border-border-700 pt-3 flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  {form.slots_total ? (
                    <>
                      {form.slots_total} {t('slotsPreview')}
                    </>
                  ) : (
                    t('slotsPreviewEmpty')
                  )}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11.5px] text-text-tertiary leading-relaxed">
              {t('previewNote')}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function FormSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card rounded-[18px] p-5 md:p-6 space-y-4">
      <div>
        <h2 className="text-[15px] font-semibold text-text-primary">{title}</h2>
        <p className="mt-0.5 text-[12.5px] text-text-tertiary">{subtitle}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function PreviewTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface-900 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div
        className={clsx(
          'mt-0.5 text-[14px] font-semibold tabular',
          accent ? 'text-brand' : 'text-text-primary',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function PreviewRow({
  label,
  value,
  accent,
  emphasis,
}: {
  label: string;
  value: string;
  accent?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12.5px]">
      <span className="text-text-tertiary">{label}</span>
      <span
        className={clsx(
          'tabular shrink-0',
          accent ? 'text-brand font-semibold' : emphasis ? 'text-text-primary font-semibold' : 'text-text-secondary',
        )}
      >
        {value}
      </span>
    </div>
  );
}
