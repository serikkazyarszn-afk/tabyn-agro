'use client';

import { useMemo, useState, use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import { createClient } from '@/lib/supabase';

const supabase = createClient();
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import {
  ArrowLeft,
  MapPin,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  X,
  FileText,
  Activity,
  AlertTriangle,
  User,
  Stamp,
  Hash,
  Download,
  CalendarClock,
  Scale,
  Info,
} from 'lucide-react';
import { clsx } from 'clsx';
import { Animal } from '@/lib/types';

type Tab = 'overview' | 'documents' | 'updates' | 'risks' | 'farmer';

const STATUS_VARIANTS = {
  available: 'brand',
  growing: 'warning',
  ready: 'positive',
  sold: 'neutral',
} as const;

const RISK_VARIANT = {
  low: 'positive',
  medium: 'warning',
  high: 'destructive',
} as const;

function riskOf(animal: Animal): 'low' | 'medium' | 'high' {
  if (animal.expected_return_pct >= 22) return 'high';
  if (animal.expected_return_pct >= 16) return 'medium';
  return 'low';
}

export default function AnimalDetailClient({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);
  const t = useTranslations('animals.detail');
  const tFeat = useTranslations('featuredAnimals');
  const tCommon = useTranslations('common');
  const tDue = useTranslations('dueDiligence');

  const animal = DEMO_ANIMALS.find((a) => a.id === id);
  if (!animal) notFound();

  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleOpenInvest = () => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    setShowModal(true);
  };

  const statusLabels = {
    available: tFeat('available'),
    growing: tFeat('growing'),
    ready: tFeat('ready'),
    sold: tFeat('sold'),
  };

  const slotsRemaining = animal.slots_total - animal.slots_filled;
  const fillPct = Math.round((animal.slots_filled / animal.slots_total) * 100);
  const risk = riskOf(animal);
  const assetId = `${animal.type.toUpperCase().slice(0, 2)}-2026-${String(animal.id).padStart(4, '0')}`;

  const tabs: Array<{ key: Tab; icon: React.ComponentType<{ className?: string }>; label: string }> = [
    { key: 'overview', icon: Info, label: tDue('tabs.overview') },
    { key: 'documents', icon: FileText, label: tDue('tabs.documents') },
    { key: 'updates', icon: Activity, label: tDue('tabs.updates') },
    { key: 'risks', icon: AlertTriangle, label: tDue('tabs.risks') },
    { key: 'farmer', icon: User, label: tDue('tabs.farmer') },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Back */}
      <Link
        href={`/${locale}/animals`}
        className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors mb-6 text-[13px]"
      >
        <ArrowLeft className="w-4 h-4" />
        {tCommon('back')}
      </Link>

      {/* Header */}
      <header className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="neutral" size="sm">
              <Hash className="w-3 h-3" />
              {assetId}
            </Badge>
            <Badge variant={STATUS_VARIANTS[animal.status]} size="sm" dot>
              {statusLabels[animal.status]}
            </Badge>
            <Badge variant={RISK_VARIANT[risk]} size="sm">
              <Scale className="w-3 h-3" />
              {tDue(`risk.${risk}`)}
            </Badge>
            {animal.farmer?.verified && (
              <Badge variant="brand" size="sm">
                <ShieldCheck className="w-3 h-3" />
                {t('verified')}
              </Badge>
            )}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.1]">
            {animal.name}
          </h1>
          <p className="mt-1.5 text-[14px] md:text-[15px] text-text-secondary">
            {animal.breed} · {animal.farmer?.farm_name} ·{' '}
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 inline" />
              {animal.farmer?.location}
            </span>
          </p>
        </div>
      </header>

      {/* Two-column: left = cockpit, right = invest card (sticky on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left */}
        <div className="lg:col-span-8 space-y-6">
          {/* Media */}
          <div className="relative aspect-[16/9] rounded-[18px] overflow-hidden surface-card border border-border-700 bg-bg-950">
            {animal.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={animal.image_url}
                alt={`${animal.name} — ${animal.breed ?? ''}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <DetailSchematic type={animal.type} />
            )}
            {/* Readability gradient so the overlay chips stay legible */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(7,32,26,0.55) 0%, rgba(7,32,26,0) 22%, rgba(7,32,26,0) 78%, rgba(7,32,26,0.45) 100%)',
              }}
            />
            {/* Asset tag card overlay */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="surface-elevated rounded-[10px] px-3 py-2 flex items-center gap-2">
                <Stamp className="w-3.5 h-3.5 text-brand" />
                <span className="text-[12px] text-text-secondary tabular">
                  {tDue('vetId')}:
                </span>
                <span className="text-[12px] font-medium text-text-primary font-mono">
                  VET-2026-{String(animal.id).padStart(4, '0')}
                </span>
              </div>
              <div className="surface-elevated rounded-[10px] px-3 py-2 hidden sm:flex items-center gap-2">
                <CalendarClock className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-[12px] text-text-secondary">
                  {tDue('listed')}: {animal.created_at}
                </span>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-b border-border-700 -mx-1 overflow-x-auto">
            <nav
              role="tablist"
              aria-label={tDue('tabsLabel')}
              className="flex items-center gap-0 min-w-max px-1"
            >
              {tabs.map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={clsx(
                    'relative inline-flex items-center gap-2 px-4 h-11 text-[13px] font-medium whitespace-nowrap transition-colors',
                    tab === key
                      ? 'text-text-primary'
                      : 'text-text-tertiary hover:text-text-secondary',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {tab === key && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand rounded-full" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab panels */}
          {tab === 'overview' && <OverviewPanel animal={animal} />}
          {tab === 'documents' && <DocumentsPanel animal={animal} assetId={assetId} />}
          {tab === 'updates' && <UpdatesPanel animal={animal} />}
          {tab === 'risks' && <RisksPanel animal={animal} risk={risk} />}
          {tab === 'farmer' && <FarmerPanel animal={animal} />}
        </div>

        {/* Right: invest card */}
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <InvestCard
              animal={animal}
              fillPct={fillPct}
              slotsRemaining={slotsRemaining}
              risk={risk}
              onOpen={handleOpenInvest}
            />

            {/* Trust summary */}
            <div className="surface-card rounded-[16px] p-5">
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary mb-3">
                {tDue('trustSummary')}
              </div>
              <ul className="space-y-2.5">
                <ProofRow
                  icon={ShieldCheck}
                  label={tDue('proofVerifiedFarmer')}
                  state={animal.farmer?.verified ?? false}
                />
                <ProofRow icon={FileText} label={tDue('proofVetPassport')} state />
                <ProofRow icon={Hash} label={tDue('proofAnimalId')} state />
                <ProofRow icon={Stamp} label={tDue('proofLegalAgreement')} state />
                <ProofRow icon={Activity} label={tDue('proofUpdates')} state />
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {showModal && (
        <InvestModal
          animal={animal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

/* ============================================================
   Tab panels
   ============================================================ */

function OverviewPanel({ animal }: { animal: Animal }) {
  const t = useTranslations('dueDiligence');
  const tFeat = useTranslations('featuredAnimals');

  // Synthesise a lifecycle based on current status — no hidden data needed
  const stages: Array<{
    key: string;
    label: string;
    when: string;
    state: 'done' | 'active' | 'pending';
  }> = [
    { key: 'verify', label: t('lifecycle.verify'), when: animal.created_at, state: 'done' },
    { key: 'fund', label: t('lifecycle.fund'), when: animal.status === 'available' ? t('lifecycle.inProgress') : '—', state: animal.status === 'available' ? 'active' : 'done' },
    { key: 'growth', label: t('lifecycle.growth'), when: animal.status === 'growing' ? t('lifecycle.inProgress') : '—', state: animal.status === 'growing' ? 'active' : animal.status === 'ready' || animal.status === 'sold' ? 'done' : 'pending' },
    { key: 'sale', label: t('lifecycle.sale'), when: animal.status === 'ready' ? t('lifecycle.inProgress') : animal.status === 'sold' ? t('lifecycle.completed') : '—', state: animal.status === 'ready' ? 'active' : animal.status === 'sold' ? 'done' : 'pending' },
    { key: 'payout', label: t('lifecycle.payout'), when: animal.status === 'sold' ? t('lifecycle.completed') : '—', state: animal.status === 'sold' ? 'done' : 'pending' },
  ];

  // Payout waterfall on detail page — simplified
  const principal = animal.price;
  const mult = { bear: 1.06, base: 1 + animal.expected_return_pct / 100, bull: 1 + animal.expected_return_pct / 100 + 0.1 };
  const rows = (['bear', 'base', 'bull'] as const).map((s) => {
    const sale = Math.round(principal * mult[s]);
    const gross = sale - principal;
    const investor = Math.round(gross * 0.7);
    return { scenario: s, sale, gross, investor };
  });

  return (
    <div className="space-y-6">
      {/* Description */}
      {animal.description && (
        <section className="surface-card rounded-[16px] p-5 md:p-6">
          <h2 className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary mb-3">
            {t('about')}
          </h2>
          <p className="text-[14.5px] text-text-secondary leading-[1.65]">
            {animal.description}
          </p>
        </section>
      )}

      {/* Key metrics */}
      <section>
        <h2 className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary mb-3">
          {t('keyMetrics')}
        </h2>
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-700 rounded-[14px] overflow-hidden border border-border-700">
          <MetricCell label={tFeat('expectedReturn')} value={`+${animal.expected_return_pct}%`} accent />
          <MetricCell label={tFeat('duration')} value={`${animal.duration_months} ${tFeat('months')}`} />
          <MetricCell label={t('pricePerSlot')} value={`₸${animal.price.toLocaleString('ru-RU')}`} />
          <MetricCell label={t('totalRaise')} value={`₸${(animal.price * animal.slots_total).toLocaleString('ru-RU')}`} />
        </dl>
      </section>

      {/* Lifecycle timeline */}
      <section className="surface-card rounded-[16px] p-5 md:p-6">
        <h2 className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary mb-5">
          {t('lifecycleTitle')}
        </h2>
        <ol className="relative">
          <span
            aria-hidden
            className="absolute left-[11px] top-2 bottom-2 w-px bg-border-700"
          />
          {stages.map((s, i) => (
            <li key={s.key} className="relative pl-9 pb-5 last:pb-0">
              <span
                className={clsx(
                  'absolute left-0 top-0 w-[22px] h-[22px] rounded-full flex items-center justify-center border',
                  s.state === 'done'
                    ? 'bg-brand/15 border-brand text-brand'
                    : s.state === 'active'
                      ? 'bg-warning/15 border-warning text-warning'
                      : 'bg-surface-800 border-border-700 text-text-tertiary',
                )}
              >
                {s.state === 'done' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <span className="text-[10px] font-semibold tabular">{i + 1}</span>
                )}
              </span>
              <div className="flex items-center justify-between gap-3">
                <div className="text-[14px] text-text-primary font-medium">
                  {s.label}
                </div>
                <div className="text-[12px] text-text-tertiary tabular">{s.when}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Payout scenarios */}
      <section className="surface-card rounded-[16px] p-5 md:p-6">
        <h2 className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary mb-4">
          {t('scenariosTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rows.map((r) => (
            <div
              key={r.scenario}
              className={clsx(
                'rounded-[12px] p-4 border',
                r.scenario === 'bull'
                  ? 'bg-positive/8 border-positive/25'
                  : r.scenario === 'bear'
                    ? 'bg-destructive/8 border-destructive/25'
                    : 'bg-surface-800 border-border-700',
              )}
            >
              <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-2">
                {t(`scenarios.${r.scenario}`)}
              </div>
              <div className="text-[20px] font-semibold text-text-primary tabular leading-none">
                ₸{r.investor.toLocaleString('ru-RU')}
              </div>
              <div className="mt-1 text-[11px] text-text-tertiary">
                {t('scenarios.investorShare')}
              </div>
              <dl className="mt-3 space-y-1 text-[12px]">
                <div className="flex justify-between">
                  <dt className="text-text-tertiary">{t('scenarios.sale')}</dt>
                  <dd className="text-text-secondary tabular">
                    ₸{r.sale.toLocaleString('ru-RU')}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-tertiary">{t('scenarios.gross')}</dt>
                  <dd className="text-text-secondary tabular">
                    ₸{r.gross.toLocaleString('ru-RU')}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11.5px] text-text-tertiary leading-relaxed">
          {t('scenariosNote')}
        </p>
      </section>
    </div>
  );
}

function DocumentsPanel({ animal, assetId }: { animal: Animal; assetId: string }) {
  const t = useTranslations('dueDiligence');
  const docs: Array<{ key: string; id: string; date: string; issuer: string; size: string }> = [
    { key: 'vetPassport', id: `VET-2026-${String(animal.id).padStart(4, '0')}`, date: animal.created_at, issuer: t('issuer.districtVet'), size: '128 KB' },
    { key: 'farmRegistration', id: `FARM-${animal.farmer?.id?.toUpperCase()}-01`, date: '2024-01-15', issuer: t('issuer.stateRegistry'), size: '94 KB' },
    { key: 'breedCertificate', id: `BREED-${animal.id}-01`, date: animal.created_at, issuer: t('issuer.breedAssociation'), size: '212 KB' },
    { key: 'insurancePolicy', id: `INS-${assetId}`, date: animal.created_at, issuer: t('issuer.insurer'), size: '156 KB' },
    { key: 'contractTemplate', id: `AGR-${assetId}`, date: animal.created_at, issuer: 'Tabyn', size: '78 KB' },
  ];

  return (
    <div className="space-y-4">
      <div className="text-[13px] text-text-secondary leading-relaxed max-w-2xl">
        {t('documentsIntro')}
      </div>
      <div className="surface-card rounded-[16px] divide-y divide-border-700 overflow-hidden">
        {docs.map((d) => (
          <div
            key={d.key}
            className="flex items-center gap-4 p-4 hover:bg-surface-800 transition-colors"
          >
            <div className="w-10 h-10 rounded-[10px] bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-text-primary truncate">
                {t(`docs.${d.key}`)}
              </div>
              <div className="mt-0.5 text-[11.5px] text-text-tertiary font-mono tabular truncate">
                {d.id} · {d.issuer} · {d.date} · {d.size}
              </div>
            </div>
            <button
              aria-label="Download"
              className="w-9 h-9 rounded-[10px] border border-border-700 text-text-secondary hover:text-text-primary hover:border-border-600 inline-flex items-center justify-center shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <p className="text-[11.5px] text-text-tertiary">{t('documentsNote')}</p>
    </div>
  );
}

function UpdatesPanel({ animal }: { animal: Animal }) {
  const t = useTranslations('dueDiligence');
  const updates = [
    { date: '2026-04-15', titleKey: 'updates.u1.title', bodyKey: 'updates.u1.body', author: animal.farmer?.farm_name },
    { date: '2026-03-20', titleKey: 'updates.u2.title', bodyKey: 'updates.u2.body', author: animal.farmer?.farm_name },
    { date: '2026-02-28', titleKey: 'updates.u3.title', bodyKey: 'updates.u3.body', author: t('issuer.districtVet') },
    { date: animal.created_at, titleKey: 'updates.u4.title', bodyKey: 'updates.u4.body', author: 'Tabyn' },
  ];

  return (
    <div className="space-y-3">
      <div className="text-[13px] text-text-secondary leading-relaxed max-w-2xl mb-2">
        {t('updatesIntro')}
      </div>
      {updates.map((u, i) => (
        <article
          key={i}
          className="surface-card rounded-[14px] p-4 md:p-5 flex gap-4"
        >
          <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
            <Activity className="w-3.5 h-3.5 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="text-[14px] font-semibold text-text-primary">
                {t(u.titleKey)}
              </h3>
              <span className="text-[11px] text-text-tertiary tabular font-mono shrink-0">
                {u.date}
              </span>
            </div>
            <p className="text-[13px] text-text-secondary leading-[1.6]">
              {t(u.bodyKey)}
            </p>
            <div className="mt-2 text-[11px] text-text-tertiary">
              {t('updatedBy')}: {u.author}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function RisksPanel({
  animal,
  risk,
}: {
  animal: Animal;
  risk: 'low' | 'medium' | 'high';
}) {
  const t = useTranslations('dueDiligence');

  const risks: Array<{ key: string; level: 'low' | 'medium' | 'high' }> = [
    { key: 'marketPrice', level: 'medium' },
    { key: 'health', level: 'low' },
    { key: 'weather', level: 'medium' },
    { key: 'fx', level: 'low' },
    { key: 'liquidity', level: risk === 'high' ? 'high' : 'medium' },
    { key: 'farmerPerformance', level: animal.farmer?.verified ? 'low' : 'medium' },
  ];

  return (
    <div className="space-y-4">
      <div className="surface-card rounded-[16px] p-5 md:p-6">
        <div className="flex items-start gap-3">
          <div
            className={clsx(
              'w-9 h-9 rounded-full flex items-center justify-center shrink-0 border',
              risk === 'low'
                ? 'bg-positive/15 border-positive/30 text-positive'
                : risk === 'medium'
                  ? 'bg-warning/15 border-warning/30 text-warning'
                  : 'bg-destructive/15 border-destructive/30 text-destructive',
            )}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-text-primary">
              {t(`riskSummary.${risk}`)}
            </div>
            <p className="mt-1 text-[13px] text-text-secondary leading-relaxed">
              {t('riskExplain')}
            </p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-[16px] overflow-hidden divide-y divide-border-700">
        {risks.map((r) => (
          <div
            key={r.key}
            className="flex items-start gap-4 p-4 md:p-5"
          >
            <div
              className={clsx(
                'w-2 h-2 rounded-full mt-2 shrink-0',
                r.level === 'low'
                  ? 'bg-positive'
                  : r.level === 'medium'
                    ? 'bg-warning'
                    : 'bg-destructive',
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h4 className="text-[14px] font-medium text-text-primary">
                  {t(`risks.${r.key}.title`)}
                </h4>
                <Badge
                  variant={
                    r.level === 'low'
                      ? 'positive'
                      : r.level === 'medium'
                        ? 'warning'
                        : 'destructive'
                  }
                  size="sm"
                >
                  {t(`risk.${r.level}`)}
                </Badge>
              </div>
              <p className="text-[12.5px] text-text-secondary leading-[1.55]">
                {t(`risks.${r.key}.body`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[11.5px] text-text-tertiary leading-relaxed">
        {t('riskFooter')}
      </p>
    </div>
  );
}

function FarmerPanel({ animal }: { animal: Animal }) {
  const t = useTranslations('dueDiligence');
  if (!animal.farmer) return null;
  return (
    <div className="space-y-4">
      <div className="surface-card rounded-[16px] p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[12px] bg-brand/10 border border-brand/25 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-[16px] font-semibold text-text-primary">
                {animal.farmer.farm_name}
              </h3>
              {animal.farmer.verified && (
                <Badge variant="brand" size="sm">
                  <ShieldCheck className="w-3 h-3" />
                  {t('verifiedFarmer')}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-text-secondary mb-3">
              <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
              {animal.farmer.location}
            </div>
            {animal.farmer.description && (
              <p className="text-[13.5px] text-text-secondary leading-[1.6]">
                {animal.farmer.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-700 rounded-[14px] overflow-hidden border border-border-700">
        <MetricCell label={t('farmerStats.experience')} value="15+ years" />
        <MetricCell label={t('farmerStats.cycles')} value="12" />
        <MetricCell label={t('farmerStats.onTimePayout')} value="100%" accent />
        <MetricCell label={t('farmerStats.updateCadence')} value="29 d" />
      </div>

      <div className="surface-card rounded-[16px] p-5 md:p-6">
        <h4 className="text-[12px] uppercase tracking-[0.1em] text-text-tertiary mb-3">
          {t('farmerCredentials')}
        </h4>
        <ul className="space-y-2.5 text-[13px]">
          {(['farmReg', 'vetAcc', 'breedAssoc', 'landTitle'] as const).map((k) => (
            <li key={k} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
              <span className="text-text-secondary">{t(`credentials.${k}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   Invest card + modal
   ============================================================ */

function InvestCard({
  animal,
  fillPct,
  slotsRemaining,
  risk,
  onOpen,
}: {
  animal: Animal;
  fillPct: number;
  slotsRemaining: number;
  risk: 'low' | 'medium' | 'high';
  onOpen: () => void;
}) {
  const t = useTranslations('animals.detail');
  const tFeat = useTranslations('featuredAnimals');
  const tDue = useTranslations('dueDiligence');

  return (
    <div className="surface-card rounded-[18px] p-5 md:p-6">
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <div>
          <div className="text-[26px] font-semibold text-text-primary tabular leading-none">
            ₸{animal.price.toLocaleString('ru-RU')}
          </div>
          <div className="mt-1 text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
            {tFeat('perSlot')}
          </div>
        </div>
        <Badge variant={RISK_VARIANT[risk]} size="sm">
          <Scale className="w-3 h-3" />
          {tDue(`risk.${risk}`)}
        </Badge>
      </div>

      <dl className="grid grid-cols-2 gap-px bg-border-700 rounded-[12px] overflow-hidden border border-border-700 mb-5">
        <div className="bg-surface-900 p-3">
          <dt className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary flex items-center gap-1.5">
            <TrendingUp className="w-3 h-3 text-brand" />
            {tFeat('expectedReturn')}
          </dt>
          <dd className="mt-1 text-[16px] font-semibold text-brand tabular">
            +{animal.expected_return_pct}%
          </dd>
        </div>
        <div className="bg-surface-900 p-3">
          <dt className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {tFeat('duration')}
          </dt>
          <dd className="mt-1 text-[16px] font-semibold text-text-primary tabular">
            {animal.duration_months} {tFeat('months')}
          </dd>
        </div>
      </dl>

      <div className="mb-5">
        <div className="flex items-center justify-between text-[12px] mb-1.5">
          <span className="text-text-secondary">
            {t('slots')} —{' '}
            <span className="text-text-primary tabular">
              {slotsRemaining}
            </span>{' '}
            {t('slotsRemaining')}
          </span>
          <span className="text-text-tertiary tabular">{fillPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-surface-800 overflow-hidden">
          <div
            className="h-full bg-brand rounded-full"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={animal.status !== 'available' || slotsRemaining === 0}
        onClick={onOpen}
      >
        {animal.status !== 'available'
          ? t('unavailable')
          : slotsRemaining === 0
            ? t('fullyFunded')
            : t('invest')}
      </Button>

      <p className="mt-3 text-[11px] text-text-tertiary leading-relaxed text-center">
        {t('legalNote')}
      </p>
    </div>
  );
}

function InvestModal({
  animal,
  onClose,
}: {
  animal: Animal;
  onClose: () => void;
}) {
  const t = useTranslations('animals.detail');
  const [amount, setAmount] = useState(animal.price.toString());
  const [investing, setInvesting] = useState(false);
  const [success, setSuccess] = useState(false);

  const DEMO_BALANCE = 500000;
  const principal = Number(amount) || 0;
  const gross = Math.round(principal * (animal.expected_return_pct / 100));
  const investorShare = Math.round(gross * 0.7);
  const investorTotal = principal + investorShare;

  const handleInvest = async () => {
    setInvesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setInvesting(false);
    setSuccess(true);
    setTimeout(() => onClose(), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-950/70 backdrop-blur-[4px]">
      <div
        role="dialog"
        aria-modal="true"
        className="surface-elevated w-full max-w-lg rounded-[18px] overflow-hidden max-h-[90dvh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border-700">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
              {t('investModal.title')}
            </div>
            <div className="text-[15px] font-semibold text-text-primary">
              {animal.name}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-[10px] text-text-tertiary hover:text-text-primary hover:bg-surface-800 inline-flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-positive/15 border border-positive/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-positive" />
            </div>
            <h3 className="text-[18px] font-semibold text-text-primary mb-1">
              {t('investModal.successTitle')}
            </h3>
            <p className="text-[13px] text-text-secondary">
              {t('investModal.successBody')}
            </p>
          </div>
        ) : (
          <>
            <div className="px-5 md:px-6 py-5 space-y-4 flex-1 overflow-y-auto">
              <Input
                id="amount"
                label={t('investModal.amount')}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min={animal.price}
                step={10000}
                leading={<span className="text-text-secondary">₸</span>}
              />

              <div className="surface-card rounded-[12px] p-4 space-y-2">
                <Row label={t('investModal.balance')} value={`₸${DEMO_BALANCE.toLocaleString('ru-RU')}`} muted />
                <Row label={t('investModal.grossProjected')} value={`₸${gross.toLocaleString('ru-RU')}`} />
                <Row label={t('investModal.yourShare')} value={`₸${investorShare.toLocaleString('ru-RU')}`} accent />
                <div className="border-t border-border-700 pt-2">
                  <Row label={t('investModal.total')} value={`₸${investorTotal.toLocaleString('ru-RU')}`} emphasis />
                </div>
              </div>

              <p className="text-[11.5px] text-text-tertiary leading-relaxed">
                {t('investModal.agreementNote')}
              </p>
            </div>

            <div className="px-5 md:px-6 py-4 border-t border-border-700 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
              <Button variant="ghost" size="md" onClick={onClose} fullWidth>
                {t('investModal.cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={investing}
                onClick={handleInvest}
                fullWidth
              >
                {investing
                  ? t('investModal.loading')
                  : t('investModal.confirm')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Small helpers
   ============================================================ */

function MetricCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-surface-900 p-4">
      <div className="text-[11px] uppercase tracking-[0.08em] text-text-tertiary">
        {label}
      </div>
      <div
        className={clsx(
          'mt-1 text-[18px] font-semibold tabular',
          accent ? 'text-brand' : 'text-text-primary',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ProofRow({
  icon: Icon,
  label,
  state,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  state: boolean;
}) {
  return (
    <li className="flex items-center gap-2.5 text-[13px]">
      <Icon className={clsx('w-3.5 h-3.5 shrink-0', state ? 'text-brand' : 'text-text-tertiary')} />
      <span className="text-text-secondary flex-1">{label}</span>
      {state ? (
        <CheckCircle className="w-3.5 h-3.5 text-brand" />
      ) : (
        <span className="text-text-tertiary text-[11px]">—</span>
      )}
    </li>
  );
}

function Row({
  label,
  value,
  muted,
  accent,
  emphasis,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={clsx(
          'text-[13px]',
          emphasis ? 'font-semibold text-text-primary' : muted ? 'text-text-tertiary' : 'text-text-secondary',
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          'tabular shrink-0',
          emphasis ? 'text-[16px] font-semibold' : 'text-[13px] font-medium',
          accent ? 'text-brand' : emphasis ? 'text-text-primary' : muted ? 'text-text-tertiary' : 'text-text-primary',
        )}
      >
        {value}
      </span>
    </div>
  );
}

function DetailSchematic({ type }: { type: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 675"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0E1D19" />
          <stop offset="100%" stopColor="#152521" />
        </linearGradient>
        <linearGradient id="dland" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1C2F29" />
          <stop offset="100%" stopColor="#0E1D19" />
        </linearGradient>
        <pattern id="dgrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#294139" strokeWidth="0.6" opacity="0.4" />
        </pattern>
      </defs>
      <rect width="1200" height="430" fill="url(#dsky)" />
      <rect width="1200" height="675" fill="url(#dgrid)" opacity="0.7" />
      <line x1="0" y1="430" x2="1200" y2="430" stroke="#4FA26D" strokeWidth="1.4" opacity="0.6" />
      <rect y="430" width="1200" height="245" fill="url(#dland)" />
      <text x="600" y="350" textAnchor="middle" fontSize="18" fill="#8A938D" letterSpacing="6" style={{ textTransform: 'uppercase', fontFamily: 'monospace' }}>
        {type.toUpperCase()}
      </text>
      <g fill="none" stroke="#8A938D" strokeWidth="1" opacity="0.5">
        <path d="M24,24 L24,48 M24,24 L48,24" />
        <path d="M1176,24 L1176,48 M1176,24 L1152,24" />
        <path d="M24,651 L24,627 M24,651 L48,651" />
        <path d="M1176,651 L1176,627 M1176,651 L1152,651" />
      </g>
    </svg>
  );
}
