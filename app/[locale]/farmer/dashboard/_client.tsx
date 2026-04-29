'use client';

import { useState, useMemo, use, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { DEMO_ANIMALS } from '@/lib/demo-data';
import { Animal, AnimalStatus } from '@/lib/types';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { createClient } from '@/lib/supabase';
import {
  Plus,
  TrendingUp,
  Users,
  CheckCircle,
  Package,
  ShieldCheck,
  FileText,
  ArrowRight,
  Activity,
  Send,
  MapPin,
  Hash,
  AlertTriangle,
  Sparkles,
  User,
  Mail,
  Lock,
  Trash2,
  Pencil,
} from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_VARIANTS = {
  available: 'brand',
  growing: 'warning',
  ready: 'positive',
  sold: 'neutral',
} as const;

const STATUS_ORDER: AnimalStatus[] = ['available', 'growing', 'ready', 'sold'];

export default function FarmerDashboardClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations('farmer.dashboard');
  const tDue = useTranslations('dueDiligence');
  const tFeat = useTranslations('featuredAnimals');
  const tProfile = useTranslations('dashboard');

  // Show farmer f1's animals as demo
  const [animals, setAnimals] = useState<Animal[]>(
    DEMO_ANIMALS.filter((a) => a.farmer_id === 'f1'),
  );

  const [updateAnimalId, setUpdateAnimalId] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState('');
  const [updateSent, setUpdateSent] = useState<string | null>(null);

  // Profile state
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAuthEmail(user.email ?? '');
        supabase.from('profiles').select('full_name').eq('id', user.id).single()
          .then(({ data }) => {
            setAuthName(data?.full_name ?? user.user_metadata?.full_name ?? '');
          });
      }
    });
  }, []);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setAuthName(newName.trim());
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowNameModal(false); setNewName(''); }, 1400);
  };

  const handleSavePassword = async () => {
    if (!newPassword.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }, 1400);
  };

  const updateStatus = (id: string, newStatus: AnimalStatus) => {
    setAnimals((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
  };

  // KPI
  const totalAnimals = animals.length;
  const fullyFunded = animals.filter((a) => a.slots_filled >= a.slots_total).length;
  const growing = animals.filter((a) => a.status === 'growing').length;
  const sold = animals.filter((a) => a.status === 'sold').length;
  const totalInvestors = animals.reduce((s, a) => s + a.slots_filled, 0);
  const projectedPayout = animals.reduce(
    (s, a) =>
      a.status !== 'sold'
        ? s + Math.round((a.price * a.slots_filled * (a.expected_return_pct / 100)) * 0.3)
        : s,
    0,
  );

  // Farm profile completeness — synthetic checklist
  const profileTasks = useMemo(() => {
    return [
      { key: 'basics', done: true },
      { key: 'farmDocs', done: true },
      { key: 'vetAcc', done: true },
      { key: 'payout', done: true },
      { key: 'photos', done: false },
      { key: 'bank', done: false },
    ] as const;
  }, []);
  const profileDone = profileTasks.filter((p) => p.done).length;
  const profileScore = Math.round((profileDone / profileTasks.length) * 100);

  const statusLabels: Record<AnimalStatus, string> = {
    available: tFeat('available'),
    growing: tFeat('growing'),
    ready: tFeat('ready'),
    sold: tFeat('sold'),
  };

  const handleSendUpdate = () => {
    if (!updateAnimalId || !updateText.trim()) return;
    const id = updateAnimalId;
    setUpdateSent(id);
    setUpdateText('');
    setTimeout(() => {
      setUpdateSent(null);
      setUpdateAnimalId(null);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand mb-2">
            {t('badge')}
          </div>
          <h1 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.02em] text-text-primary leading-[1.1]">
            {t('title')}
          </h1>
          <p className="mt-1.5 text-[14px] text-text-secondary">{t('subtitle')}</p>
        </div>
        <Link href={`/${locale}/farmer/animals/new`}>
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            {t('addAnimal')}
          </Button>
        </Link>
      </header>

      {/* KPI row */}
      <section className="mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-700 rounded-[16px] overflow-hidden border border-border-700">
          <KPI
            icon={Package}
            label={t('totalAnimals')}
            value={String(totalAnimals)}
            helper={`${fullyFunded} ${t('fullyFundedShort')}`}
          />
          <KPI
            icon={Users}
            label={t('totalInvestors')}
            value={String(totalInvestors)}
            accent="brand"
            helper={`${animals.filter(a => a.slots_filled > 0).length} ${t('activeListings')}`}
          />
          <KPI
            icon={TrendingUp}
            label={t('active')}
            value={String(growing)}
            helper={`${sold} ${t('completed')}`}
          />
          <KPI
            icon={CheckCircle}
            label={t('projectedPayout')}
            value={`₸${projectedPayout.toLocaleString('ru-RU')}`}
            accent="gold"
            helper={t('projectedPayoutNote')}
          />
        </div>
      </section>

      {/* Profile card */}
      <section className="surface-card rounded-[16px] p-5 md:p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
              {tProfile('profile.title')}
            </div>
            <h2 className="text-[14px] font-semibold text-text-primary mt-0.5">
              {tProfile('profile.title')}
            </h2>
          </div>
          <User className="w-4 h-4 text-brand" />
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center text-brand text-[18px] font-semibold shrink-0">
            {authName ? authName.charAt(0).toUpperCase() : 'Ф'}
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-text-primary truncate">
              {authName || '—'}
            </div>
            <Badge variant="brand" size="sm">{tProfile('profile.roleFarmer')}</Badge>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Mail className="w-3 h-3 text-text-tertiary shrink-0" />
              <span className="text-[12px] text-text-secondary truncate">{authEmail || '—'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => { setNewName(authName); setShowNameModal(true); }}>
            <Pencil className="w-3.5 h-3.5" />
            {tProfile('profile.changeName')}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShowPasswordModal(true)}>
            <Lock className="w-3.5 h-3.5" />
            {tProfile('profile.changePassword')}
          </Button>
          <button
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[12px] font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            onClick={() => alert(tProfile('profile.deleteAccountNote'))}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {tProfile('profile.deleteAccount')}
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile readiness */}
        <section className="surface-card rounded-[16px] p-5 md:p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {t('readinessLabel')}
              </div>
              <h2 className="text-[14px] font-semibold text-text-primary mt-0.5">
                {t('readinessTitle')}
              </h2>
            </div>
            <ShieldCheck className="w-4 h-4 text-brand" />
          </div>

          <div className="flex items-center gap-4 mb-5">
            <ReadinessRing score={profileScore} />
            <div className="flex-1 min-w-0">
              <div className="text-[24px] font-semibold text-text-primary tabular leading-none">
                {profileScore}%
              </div>
              <p className="mt-1.5 text-[12px] text-text-secondary leading-[1.5]">
                {t('readinessNote')}
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {profileTasks.map((task) => (
              <li key={task.key} className="flex items-center gap-2.5 text-[12.5px]">
                <span
                  className={clsx(
                    'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                    task.done
                      ? 'bg-brand/15 border-brand text-brand'
                      : 'bg-surface-800 border-border-700 text-text-tertiary',
                  )}
                >
                  {task.done ? (
                    <CheckCircle className="w-2.5 h-2.5" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-text-tertiary" />
                  )}
                </span>
                <span
                  className={clsx(
                    'flex-1 truncate',
                    task.done ? 'text-text-secondary line-through decoration-border-700' : 'text-text-primary',
                  )}
                >
                  {t(`profileTasks.${task.key}`)}
                </span>
                {!task.done && (
                  <button className="text-[11px] font-medium text-brand hover:text-brand-hover shrink-0">
                    {t('finish')} →
                  </button>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Listing health + hints */}
        <section className="surface-card rounded-[16px] p-5 md:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
                {t('healthLabel')}
              </div>
              <h2 className="text-[14px] font-semibold text-text-primary mt-0.5">
                {t('healthTitle')}
              </h2>
            </div>
            <Sparkles className="w-4 h-4 text-brand-secondary" />
          </div>

          <ul className="space-y-3">
            <HintRow
              icon={AlertTriangle}
              tone="warning"
              title={t('hints.updatePending.title')}
              body={t('hints.updatePending.body')}
              cta={t('hints.updatePending.cta')}
            />
            <HintRow
              icon={Sparkles}
              tone="gold"
              title={t('hints.priceOptimization.title')}
              body={t('hints.priceOptimization.body')}
              cta={t('hints.priceOptimization.cta')}
            />
            <HintRow
              icon={FileText}
              tone="tech"
              title={t('hints.newDoc.title')}
              body={t('hints.newDoc.body')}
              cta={t('hints.newDoc.cta')}
            />
          </ul>
        </section>
      </div>

      {/* Animal list — operations */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-text-tertiary">
              {t('listingsLabel')}
            </div>
            <h2 className="text-[16px] font-semibold text-text-primary mt-0.5">
              {t('myAnimals')}
            </h2>
          </div>
        </div>

        {animals.length === 0 ? (
          <div className="surface-card rounded-[16px] py-16 text-center">
            <p className="text-[13px] text-text-secondary mb-4">{t('noAnimals')}</p>
            <Link href={`/${locale}/farmer/animals/new`}>
              <Button variant="primary" size="md">
                <Plus className="w-4 h-4" />
                {t('addAnimal')}
              </Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {animals.map((animal) => {
              const fillPct = Math.round((animal.slots_filled / animal.slots_total) * 100);
              const currentStatusIdx = STATUS_ORDER.indexOf(animal.status);
              const nextStatus = STATUS_ORDER[currentStatusIdx + 1] as AnimalStatus | undefined;
              const assetId = `${animal.type.toUpperCase().slice(0, 2)}-2026-${String(animal.id).padStart(4, '0')}`;

              return (
                <li key={animal.id} className="surface-card rounded-[16px] overflow-hidden">
                  <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Identity */}
                    <div className="flex items-center gap-3 min-w-0 lg:w-72">
                      <div className="w-12 h-12 rounded-[10px] bg-surface-800 border border-border-700 overflow-hidden shrink-0">
                        {animal.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={animal.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Hash className="w-4 h-4 text-text-tertiary" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[14px] font-semibold text-text-primary truncate">
                            {animal.name}
                          </span>
                          <Badge variant={STATUS_VARIANTS[animal.status]} size="sm" dot>
                            {statusLabels[animal.status]}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-text-tertiary tabular font-mono truncate">
                          {assetId}
                        </div>
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex-1 grid grid-cols-3 gap-3 min-w-0">
                      <MiniStat label={t('price')} value={`₸${animal.price.toLocaleString('ru-RU')}`} />
                      <MiniStat
                        label={t('investorCount')}
                        value={`${animal.slots_filled} / ${animal.slots_total}`}
                        accent={animal.slots_filled >= animal.slots_total ? 'brand' : 'default'}
                      />
                      <MiniStat
                        label={t('fillProgress')}
                        value={`${fillPct}%`}
                      />
                    </div>

                    {/* Funding bar */}
                    <div className="lg:w-40 shrink-0">
                      <div className="h-1.5 rounded-full bg-surface-800 overflow-hidden mb-1.5">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${fillPct}%` }} />
                      </div>
                      {animal.slots_filled >= animal.slots_total ? (
                        <Badge variant="positive" size="sm">
                          <CheckCircle className="w-3 h-3" />
                          {t('fullyFunded')}
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-text-tertiary">
                          {animal.slots_total - animal.slots_filled} {t('slotsFree')}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setUpdateAnimalId(animal.id)}
                      >
                        <Activity className="w-3.5 h-3.5" />
                        {t('postUpdate')}
                      </Button>
                      {nextStatus && (
                        <Button
                          variant="tertiary"
                          size="sm"
                          onClick={() => updateStatus(animal.id, nextStatus)}
                        >
                          {statusLabels[nextStatus]}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Link
                        href={`/${locale}/animals/${animal.id}`}
                        className="w-9 h-9 inline-flex items-center justify-center rounded-[10px] border border-border-700 text-text-secondary hover:text-text-primary hover:border-border-600"
                        aria-label={t('viewListing')}
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Inline update composer */}
                  {updateAnimalId === animal.id && (
                    <div className="border-t border-border-700 p-4 md:p-5 bg-surface-800">
                      {updateSent === animal.id ? (
                        <div className="flex items-center gap-2 text-[13px] text-brand">
                          <CheckCircle className="w-4 h-4" />
                          {t('updateSent')}
                        </div>
                      ) : (
                        <>
                          <label
                            htmlFor={`update-${animal.id}`}
                            className="block text-[12px] text-text-tertiary uppercase tracking-[0.08em] mb-2"
                          >
                            {t('composerLabel')}
                          </label>
                          <textarea
                            id={`update-${animal.id}`}
                            value={updateText}
                            onChange={(e) => setUpdateText(e.target.value)}
                            placeholder={t('composerPlaceholder')}
                            rows={3}
                            className="w-full bg-bg-950 border border-border-700 rounded-[10px] px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/30 resize-none"
                          />
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-[11px] text-text-tertiary">
                              {t('composerHint')}
                            </span>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setUpdateAnimalId(null);
                                  setUpdateText('');
                                }}
                              >
                                {t('cancel')}
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSendUpdate}
                                disabled={!updateText.trim()}
                              >
                                <Send className="w-3.5 h-3.5" />
                                {t('send')}
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Edit name modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-950/70 backdrop-blur-[4px]">
          <div className="surface-elevated w-full max-w-sm rounded-[18px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-700">
              <div className="text-[15px] font-semibold text-text-primary">
                {tProfile('profile.changeNameTitle')}
              </div>
            </div>
            <div className="px-5 py-5">
              <Input
                id="new-name"
                label={tProfile('profile.newName')}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="px-5 py-4 border-t border-border-700 flex gap-2">
              <Button variant="ghost" size="md" fullWidth onClick={() => setShowNameModal(false)}>
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={saving}
                onClick={handleSaveName}
                disabled={!newName.trim() || saving}
              >
                {saved ? tProfile('profile.saved') : saving ? tProfile('profile.saving') : tProfile('profile.save')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-950/70 backdrop-blur-[4px]">
          <div className="surface-elevated w-full max-w-sm rounded-[18px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-700">
              <div className="text-[15px] font-semibold text-text-primary">
                {tProfile('profile.changePasswordTitle')}
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <Input
                id="new-password"
                label={tProfile('profile.newPassword')}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                id="confirm-password"
                label={tProfile('profile.confirmPassword')}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="px-5 py-4 border-t border-border-700 flex gap-2">
              <Button variant="ghost" size="md" fullWidth onClick={() => setShowPasswordModal(false)}>
                {t('cancel')}
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                loading={saving}
                onClick={handleSavePassword}
                disabled={!newPassword.trim() || saving}
              >
                {saved ? tProfile('profile.saved') : saving ? tProfile('profile.saving') : tProfile('profile.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   Bits
   ============================================================ */

function KPI({
  icon: Icon,
  label,
  value,
  helper,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  helper?: React.ReactNode;
  accent?: 'brand' | 'positive' | 'gold';
}) {
  const color =
    accent === 'brand'
      ? 'text-brand'
      : accent === 'positive'
        ? 'text-positive'
        : accent === 'gold'
          ? 'text-brand-secondary'
          : 'text-text-primary';
  return (
    <div className="bg-surface-900 p-5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-text-tertiary mb-3">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className={clsx('text-[24px] md:text-[26px] font-semibold tabular leading-none', color)}>
        {value}
      </div>
      {helper && <div className="mt-2 text-[11.5px] text-text-tertiary">{helper}</div>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: 'brand' | 'default';
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-[0.08em] text-text-tertiary mb-0.5">
        {label}
      </div>
      <div
        className={clsx(
          'text-[14px] font-semibold tabular truncate',
          accent === 'brand' ? 'text-brand' : 'text-text-primary',
        )}
      >
        {value}
      </div>
    </div>
  );
}

function ReadinessRing({ score }: { score: number }) {
  const size = 64;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-800)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
    </div>
  );
}

function HintRow({
  icon: Icon,
  tone,
  title,
  body,
  cta,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'warning' | 'gold' | 'tech' | 'brand';
  title: string;
  body: string;
  cta: string;
}) {
  const box = {
    warning: 'bg-warning/10 border-warning/25 text-warning',
    gold: 'bg-brand-secondary/10 border-brand-secondary/25 text-brand-secondary',
    tech: 'bg-tech/10 border-tech/25 text-tech',
    brand: 'bg-brand/10 border-brand/25 text-brand',
  }[tone];
  return (
    <li className="flex items-start gap-3">
      <div
        className={clsx(
          'w-8 h-8 rounded-[9px] border flex items-center justify-center shrink-0',
          box,
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-text-primary leading-snug">
          {title}
        </div>
        <div className="text-[12px] text-text-secondary leading-[1.55] mt-0.5">
          {body}
        </div>
      </div>
      <button className="text-[12px] font-medium text-brand hover:text-brand-hover shrink-0 whitespace-nowrap">
        {cta} →
      </button>
    </li>
  );
}
